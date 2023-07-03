<template>
  <div v-loading="loading">
    <el-form :model="form" status-icon ref="form" :rules="rules" label-width="100px" class="form" label-position="top"
      size="small">
      <el-container>
        <el-main>
          <el-card>
            <el-form-item label="商品名称" prop="name">
              <el-input type="text" v-model="form.name" :maxlength="200" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="商品参数" label-width="0">
              <Editor v-model="form.summary" upload_type="product_img" />
            </el-form-item>

            <el-form-item label="商品详情" label-width="0">
              <Editor v-model="form.bodyHtml" upload_type="product_img" />
            </el-form-item>

            <el-form-item label="商品Banner图" prop="banner">
              <BannerImageUpload type="article_cover" v-model="form.banner" />
            </el-form-item>
            <el-form-item label="商品Banner文字" prop="summary1">
              <el-input type="textarea" :rows="3" v-model="form.summary1" :maxlength="500" autocomplete="off"></el-input>
            </el-form-item>
          </el-card>
        </el-main>
        <el-aside width="400px">
          <el-card>
            <el-form-item label="状态">
              <el-radio-group v-model="form.isPublished" size="mini">
                <el-radio-button :label="true">上架</el-radio-button>
                <el-radio-button :label="false">下架</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="排序权重">
              <el-input-number v-model="form.position" :step="1"></el-input-number>
            </el-form-item>

            <el-form-item label="产品封面图" prop="coverImg">
              <SingleImageUpload type="article_cover" v-model="form.coverImg" />
            </el-form-item>
            <el-form-item label="标签" prop="permissionIds">
              <TagSelect v-model="form.tagIds" />
            </el-form-item></el-card>
          <el-card style="margin-top: 20px">
            <div slot="header" class="clearfix">
              <span>SEO设置</span>
            </div>
            <el-form-item label="标题 title" prop="keyword">
              <el-input type="text" v-model="form.pageTitle" :maxlength="200" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="关键词 keywords" prop="keyword">
              <el-input type="text" v-model="form.pageKeywords" :maxlength="200" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述 description" prop="keyword">
              <el-input type="textarea" :rows="2" v-model="form.pageDescription" :maxlength="500"
                autocomplete="off"></el-input>
            </el-form-item>
          </el-card>
          <div class="demo-drawer__footer">
            <el-form-item style="margin: 20px">
              <el-button size="default" type="primary" :loading="updating" @click="submitForm('form')"
                style="width: 100%">保存商品</el-button>
            </el-form-item>
          </div>
        </el-aside>
      </el-container>
    </el-form>
  </div>
</template>

<script>
import TagSelect from "../TagSelect";
import BannerImageUpload from "../BannerImageUpload";
export default {
  props: {
    id: {
      default: () => 0,
    },
  },
  components: {
    TagSelect,
    BannerImageUpload,
  },
  data() {
    return {
      showVisiable: false,
      form: {},
      loading: true,
      updating: false,
      rules: {
        name: [
          {
            required: true,
            message: "名称不能为空",
          },
        ],
      },
    };
  },
  watch: {
    id() {
      this.loadData();
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    handleClose() {
      this.showVisiable = false;
      this.$emit("cancel");
    },
    loadData() {
      if (!this.id) {
        return;
      }
      this.loading = true;
      this.$axios
        .get(`/admin/api/v1/products/${this.id}`)
        .then((res) => {
          this.form = {
            ...(res.data.data || {}),
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updating = true;
          this.$axios
            .post(`/admin/api/v1/products/${this.id}`, {
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "更新成功",
                  type: "success",
                });
                this.showVisiable = false;
                this.$emit("success");
                this.$emit("cancel");
              }
            })
            .finally(() => {
              this.updating = false;
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.form>>>.el-main {
  padding-top: 0px;
}
</style>