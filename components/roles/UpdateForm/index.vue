<template>
  <div v-loading="loading">
    <el-form
      :model="form"
      status-icon
      ref="form"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      size="small"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          type="text"
          v-model="form.name"
          :maxlength="50"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色说明" prop="description">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入角色说明"
          v-model="form.description"
          maxlength="100"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="功能列表" prop="permissionIds">
        <PermissionTree v-model="form.permissionIds" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="updating"
          @click="submitForm('form')"
          >保存数据</el-button
        >
        <el-button type="info" plain @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PermissionTree from "../PermissionTree";
export default {
  props: {
    id: {
      default: () => 0,
    },
  },
  components: {
    PermissionTree,
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
        .get(`/admin/api/v1/roles/${this.id}`)
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
            .post(`/admin/api/v1/roles/${this.id}`, {
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