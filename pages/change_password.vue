<template>
  <page-container title="修改密码">
    <el-card style="width: 500px; padding: 10px">
      <el-form
        :model="form"
        status-icon
        ref="form"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
        size="small"
      >
        <el-form-item label="原始密码" prop="oldPassword">
          <el-input
            type="password"
            v-model="form.oldPassword"
            :maxlength="50"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="form.newPassword"
            :maxlength="50"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="checkNewPassword">
          <el-input
            type="password"
            v-model="form.checkNewPassword"
            :maxlength="50"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="creating"
            @click="submitForm('form')"
            >修改密码</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </page-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      showVisiable: false,
      form: {},
      creating: false,
      rules: {
        oldPassword: [
          {
            required: true,
            message: "原始密码不能为空",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "新密码不能为空",
          },
        ],
        checkNewPassword: [
          {
            required: true,
            message: "新密码不能为空",
          },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入新密码"));
              } else if (value !== this.form.newPassword) {
                callback(new Error("两次输入新密码不一致!"));
              } else {
                callback();
              }
            },
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creating = true;
          this.$axios
            .post(`/api/v1/users/change_password`, {
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "密码修改成功",
                  type: "success",
                });
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

