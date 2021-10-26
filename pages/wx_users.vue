<template>
  <page-container title="微信授权用户列表">
    <template v-slot:actions
      ><el-button
        type="default"
        size="mini"
        @click="reload"
        icon="el-icon-refresh
"
        >刷新</el-button
      ></template
    >
    <el-card>
      <el-table
        :data="users.records || []"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="编号" width="100"> </el-table-column>
        <el-table-column label="头像" width="100">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.avatarUrl"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="微信昵称"> </el-table-column>
        <el-table-column prop="phoneNumber" label="授权电话"> </el-table-column>
        <el-table-column prop="openid" label="openid" width="250">
        </el-table-column>
        <el-table-column prop="unionid" label="unionid"> </el-table-column>
        <el-table-column> </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-if="users.total > 0"
          @current-change="handleCurrentChange"
          :current-page="users.current"
          :page-size="filter.pageSize"
          background
          layout="total,prev, pager, next"
          :total="users.total"
        ></el-pagination>
      </div>
    </el-card>
  </page-container>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      filter: { pageSize: 12 },
      loading: false,
      users: {
        total: 0,
        pageNum: 1,
        pageSize: 1,
        records: [],
      },
    };
  },
  created() {
    this.getUsers({
      ...this.$route.query,
    });
  },
  methods: {
    reload() {
      this.getUsers({
        ...this.$route.query,
      });
    },
    getUsers(params) {
      this.loading = true;
      this.$axios
        .get(`/api/v1/users/wx_users`, {
          params: {
            ...this.filter,
            ...this.$route.params,
            ...params,
          },
          paramsSerializer: (params) => {
            return qs.stringify(params);
          },
        })
        .then((res) => {
          this.users = {
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
      this.$router.push({
        path: "",
        query: params,
      });

      this.getUsers(params);
    },
    handleFilterChange() {
      const params = {
        ...this.$route.query,
        ...this.filter,
        page: 1,
      };
      this.$router.push({
        path: "",
        query: params,
      });

      this.getUsers(params);
    },
  },
};
</script>

