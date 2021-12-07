<template>
  <div v-loading="loading" style="padding: 0 20px">
    <div class="banner-title">{{ form.name }}</div>
    <el-form
      :model="form"
      status-icon
      ref="form"
      :rules="rules"
      label-width="100px"
      class="form"
      size="small"
      label-position="left"
    >
      <draggable v-model="form.items">
        <transition-group>
          <el-card
            v-for="(item, index) in form.items"
            :key="index"
            style="margin-top: 10px"
          >
            <div class="banner">
              <BannerUpload type="banner" v-model="item.imgUrl" />
              <div>
                <el-form-item label="链接地址" style="margin-left: 20px">
                  <el-input
                    type="input"
                    placeholder="请输入图片描述"
                    v-model="item.link"
                    maxlength="100"
                    style="width: 400px"
                  />
                </el-form-item>
                <el-form-item label="图片描述" style="margin-left: 20px">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="请输入图片描述"
                    v-model="item.imgAlt"
                    maxlength="100"
                    style="width: 400px"
                  />
                </el-form-item>
              </div>
              <div style="padding-left: 25px">
                <el-button
                  type="danger"
                  size="mini"
                  @click="handleDelete(index)"
                  >删除此条</el-button
                >
              </div>
            </div>
          </el-card>
        </transition-group>
      </draggable>
      <div class="add-button-container">
        <el-button
          size="mini"
          icon="el-icon-circle-plus-outline"
          @click="handleAddNew()"
          >添加图片</el-button
        >
      </div>
      <div style="margin-top: 20px">
        <el-button
          size="default"
          type="primary"
          :loading="updating"
          style="width: 100%"
          @click="submitForm('form')"
          >保存数据</el-button
        >
      </div>
    </el-form>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  props: {
    id: {
      default: () => 0,
    },
  },
  components: { draggable },
  data() {
    return {
      showVisiable: false,
      form: { items: [] },
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
    handleDelete(index) {
      this.form.items.splice(index, 1);
    },
    loadData() {
      if (!this.id) {
        return;
      }
      this.loading = true;
      this.$axios
        .get(`/admin/api/v1/banners/${this.id}`)
        .then((res) => {
          this.form = {
            ...(res.data.data || {}),
          };
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleAddNew() {
      this.form.items.push({});
      this.form = {
        ...this.form,
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updating = true;
          this.$axios
            .post(`/admin/api/v1/banners/${this.id}`, {
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
.add-button-container {
  padding: 15px;
}

.banner {
  display: flex;
}

.banner-title {
  font-size: 16px;
  font-weight: 300;
  margin: 0px 20px;
  text-align: center;
}
</style>