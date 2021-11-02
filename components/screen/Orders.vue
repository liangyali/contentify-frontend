<template>
  <div class="overview">
    <div class="header">今日订单任务</div>
    <div class="container">
      <div class="card">
        <div class="label">总数</div>
        <div class="number">{{ item.totalCount }}</div>
      </div>
      <div class="card">
        <div class="label">进行中</div>
        <div class="number">{{ item.processingCount }}</div>
      </div>
      <div class="card">
        <div class="label">待接单</div>
        <div class="number">{{ item.pendingCount }}</div>
      </div>
      <div class="card">
        <div class="label">接单超时</div>
        <div class="number">{{ item.timeoutCount }}</div>
      </div>
    </div>
    <div class="order-container">
      <AssignOrderCard
        :orderItem="orderItem"
        v-for="(orderItem, index) in item.timeoutOrders"
        :key="'card' + index"
        :selected="orderItem.id == selectedId"
        @click="handleClick(orderItem)"
        @upClick="handleUpClick"
        @downClick="handleDownClick"
        @assignClick="handleAssign"
      />
    </div>
    <el-drawer
      title="手工分配"
      size="60%"
      :visible.sync="showVisiable"
      direction="rtl"
      append-to-body
    >
      <AssignOrder :id="order.id" @success="handleAssignSuccess" />
    </el-drawer>
  </div>
</template>

<script>
import AssignOrder from "./AssignOrder";
export default {
  timers: {
    loadData: { time: 5000, repeat: true, autostart: true },
  },
  components: {
    AssignOrder,
  },
  created() {
    this.loadData();
  },
  data() {
    return {
      showVisiable: false,
      selectedId: 0,
      item: {
        totalCount: "--",
        processingCount: "--",
        pendingCount: "--",
        timeoutCount: "--",
      },
      order: {},
    };
  },
  methods: {
    loadData() {
      this.$axios.get("/api/v1/overview/order_overview").then((res) => {
        this.item = {
          ...res.data.data,
        };
      });
    },
    handleAssignSuccess() {
      this.showVisiable = false;
      this.loadData();
    },
    handleClick(item) {
      this.selectedId = item.id;
      this.$emit("click", item);
    },
    handleUpClick(item) {
      this.$emit("upClick", item);
    },
    handleDownClick(item) {
      this.$emit("downClick", item);
    },
    handleAssign(item) {
      this.order = item;
      this.showVisiable = true;
    },
  },
};
</script>

<style scoped>
.overview {
  position: absolute;
  top: 230px;
  width: 380px;
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
  border-bottom: 1px solid #f2f6fc;
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
.order-container {
  padding: 10px;
  min-height: 300px;
  max-height: 480px;
  overflow: auto;
  margin-bottom: 15px;
}
</style>