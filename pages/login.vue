<template>
  <div>
    <el-form
      label-position="left"
      ref="loginForm"
      label-width="0px"
      class="login-container"
      :rules="rules"
      :model="form"
      @keyup.enter.native="handleSubmit('loginForm')"
    >
      <div style="text-align: center" class="logo">
        <img :src="getImgUrl('/img/logo.png')" height="50" />
      </div>
      <div class="login-title">来巴(Line Bus)运营管理平台</div>
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="form.username"
          maxlength="20"
          auto-complete="off"
          placeholder="员工编号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="form.password"
          maxlength="20"
          auto-complete="off"
          placeholder="登录密码"
        ></el-input>
      </el-form-item>
      <el-form-item> </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          type="primary"
          style="width: 100%"
          :loading="loading"
          size="large"
          @click.native.prevent="handleSubmit('loginForm')"
          >登 &nbsp;&nbsp;录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  layout: "full",
  data() {
    return {
      form: {
        username: "test",
        password: "123456",
      },
      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
          },
        ],
      },
    };
  },
  methods: {
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return;
        }

        this.loading = true;
        this.$auth
          .loginWith("local", {
            data: {
              ...this.form,
            },
          })
          .then(() => {})
          .catch((err) => {
            this.$message.error("用户名或密码错误");
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    getImgUrl(url) {
      return `${process.env.staticPrefix}${url}`;
    },
  },
};
</script>

<style scoped>
.login-container {
  position: absolute;
  top: 0;
  left: 50%;
  border-radius: 5px;
  margin: 150px 0 auto -225px;
  width: 450px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 8%), 0 1px 4px rgb(0 0 0 / 10%);
}
.login-title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
  font-size: 16px;
  padding-top: 8px;
}

.login-container >>> .el-input__inner:focus {
  border: 1px #909399 solid;
}

.login-container >>> .el-input__inner {
  border: 1px #e4e7ed solid;
  font-size: 14px;
  font-weight: 600;
}

.login-container >>> .el-form-item.is-error .el-input__inner,
.el-form-item.is-error .el-input__inner:focus,
.el-form-item.is-error .el-textarea__inner,
.el-form-item.is-error .el-textarea__inner:focus {
  border: 1px #ca4520 solid;
}
</style>
