<template>
  <span>
    <el-button type="primary" @click="showVisiable = true" size="mini"
      >添加用户</el-button
    >
    <el-drawer
      title="添加用户"
      width="750px"
      :visible.sync="showVisiable"
      direction="rtl"
      :rules="rules"
      append-to-body
    >
      <div style="padding: 15px">
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
            <el-input
              type="text"
              v-model="form.username"
              :maxlength="50"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realName">
            <el-input
              type="text"
              v-model="form.realName"
              :maxlength="50"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="staffNo">
            <el-input
              type="text"
              v-model="form.password"
              :maxlength="20"
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
              :loading="creating"
              @click="submitForm('form')"
              >保存数据</el-button
            >
            <el-button type="info" plain @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </span>
</template>

<script>
import RoleSelect from "../RoleSelect";
export default {
  components: {
    RoleSelect,
  },
  data() {
    return {
      showVisiable: false,
      form: {},
      creating: false,
      rules: {
        staffNo: [
          {
            required: true,
            message: "员工号不能为空",
          },
        ],
        realName: [
          {
            required: true,
            message: "姓名不能为空",
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
            .post(`/api/v1/users`, {
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "成功创建",
                  type: "success",
                });
                this.form = { isEnabled: true };
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