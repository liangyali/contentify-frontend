<template>
  <span>
    <el-button type="primary" @click="showVisiable = true" size="mini"
      >添加产品</el-button
    >
    <el-drawer
      title="添加产品"
      size="100%"
      :visible.sync="showVisiable"
      direction="rtl"
      :rules="rules"
      append-to-body
    >
      <el-form
        :model="form"
        status-icon
        ref="form"
        :rules="rules"
        label-width="100px"
        class="form"
        size="small"
        label-position="top"
      >
        <el-container>
          <el-main>
            <el-card>
              <el-form-item label="产品名称" prop="name">
                <el-input
                  type="text"
                  v-model="form.name"
                  :maxlength="200"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="商品参数" label-width="0">
                <Editor v-model="form.summary" upload_type="product_img" />
              </el-form-item>

              <el-form-item label="产品介绍" label-width="0">
                <Editor v-model="form.bodyHtml" upload_type="product_img" />
              </el-form-item>
              <el-form-item label="商品Banner图" prop="banner">
                <BannerImageUpload type="article_cover" v-model="form.banner" />
              </el-form-item>
              <el-form-item label="商品Banner文字" prop="summary1">
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="form.summary1"
                  :maxlength="500"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-card>
          </el-main>
          <el-aside width="400px">
            <el-card>
              <el-form-item label="状态">
                <el-radio-group v-model="form.isPublished" size="mini">
                  <el-radio-button :label="1">上架</el-radio-button>
                  <el-radio-button :label="0">下架</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="排序权重">
                <el-input-number
                  v-model="form.position"
                  :step="1"
                ></el-input-number>
              </el-form-item>

              <el-form-item label="产品封面图" prop="coverImg">
                <SingleImageUpload
                  type="article_cover"
                  v-model="form.coverImg"
                />
              </el-form-item>
              <el-form-item label="标签" prop="permissionIds">
                <TagSelect v-model="form.tagIds" /> </el-form-item
            ></el-card>
            <el-card style="margin-top: 20px">
              <div slot="header" class="clearfix">
                <span>SEO设置</span>
              </div>
              <el-form-item label="标题 title" prop="keyword">
                <el-input
                  type="text"
                  v-model="form.pageTitle"
                  :maxlength="200"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="关键词 keywords" prop="keyword">
                <el-input
                  type="text"
                  v-model="form.pageKeywords"
                  :maxlength="200"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="描述 description" prop="keyword">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model="form.pageDescription"
                  :maxlength="500"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-card>
            <el-form-item style="margin: 20px">
              <el-button
                size="default"
                type="primary"
                :loading="creating"
                @click="submitForm('form')"
                style="width: 100%"
                >保存商品</el-button
              >
            </el-form-item>
          </el-aside>
        </el-container>
      </el-form>
    </el-drawer>
  </span>
</template>

<script>
import TagSelect from "../TagSelect";
import BannerImageUpload from "../BannerImageUpload";
export default {
  components: {
    TagSelect,
    BannerImageUpload,
  },
  data() {
    return {
      showVisiable: false,
      form: { isPublishd: true },
      creating: false,
      rules: {
        name: [
          {
            required: true,
            message: "产品名称不能为空",
          },
        ],
        coverImg: [
          {
            required: true,
            message: "产品封面不能为空",
          },
        ],
      },
    };
  },
  methods: {
    handleClose() {
      this.showVisiable = false;
      this.$emit("cancel");
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creating = true;
          this.$axios
            .post(`/admin/api/v1/products`, {
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "成功创建",
                  type: "success",
                });
                this.form = { isPublishd: true };
                this.showVisiable = false;
                this.$emit("success");
              }
            })
            .finally(() => {
              this.creating = false;
            });
        }
      });
    },
  },
};
</script>

<style scoped>
.form >>> .el-main {
  padding-top: 0px;
}
</style>