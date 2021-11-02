<template>
  <el-card style="margin: 5px" :class="selected ? 'selected' : ''"
    ><div @click="handleClick">
      <div class="header">
        <div class="order-title">
          {{ orderItem.realName }} - {{ format(orderItem.createdAt) }}叫车 ({{
            orderItem.number
          }}人)
        </div>
        <div class="status">接单超时</div>
      </div>
      <div class="body">
        <div class="station">
          <div class="item">
            上车点:
            <el-tag
              type=""
              size="mini"
              style="margin-right: 5px; cursor: pointer"
              @click.stop="handleUpClick"
              >{{ orderItem.upStationName }}</el-tag
            >
          </div>
          <div class="item">
            下车点:
            <el-tag
              type="danger"
              size="mini"
              v-for="(station, index) in orderItem.downStations"
              :key="index"
              style="margin-right: 5px; cursor: pointer"
              @click.stop="handleDownClick(station)"
              >{{ station.stationName }}</el-tag
            >
          </div>
        </div>
        <div class="action">
          <div style="line-height: 60px">
            <el-button
              size="mini"
              v-permission="['manage:screen']"
              type="primary"
              @click="handleAssign"
              >人工分配</el-button
            >
          </div>
        </div>
      </div>
      <div class="remark" v-if="orderItem.remark && orderItem.remark != ''">
        <el-tag type="warning" effect="dark" size="mini"
          >备注: {{ orderItem.remark }}</el-tag
        >
      </div>
    </div></el-card
  >
</template>

<script>
import dayjs from "dayjs";
export default {
  props: {
    orderItem: {
      default: () => {},
    },
    selected: {
      default: () => false,
    },
  },
  methods: {
    format(date) {
      if (!date) {
        return "";
      }
      return dayjs(date).format("HH:mm");
    },
    handleClick() {
      this.$emit("click", {
        ...this.orderItem,
      });
    },
    handleAssign() {
      this.$emit("assignClick", this.orderItem);
    },
    handleUpClick() {
      const item = this.orderItem;
      this.$emit("upClick", {
        id: item.upStationId,
        name: item.upStationName,
        lat: item.upStationLatitude,
        lng: item.upStationLongitude,
        type: "up",
      });
    },
    handleDownClick(item) {
      this.$emit("downClick", {
        id: item.id,
        name: item.stationName,
        lat: item.latitude,
        lng: item.longitude,
        type: "down",
      });
    },
  },
};
</script>

<style scoped>
.header {
  font-size: 14px;
  display: flex;
}
.selected {
  border: 2px solid #046409 !important;
}
.status {
  width: 60px;
  color: #f56c6c;
  display: flex;
  font-weight: 600;
}
.order-title {
  display: flex;
  flex-grow: 1;
}
.body {
  display: flex;
  flex: 1 100px;
}
.action {
  width: 70px;
  display: flex;
}
.station {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  font-size: 14px;
}
.item {
  padding: 5px 0px;
}
.remark {
  display: flex;
  padding: 5px 0;
  font-size: 12px;
}
</style>