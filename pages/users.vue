<template>
  <page-container title="用户列表">
    <template v-slot:actions
      ><CreateFormButton @success="reload" /><el-button
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
        <el-form-item label="已开通系统" label-width="100px">
          <el-select
            v-model="filter.enabledSystem"
            multiple=""
            placeholder="选择开通的系统"
            clearable=""
            @change="handleFilterChange"
          >
            <el-option label="叫车" value="call"> </el-option>
            <el-option label="司机" value="driver"> </el-option>
            <el-option label="调度" value="manage"> </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <el-card>
      <el-table
        :data="users.records || []"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="编号" width="100"> </el-table-column>
        <el-table-column label="头像" width="100">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.picture"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="staffNo" label="员工号" width="100">
        </el-table-column>
        <el-table-column prop="wxUserNickName" label="关联微信号" width="150">
        </el-table-column>
        <el-table-column prop="wxUserNickName" label="是否关联微信" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.wxUserId == 0">
              <el-button
                icon="el-icon-link"
                type="primary"
                size="mini"
                @click="handleShowBindVisiable(scope.row)"
                >关联微信</el-button
              >
            </div>
            <div v-if="scope.row.wxUserId != 0">
              <el-popconfirm
                title="确认取消微信绑定"
                @confirm="doUnbindWxUser(scope.row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-link"
                  :loading="scope.row.deleting"
                  >取消关联</el-button
                >
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" width="100">
        </el-table-column>

        <el-table-column prop="phoneNumber" label="手机号" width="180">
        </el-table-column>

        <el-table-column label="已开通系统" width="150">
          <template slot-scope="scope">
            <el-tag type="success" size="mini" v-if="scope.row.isEnabledCall"
              >叫车</el-tag
            >
            <el-tag type="success" size="mini" v-if="scope.row.isEnabledDriver"
              >司机</el-tag
            >
            <el-tag type="success" size="mini" v-if="scope.row.isEnabledManage"
              >调度</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="所属公司" width="200">
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
        </el-table-column>
        <el-table-column> </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-popconfirm title="确定删除吗？" @confirm="doDelete(scope.row)">
              <el-button
                slot="reference"
                type="danger"
                size="mini"
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
          :page-size="filter.pageSize"
          background
          layout="total,prev, pager, next"
          :total="users.total"
        ></el-pagination>
      </div>
    </el-card>
    <el-drawer
      title="编辑"
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
      title="关联微信"
      width="650px"
      :visible.sync="showBindVisiable"
      direction="rtl"
      append-to-body
    >
      <BindForm
        :item="bindItem"
        @success="onBindSuccess"
        @cancel="showBindVisiable = false"
      />
    </el-drawer>
  </page-container>
</template>

<script>
import CreateFormButton from "~/components/users/CreateFormButton";
import UpdateForm from "~/components/users/UpdateForm";
import BindForm from "~/components/users/BindForm";
export default {
  data() {
    return {
      filter: { pageSize: 12 },
      loading: false,
      item: {},
      bindItem: {},
      showVisiable: false,
      showBindVisiable: false,
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
    BindForm,
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
        .get(`/api/v1/users`, {
          params: {
            ...this.filter,
            ...this.$route.params,
            ...params,
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
    doUnbindWxUser(row) {
      row.deleting = true;
      this.$axios
        .post(`/api/v1/users/unbind_wx_user`, {
          sysUserId: row.id,
        })
        .then(() => {
          this.reload();
        })
        .finally(() => {
          row.deleting = false;
        });
    },
    doDelete(row) {
      row.deleting = true;
      this.$axios
        .delete(`/api/v1/users/${row.id}`)
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
  },
};
</script>

