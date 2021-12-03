<template>
  <div style="padding: 15px">
    <el-form
      :model="form"
      status-icon
      ref="form"
      label-width="100px"
      :rules="rules"
      size="small"
    >
      <el-form-item label="用户名"> {{ item.username }} </el-form-item>
      <el-form-item label="姓名"> {{ item.realName }} </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          :maxlength="50"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="reseting"
          @click="submitForm('form')"
          >重置密码</el-button
        >
        <el-button type="info" plain @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      default: () => {},
    },
  },
  components: {},
  data() {
    return {
      showVisiable: false,
      form: {},
      reseting: false,
      rules: {
        password: [
          {
            required: true,
            message: "新密码不能为空",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.reseting = true;
          this.$axios
            .post(`/api/v1/users/reset_password`, {
              id: this.item.id,
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "密码重置成功",
                  type: "success",
                });
                this.form = {};
                this.$emit("success");
              }
            })
            .finally(() => {
              this.reseting = false;
            });
        }
      });
    },
    handleClose() {
      this.$emit("cancel");
    },
  },
};
</script>