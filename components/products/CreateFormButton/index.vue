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

              <el-form-item label="产品介绍" label-width="0">
                <Editor v-model="form.bodyHtml" upload_type="product_img" />
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
              <el-form-item
                label="关键词-应用于页面的搜索引擎使用"
                prop="keyword"
              >
                <el-input
                  type="textarea"
                  :rows="3"
                  v-model="form.keyword"
                  :maxlength="200"
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
export default {
  components: {
    TagSelect,
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