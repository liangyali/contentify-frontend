<template>
  <span>
    <el-button type="primary" @click="showVisiable = true" size="mini"
      >新增角色</el-button
    >
    <el-drawer
      title="添加角色"
      width="650px"
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
            plain
            :loading="creating"
            @click="submitForm('form')"
            >提交</el-button
          >
          <el-button type="info" plain @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </span>
</template>

<script>
import PermissionTree from "../PermissionTree";
export default {
  components: {
    PermissionTree,
  },
  data() {
    return {
      showVisiable: false,
      form: {},
      creating: false,
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
            .post(`/admin/api/v1/roles`, {
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