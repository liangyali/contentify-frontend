<template>
  <el-card style="margin: 10px">
    <el-button
      type="default"
      size="mini"
      @click="reload"
      icon="el-icon-refresh
"
      >刷新</el-button
    >
    <el-table
      :data="logs.records || []"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="type" label="记录类型" width="80">
      </el-table-column>
      <el-table-column prop="createdAt" label="使用时间" width="180">
      </el-table-column>
      <el-table-column prop="userName" label="使用人" width="150">
      </el-table-column>
      <el-table-column prop="vkt" label="车辆公里数" width="150">
      </el-table-column>

      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column> </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-if="logs.total > 0"
        @current-change="handleCurrentChange"
        :current-page="logs.current"
        :page-size="filter.pageSize"
        background
        layout="total,prev, pager, next"
        :total="logs.total"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    id: {
      default: () => 0,
    },
  },
  watch: {
    id() {
      this.getLogs();
    },
  },
  data() {
    return {
      filter: { pageSize: 10 },
      loading: false,
      logs: {
        total: 0,
        pageNum: 1,
        pageSize: 1,
        records: [],
      },
    };
  },
  created() {
    this.getLogs();
  },
  methods: {
    reload() {
      this.getLogs();
    },
    getLogs(parms) {
      this.loading = true;
      this.$axios
        .get(`/api/v1/cars/${this.id}/use_logs`, {
          params: {
            ...parms,
          },
        })
        .then((res) => {
          this.logs = {
            ...res.data.data,
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCurrentChange(val) {
      const params = {
        ...this.$route.query,
        page: val,
      };

      this.getLogs(params);
    },
  },
};
</script>

