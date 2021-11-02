<template>
  <div style="padding: 5px">
    <div style="padding: 5px">
      <el-button size="mini" @click="reload">更新数据</el-button>
    </div>
    <el-table :data="items" style="width: 100%" v-loading="loading">
      <el-table-column prop="carNumber" label="车牌" width="100" />
      <el-table-column prop="realName" label="司机" width="80" />
      <el-table-column
        prop="processingOrderCount"
        label="进行中订单数"
        width="120"
      >
      </el-table-column>
      <el-table-column prop="totalUsers" label="载客" width="60">
        <template slot-scope="scope">
          {{ scope.row.totalUsers || 0 }}/{{ scope.row.capacity }}
        </template>
      </el-table-column>
      <el-table-column label="定位">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleLocation(scope.row)"
            >定位</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      items: [],
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    reload() {
      this.loadData();
    },
    loadData() {
      this.loading = true;
      this.$axios
        .get("/api/v1/overview/active_drivers")
        .then((res) => {
          this.items = res.data.data || {};
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleLocation(row) {
      this.$emit("clickLocation", {
        lng: row.longitude,
        lat: row.latitude,
      });
    },
  },
};
</script>