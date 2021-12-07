<template>
  <page-container title="广告管理">
    <el-card>
      <el-table :data="banners || []" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="编号" width="100"> </el-table-column>
        <el-table-column prop="name" label="名称" width="100">
        </el-table-column>
        <el-table-column prop="key" label="访问名称"> </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180">
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.updatedAt || "--" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-drawer
      title="编辑广告"
      size="100%"
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
import UpdateForm from "~/components/banners/UpdateForm";
export default {
  data() {
    return {
      loading: false,
      showVisiable: false,
      item: {
        id: 0,
      },
      banners: [],
    };
  },
  components: {
    UpdateForm,
  },
  created() {
    this.getBanners({
      ...this.$route.query,
    });
  },
  methods: {
    reload() {
      this.getBanners({
        ...this.$route.query,
      });
    },

    getBanners(params) {
      this.loading = true;
      this.$axios
        .get(`/admin/api/v1/banners`, {
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
          this.banners = res.data.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleEdit(row) {
      this.item = row;
      this.showVisiable = true;
    },
  },
};
</script>

