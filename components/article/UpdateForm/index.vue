<template>
  <div v-loading="loading">
    <el-form
      :model="form"
      status-icon
      ref="form"
      :rules="rules"
      label-width="100px"
      class="form"
      label-position="top"
      size="small"
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
              <Editor v-model="form.bodyHtml" upload_type="article_img" />
            </el-form-item>
          </el-card>
        </el-main>
        <el-aside width="400px" style="margin-right: 20px">
          <el-card>
            <el-form-item label="文章状态">
              <el-radio-group v-model="form.isPublished" size="mini">
                <el-radio-button :label="true">发布</el-radio-button>
                <el-radio-button :label="false">草稿</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="作者 " prop="author">
              <el-input
                type="text"
                v-model="form.author"
                :maxlength="50"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-form-item label="封面图" prop="author">
              <SingleImageUpload type="article_cover" v-model="form.coverImg" />
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
          <div style="margin-top: 20px">
            <el-button
              size="default"
              type="primary"
              :loading="updating"
              @click="submitForm('form')"
              style="width: 100%"
              >更新文章</el-button
            >
          </div>
        </el-aside>
      </el-container>
    </el-form>
  </div>
</template>

<script>
import TagSelect from "../TagSelect";
export default {
  props: {
    id: {
      default: () => 0,
    },
  },
  components: {
    TagSelect,
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
        .get(`/admin/api/v1/articles/${this.id}`)
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
            .post(`/admin/api/v1/articles/${this.id}`, {
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
.form >>> .el-main {
  padding-top: 0px;
}
</style>