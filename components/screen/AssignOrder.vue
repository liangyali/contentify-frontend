<template>
  <div>
    <el-card>
      <el-table :data="items" style="width: 100%" v-loading="loading">
        <el-table-column prop="carNumber" label="车牌" width="100" />
        <el-table-column prop="realName" label="司机" width="100" />
        <el-table-column prop="staffNo" label="工号" width="100">
        </el-table-column>
        <el-table-column
          prop="processingOrderCount"
          label="进行中订单数"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="totalUsers" label="车辆载客数量" width="120">
          <template slot-scope="scope">
            {{ scope.row.totalUsers || 0 }}/{{ scope.row.capacity }}
          </template>
        </el-table-column>
        <el-table-column />
        <el-table-column label="分配" width="100">
          <template slot-scope="scope">
            <el-popconfirm
              title="确定分配吗？"
              @confirm="handleAssign(scope.row)"
            >
              <el-button
                slot="reference"
                size="mini"
                type="primary"
                :loading="scope.row.assiging"
                >分配</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
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
      this.loadData();
    },
  },
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
    handleAssign(item) {
      item.assiging = true;
      this.$axios
        .post(`/api/v1/overview/${this.id}/assign/${item.id}`)
        .then(() => {
          this.$emit("success");
          this.$emit("cancel");
        })
        .finally(() => {
          item.assiging = false;
        });
    },
  },
};
</script>