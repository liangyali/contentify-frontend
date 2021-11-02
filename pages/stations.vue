<template>
  <page-container title="车站管理" :padding="false">
    <template v-slot:actions
      ><CreateFormButton @success="reload" /><el-button
        type="default"
        size="mini"
        icon="el-icon-refresh
"
        @click="reload"
        >刷新</el-button
      ></template
    >
    <div>
      <baidu-map
        class="bm-view"
        :center="center"
        :zoom="zoom"
        @ready="handler"
        inertial-dragging
        :mapStyle="mapStyle"
      >
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation
        ><bm-copyright anchor="BMAP_ANCHOR_TOP_RIGHT"> </bm-copyright>
        <bm-overview-map
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :isOpen="true"
        ></bm-overview-map>
        <bm-map-type
          :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']"
          anchor="BMAP_ANCHOR_TOP_LEFT"
        ></bm-map-type
        ><bm-marker
          v-for="location in locations"
          :key="location.id"
          :dragging="false"
          @dragging="handleDragging"
          @dblclick="handleEdit(location)"
          :icon="{
            url: getImgUrl('/img/marker.png'),
            size: { width: 32, height: 32 },
          }"
          :position="{ lng: location.longitude, lat: location.latitude }"
          :labelStyle="{ color: 'red', fontSize: '12px', border: 0 }"
        >
          <bm-label
            :content="location.name + ''"
            :labelStyle="{
              color: '#909399',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: '',
              border: '0',
              width: '10px',
              textAlight: 'center',
            }"
            :offset="{ width: 5, height: 34 }" /></bm-marker
      ></baidu-map>
    </div>

    <el-drawer
      title="编辑停车点"
      size="90%"
      :visible.sync="showEditVisiable"
      direction="rtl"
      append-to-body
    >
      <UpdateForm
        :id="item.id"
        @success="onEditSuccess"
        @cancel="showEditVisiable = false"
      />
    </el-drawer>
  </page-container>
</template>
<script>
import CreateFormButton from "~/components/stations/CreateFormButton";
import UpdateForm from "~/components/stations/UpdateForm";
export default {
  data() {
    return {
      center: { lng: 0, lat: 0 },
      zoom: 18,
      loading: true,
      locations: [],
      item: {},
      showEditVisiable: false,
      loading: false,
      mapStyle: {
        style: "grayscale",
      },
      form: {},
    };
  },
  created() {
    this.loadStations();
  },
  components: {
    UpdateForm,
    CreateFormButton,
  },
  methods: {
    reload() {
      this.loadStations();
    },
    getImgUrl(url) {
      return `${process.env.staticPrefix}${url}`;
    },
    handler({ BMap, map }) {
      this.center.lng = 116.60958198060929;
      this.center.lat = 40.086415358916604;
      this.zoom = 17;
    },
    handleDragging({ type, target, pixel, point }) {
      this.$EventBus.$emit("locationChange", point);
    },
    loadStations() {
      this.loading = true;
      this.$axios
        .get("/api/v1/stations")
        .then((res) => {
          this.locations = res.data.data || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(item) {
      this.item = {
        ...item,
      };
      this.showEditVisiable = true;
      console.log(item);
    },
    onEditSuccess() {
      this.loadStations();
      this.showEditVisiable = false;
    },
  },
};
</script>

<style>
.bm-view {
  position: relative;
  top: 0;
  width: 100%;
  height: 90vh;
  bottom: 100px;
  z-index: 1;
}

.title {
  position: absolute;
  z-index: 100000;
  width: 400px;
  top: 0;
  left: 50%;
  margin-left: -200px;
  font-weight: 600;
  font-size: 24px;
  background: #fff;
  opacity: 0.9;
  padding: 10px;
  text-align: center;
  border-radius: 0px 0px 10px 10px;
}
</style>