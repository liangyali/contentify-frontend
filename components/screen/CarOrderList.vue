<template>
  <div style="padding: 15px">
    <div class="title">总共{{ total }}个订单</div>
    <OrderCard :orderItem="item" v-for="item in items" :key="item.id" />
  </div>
</template>

<script>
import OrderCard from "~/components/OrderCard";
export default {
  props: {
    carId: {
      default: () => 0,
    },
  },
  watch: {
    carId() {
      this.loadData();
    },
  },
  components: {
    OrderCard,
  },
  created() {
    this.loadData();
  },
  data() {
    return {
      showVisiable: false,
      selectedId: 0,
      order: {},
      items: [],
      total: "--",
    };
  },

  methods: {
    loadData() {
      if (!this.carId) {
        return;
      }
      this.$axios
        .get("/api/v1/overview/orders", {
          params: {
            carId: this.carId,
            pageSize: 50000,
            page: 1,
            includeOrderStatus: "2,3,4",
          },
        })
        .then((res) => {
          this.items = res.data.data.records;
          this.total = res.data.data.total;
        });
    },
  },
};
</script>

<style scoped>
.title {
  padding: 5px 20px;
  font-size: 14px;
}
</style>