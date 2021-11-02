<template>
  <page-container title="角色列表">
    <template v-slot:actions
      ><CreateFormButton
        @success="reload"
        v-permission="['manage:roles']"
      /><el-button
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
        :data="roles.records || []"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="编号" width="100"> </el-table-column>
        <el-table-column prop="name" label="角色名称" width="100">
        </el-table-column>
        <el-table-column prop="description" label="描述">
          <template slot-scope="scope">
            {{ scope.row.description || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.updatedAt || "--" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              v-permission="['manage:roles']"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除吗？"
              @confirm="doDelete(scope.row)"
              v-permission="['manage:roles']"
            >
              <el-button
                v-permission="['manage:roles']"
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
          v-if="roles.total > 0"
          @current-change="handleCurrentChange"
          :current-page="roles.current"
          :page-size="filter.pageSize"
          background
          layout="total,prev, pager, next"
          :total="roles.total"
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
  </page-container>
</template>

<script>
import qs from "qs";
import CreateFormButton from "~/components/roles/CreateFormButton";
import UpdateForm from "~/components/roles/UpdateForm";
export default {
  data() {
    return {
      filter: { pageSize: 12 },
      loading: false,
      showVisiable: false,
      item: {
        id: 0,
      },
      roles: {
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
  },
  created() {
    this.getRoles({
      ...this.$route.query,
    });
  },
  methods: {
    reload() {
      this.getRoles({
        ...this.$route.query,
      });
    },
    doDelete(row) {
      row.deleting = true;
      this.$axios
        .delete(`/api/v1/roles/${row.id}`)
        .then(() => {
          this.reload();
        })
        .finally(() => {
          row.deleting = false;
        });
    },
    getRoles(params) {
      this.loading = true;
      this.$axios
        .get(`/api/v1/roles`, {
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
          this.roles = {
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

      this.getRoles(params);
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

      this.getRoles(params);
    },
    handleEdit(row) {
      this.item = row;
      this.showVisiable = true;
    },
  },
};
</script>

