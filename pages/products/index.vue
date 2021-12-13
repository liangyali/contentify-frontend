<template>
  <page-container title="商品管理">
    <template v-slot:actions
      ><CreateFormButton @success="reload" /><el-button
        type="default"
        size="mini"
        @click="reload"
        icon="el-icon-refresh
"
        >刷新</el-button
      >
    </template>
    <el-form :inline="true" :model="filter" size="mini">
      <div class="filter__">
        <el-form-item label="商品标签" label-width="70px">
          <tag-select
            @change="handleFilterChange"
            v-model="filter.tagIds"
            style="max-width: 500px"
          />
        </el-form-item>
      </div>
    </el-form>
    <div
      v-if="products.records.length == 0 && loading == false"
      class="not-found"
    >
      没有找到商品数据
    </div>
    <div class="products" v-loading="loading">
      <el-card
        class="product"
        v-for="(product, index) in products.records"
        :key="index"
      >
        <div>
          <div class="is-published">
            <el-tag size="mini" v-if="product.isPublished" type="success">
              &nbsp;已上架</el-tag
            >
            <el-tag size="mini" v-if="!product.isPublished" type="danger">
              &nbsp;已下架</el-tag
            >
          </div>
          <div class="image">
            <img :src="product.coverImg" />
          </div>
          <div>
            <span class="product-name">{{ product.name }}</span>
            <div class="bottom">
              <el-button
                size="mini"
                style="margin-right: 5px"
                @click="handleEdit(product)"
                v-permission="['admin.products:full']"
                >编辑</el-button
              >
              <el-popconfirm title="确定删除吗？" @confirm="doDelete(product)">
                <el-button
                  v-permission="['admin.products:full']"
                  type="danger"
                  slot="reference"
                  plain
                  size="mini"
                  class="button"
                  >删除</el-button
                >
              </el-popconfirm>
            </div>
          </div>
        </div></el-card
      >
    </div>
    <div class="pagination">
      <el-pagination
        v-if="products.total > 0"
        @current-change="handleCurrentChange"
        :current-page="products.current"
        :page-size="filter.pageSize - 0"
        background
        layout="total,prev, pager, next"
        :total="products.total"
      ></el-pagination>
    </div>
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
import CreateFormButton from "~/components/products/CreateFormButton";
import UpdateForm from "~/components/products/UpdateForm";
import TagSelect from "~/components/products/TagSelect.vue";
export default {
  data() {
    return {
      filter: { pageSize: 15 },
      loading: false,
      showVisiable: false,
      item: {
        id: 0,
      },
      products: {
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
    this.filter = {
      ...this.filter,
      ...this.$route.query,
    };
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
        .delete(`/admin/api/v1/products/${row.id}`)
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
        .get(`/admin/api/v1/products`, {
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
          this.products = {
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

<style scoped>
.filter__ {
  padding: 20px auto;
}
.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: center;
}

.image {
  padding: 10px;
  position: relative;
}

.image img {
  width: 100%;
  min-height: 200px;
  max-height: 200px;
}

.bottom {
  padding: 10px;
  display: flex;
}

.product:first {
  margin-right: 5px;
}

.product {
  margin-bottom: 10px;
  width: 250px;
  font-size: 15px;
  position: relative;
  margin-left: 10px;
  margin-bottom: 10px;
}

.product-name {
  font-size: 14px;
  color: #606266;
  width: 100%;
  padding: 10px;
  text-align: center;
  font-weight: 300;
}

.product >>> .el-card__body {
  padding: 0px;
}

.is-published {
  position: relative;
  top: 5px;
  left: -5px;
  z-index: 100;
}
</style>

