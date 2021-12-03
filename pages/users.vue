<template>
  <page-container title="用户列表">
    <template v-slot:actions
      ><CreateFormButton
        @success="reload"
        v-permission="['admin.users:full']"
      /><el-button
        type="default"
        size="mini"
        @click="reload"
        icon="el-icon-refresh
"
        >刷新</el-button
      ></template
    >
    <el-form :inline="true" :model="filter" size="mini">
      <div class="filter">
        <el-form-item label="用户名" label-width="60px">
          <el-input
            :rows="5"
            placeholder="请输入用户名"
            clearable=""
            v-model="filter.username"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="handleFilterChange"
            ></el-button>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <el-card>
      <el-table
        :data="users.records || []"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="编号" fixed="" width="100">
        </el-table-column>
        <el-table-column prop="username" fixed="" label="用户名" width="100">
        </el-table-column>
        <el-table-column prop="realName" fixed="" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="phoneNumber" label="手机号" width="180">
        </el-table-column>
        <el-table-column prop="email" label="电子邮箱" width="180">
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
        </el-table-column>
        <el-table-column> </el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              v-permission="['admin.users:full']"
              >编辑</el-button
            >
            <el-button
              size="mini"
              @click="handleResetPassword(scope.row)"
              v-permission="['admin.users:full']"
              >重置密码</el-button
            >
            <el-popconfirm
              title="确定删除吗？"
              @confirm="doDelete(scope.row)"
              v-permission="['admin.users:full']"
            >
              <el-button
                slot="reference"
                size="mini"
                type="danger"
                :loading="scope.row.deleting"
                >删除</el-button
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-if="users.total > 0"
          @current-change="handleCurrentChange"
          :current-page="users.current"
          :page-size="filter.pageSize - 0"
          background
          layout="total,prev, pager, next"
          :total="users.total"
        ></el-pagination>
      </div>
    </el-card>
    <el-drawer
      title="编辑用户信息"
      width="650px"
      :visible.sync="showVisiable"
      direction="rtl"
      append-to-body
    >
      <UpdateForm
        :id="item.id"
        @success="reload"
        @cancel="showVisiable = false"
      />
    </el-drawer>
    <el-drawer
      title="重置密码"
      width="650px"
      :visible.sync="showResetPasswordVisiable"
      direction="rtl"
      append-to-body
    >
      <ResetPasswordForm
        :item="resetPasswordItem"
        @success="onRestPasswordSuccess"
        @cancel="showResetPasswordVisiable = false"
      />
    </el-drawer>
  </page-container>
</template>

<script>
import qs from "qs";
import CreateFormButton from "~/components/users/CreateFormButton";
import UpdateForm from "~/components/users/UpdateForm";
import ResetPasswordForm from "~/components/users/ResetPasswordForm";
export default {
  data() {
    return {
      filter: { pageSize: 12 },
      loading: false,
      item: {},
      resetPasswordItem: {},
      showVisiable: false,
      showBindVisiable: false,
      showResetPasswordVisiable: false,
      users: {
        total: 0,
        pageNum: 1,
        pageSize: 1,
        records: [],
      },
    };
  },
  components: {
    CreateFormButton,
    UpdateForm,
    ResetPasswordForm,
  },
  created() {
    this.filter = {
      ...this.filter,
      ...this.$route.query,
    };
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
        .get(`/admin/api/v1/users`, {
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
    handleEdit(row) {
      this.item = row;
      this.showVisiable = true;
    },
    handleResetPassword(row) {
      this.resetPasswordItem = {
        ...row,
      };
      this.showResetPasswordVisiable = true;
    },
    doDelete(row) {
      row.deleting = true;
      this.$axios
        .delete(`/admin/api/v1/users/${row.id}`)
        .then(() => {
          this.reload();
        })
        .finally(() => {
          row.deleting = false;
        });
    },
    handleShowBindVisiable(row) {
      this.bindItem = row;
      this.showBindVisiable = true;
    },
    onBindSuccess() {
      this.reload();
      this.showBindVisiable = false;
    },
    onRestPasswordSuccess() {
      this.reload();
      this.showResetPasswordVisiable = false;
    },
  },
};
</script>

