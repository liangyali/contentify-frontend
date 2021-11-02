<template>
  <div class="overview">
    <div class="header">车辆概览</div>
    <div class="container">
      <div class="card">
        <div class="label">出车</div>
        <div class="number">{{ item.outCount }}</div>
      </div>
      <div class="card">
        <div class="label">备车</div>
        <div class="number">{{ item.readyCount }}</div>
      </div>
      <div class="card">
        <div class="label">已接单</div>
        <div class="number">{{ item.orderCount }}</div>
      </div>
      <div class="card">
        <div class="label">已停用</div>
        <div class="number">{{ item.unavailableCount }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  timers: {
    loadData: { time: 5000, repeat: true, autostart: true },
  },
  created() {
    this.loadData();
  },
  data() {
    return {
      item: {
        outCount: "--",
        readyCount: "--",
        orderCount: "--",
        unavailableCount: "--",
      },
    };
  },
  methods: {
    loadData() {
      this.$axios.get("/api/v1/overview/car_stats").then((res) => {
        this.item = {
          ...res.data.data,
        };
      });
    },
  },
};
</script>

<style scoped>
.overview {
  position: absolute;
  top: 60px;
  width: 380px;
  height: 160px;
  background: #fff;
  right: 20px;
  opacity: 0.95;
  border-radius: 20px;
  border: 1px solid #f2f6fc;
  z-index: 2000;
}
.header {
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}
.container {
  padding: 10px 15px;
  display: flex;
}
.card {
  width: 90px;
}
.card .label {
  padding: 5px;
  font-size: 14px;
}
.card .number {
  padding: 5px;
  font-size: 28px;
  font-weight: 600;
}
</style>