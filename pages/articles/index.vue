<template>
  <page-container title="文章管理">
    <template v-slot:actions
      ><CreateFormButton
        @success="reload"
        v-permission="['admin.articles:full']"
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
        <el-form-item label="标签" label-width="40px">
          <tag-select @change="handleFilterChange" v-model="filter.tagIds" />
        </el-form-item>
      </div>
    </el-form>
    <el-card>
      <el-table
        :data="articles.records || []"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column prop="id" label="编号" width="100"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="author" label="作者" width="100">
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
              v-permission="['admin.articles:full']"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除吗？"
              @confirm="doDelete(scope.row)"
              v-permission="['admin.articles:full']"
            >
              <el-button
                v-permission="['admin.articles:full']"
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
          v-if="articles.total > 0"
          @current-change="handleCurrentChange"
          :current-page="articles.current"
          :page-size="filter.pageSize"
          background
          layout="total,prev, pager, next"
          :total="articles.total"
        ></el-pagination>
      </div>
    </el-card>
    <el-drawer
      title="编辑文章"
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
import CreateFormButton from "~/components/article/CreateFormButton";
import UpdateForm from "~/components/article/UpdateForm";
import TagSelect from "~/components/article/TagSelect.vue";
export default {
  data() {
    return {
      filter: { pageSize: 12 },
      loading: false,
      showVisiable: false,
      item: {
        id: 0,
      },
      articles: {
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
    TagSelect,
  },
  created() {
    this.getArticle({
      ...this.$route.query,
    });
  },
  methods: {
    reload() {
      this.getArticle({
        ...this.$route.query,
      });
    },
    doDelete(row) {
      row.deleting = true;
      this.$axios
        .delete(`/admin/api/v1/articles/${row.id}`)
        .then(() => {
          this.reload();
        })
        .finally(() => {
          row.deleting = false;
        });
    },
    getArticle(params) {
      this.loading = true;
      this.$axios
        .get(`/admin/api/v1/articles`, {
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
          this.articles = {
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

      this.getArticle(params);
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

      this.getArticle(params);
    },
    handleEdit(row) {
      this.item = row;
      this.showVisiable = true;
    },
  },
};
</script>

