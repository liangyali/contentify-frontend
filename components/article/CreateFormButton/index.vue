<template>
  <span>
    <el-button type="primary" @click="showVisiable = true" size="mini"
      >新增文章</el-button
    >
    <el-drawer
      title="添加文章"
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
              <el-form-item label="文章标题" prop="title">
                <el-input
                  type="text"
                  v-model="form.title"
                  :maxlength="200"
                  autocomplete="off"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="文章摘要-文章的摘要用于列表显示"
                prop="summary"
              >
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入文章摘要"
                  v-model="form.summary"
                  maxlength="100"
                >
                </el-input>
              </el-form-item>

              <el-form-item label="" prop="permissionIds" label-width="0">
                <Editor v-model="form.bodyHtml" />
              </el-form-item>
            </el-card>
          </el-main>
          <el-aside width="400px">
            <el-card>
              <el-form-item label="文章状态">
                <el-radio-group v-model="form.isPublished" size="mini">
                  <el-radio-button :label="1">发布</el-radio-button>
                  <el-radio-button :label="0">草稿</el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="作者" prop="author">
                <el-input
                  type="text"
                  v-model="form.author"
                  :maxlength="50"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="封面图" prop="author">
                <SingleImageUpload
                  type="article_cover"
                  v-model="form.coverImg"
                />
              </el-form-item>
              <el-form-item label="排序权重">
                <el-input-number
                  v-model="form.position"
                  :step="1"
                ></el-input-number>
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
                >添加文章</el-button
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
      form: {},
      creating: false,
      rules: {
        title: [
          {
            required: true,
            message: "标题不能为空",
          },
        ],
        summary: [
          {
            required: true,
            message: "摘要不能为空",
          },
        ],
        author: [
          {
            required: true,
            message: "作者不能为空",
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
            .post(`/admin/api/v1/articles`, {
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