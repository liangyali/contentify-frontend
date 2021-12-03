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
      <el-form-item label="用户名" prop="staffNo">
        {{ form.username }}
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input
          type="text"
          v-model="form.realName"
          :maxlength="50"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="角色" prop="roleIds">
        <RoleSelect v-model="form.roleIds" />
      </el-form-item>

      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          type="text"
          v-model="form.phoneNumber"
          :maxlength="11"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="phoneNumber">
        <el-input
          type="text"
          v-model="form.email"
          :maxlength="11"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="updating"
          @click="submitForm('form')"
          >更新数据</el-button
        >
        <el-button type="info" plain @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import RoleSelect from "../RoleSelect";
export default {
  props: {
    id: {
      default: () => 0,
    },
  },
  components: {
    RoleSelect,
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
        .get(`/admin/api/v1/users/${this.id}`)
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
            .post(`/admin/api/v1/users/${this.id}`, {
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