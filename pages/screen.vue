<template>
  <div v-loading="loading">
    <div class="header">
      <img :src="getImgUrl('/img/logo.png')" width="80" />
      <span>华北车辆调度中心</span>
      <el-button class="back-button" size="mini" @click="goHome"
        >切换到后台管理</el-button
      >
    </div>
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
      @ready="handler"
      inertial-dragging
      :mapStyle="mapStyle"
    >
      <div v-for="(location, index) in upStations" :key="'c3' + index">
        <UpOverlay
          :title="location.name"
          :position="{
            lat: location.lat,
            lng: location.lng,
          }"
          :type="location.type"
          @mouseover.native="active = true"
          @mouseleave.native="active = false"
        >
        </UpOverlay>
      </div>
      <div v-for="(location, index) in downStations" :key="'c2' + index">
        <DownOverlay
          :title="location.name"
          :position="{
            lat: location.lat,
            lng: location.lng,
          }"
          :type="location.type"
          @mouseover.native="active = true"
          @mouseleave.native="active = false"
        >
        </DownOverlay>
      </div>
      <div v-for="(car, index) in cars" :key="'c1' + index">
        <CarOverlay
          :title="car.carNumber"
          :position="{ lng: car.longitude, lat: car.latitude }"
          @mouseover.native="active = true"
          @mouseleave.native="active = false"
        >
        </CarOverlay>
      </div>
      <bm-navigation
        anchor="BMAP_ANCHOR_TOP_LEFT"
        :offset="{ width: 10, height: 50 }"
      ></bm-navigation>
      <bm-overview-map
        anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
        :isOpen="false"
      ></bm-overview-map>
      <bm-marker
        v-for="(location, index) in locations"
        :key="index"
        :dragging="false"
        :icon="{
          url: getImgUrl('/img/green.png'),
          size: { width: 64, height: 64 },
        }"
        :position="{ lng: location.longitude, lat: location.latitude }"
        :labelStyle="{ color: 'red', fontSize: '12px', border: 0 }"
      >
      </bm-marker>
      <bm-map-type
        :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
        anchor="BMAP_ANCHOR_TOP_LEFT"
      ></bm-map-type>
    </baidu-map>
    <Overview />
    <Orders
      @click="handleClick"
      @upClick="handleStationClick"
      @downClick="handleStationClick"
    />
  </div>
</template>

<script>
import Overview from "~/components/screen/Overview";
import Orders from "~/components/screen/Orders";
import UpOverlay from "~/components/screen/UpOverlay";
import DownOverlay from "~/components/screen/DownOverlay";
import CarOverlay from "~/components/screen/CarOverlay";
import AssignOrder from "~/components/screen/AssignOrder";
export default {
  layout: "full",
  components: {
    Overview,
    Orders,
    UpOverlay,
    DownOverlay,
    CarOverlay,
    AssignOrder,
  },
  created() {},
  timers: {
    loadCars: { time: 1000, repeat: true, autostart: true },
  },
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 18,
      showVisiable: false,
      cars: [],
      locations: [],
      upStations: [],
      downStations: [],
      loading: true,
      mapStyle: {
        style: "grayscale",
      },
    };
  },
  methods: {
    getImgUrl(url) {
      return `${process.env.staticPrefix}${url}`;
    },
    loadCars() {
      this.$axios.get("/api/v1/cars/active").then((res) => {
        this.cars = res.data.data || [];
      });
    },
    handler({ BMap, map }) {
      this.center.lng = 116.60958198060929;
      this.center.lat = 40.086415358916604;
      this.zoom = 17;
      this.loading = false;
    },
    goHome() {
      this.$router.push("/");
    },
    handleClick(item) {
      this.upStations = [
        {
          id: item.upStationId,
          name: item.upStationName,
          lat: item.upStationLatitude,
          lng: item.upStationLongitude,
          type: "up",
        },
      ];

      const downStations = [];
      for (let dowStation of item.downStations) {
        downStations.push({
          id: dowStation.id,
          name: dowStation.stationName,
          lat: dowStation.latitude,
          lng: dowStation.longitude,
          type: "down",
        });
      }

      this.downStations = downStations;
      this.center.lng = item.upStationLongitude;
      this.center.lat = item.upStationLatitude;
      this.zoom = 16;
    },
    handleStationClick(item) {
      this.center.lng = item.lng;
      this.center.lat = item.lat;
      this.zoom = 16;
    },
  },
};
</script>

<style scoped>
.bm-view {
  padding-top: 45px;
  width: 100%;
  height: 100vh;
}
.header {
  position: absolute;
  z-index: 2000;
  width: 100%;
  font-weight: 600;
  font-size: 16px;
  background: rgb(255, 255, 255);
  opacity: 0.9;
  color: #303133;
  padding: 10px;
  text-align: center;
  border-radius: 0px 0px 10px 10px;
  border-bottom: 1px solid rgb(251, 250, 250);
}
.back-button {
  position: absolute;
  right: 20px;
}
</style>
