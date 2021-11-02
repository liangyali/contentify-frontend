<template>
  <div style="padding: 15px" v-loading="loading">
    <el-form
      :model="form"
      status-icon
      ref="form"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      size="small"
    >
      <el-form-item label="员工号" prop="staffNo">
        <el-input
          type="text"
          v-model="form.staffNo"
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
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input
          type="text"
          v-model="form.phoneNumber"
          :maxlength="11"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <RoleSelect v-model="form.roleIds" />
      </el-form-item>
      <el-form-item label="开通系统" prop="roleIds">
        <el-card>
          <el-checkbox v-model="form.isEnabledCall">叫车系统</el-checkbox>
          <el-checkbox v-model="form.isEnabledDriver">司机系统</el-checkbox>
          <el-checkbox v-model="form.isEnabledManage">后台调度</el-checkbox>
        </el-card>
      </el-form-item>
      <el-form-item label="所属公司" prop="companyName">
        <el-select
          v-model="form.companyName"
          filterable
          allow-create
          default-first-option
          placeholder="请选择所属公司"
        >
          <el-option
            label="北京飞机维修工程有限公司"
            value="北京飞机维修工程有限公司"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属大队" prop="dd">
        <el-input
          type="text"
          v-model="form.dd"
          :maxlength="50"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属中队" prop="zd">
        <el-input
          type="text"
          v-model="form.zd"
          :maxlength="50"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属班组" prop="bz">
        <el-input
          type="text"
          v-model="form.bz"
          :maxlength="50"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          plain
          :loading="updating"
          @click="submitForm('form')"
          >提交</el-button
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
        .get(`/api/v1/users/${this.id}`)
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
            .post(`/api/v1/users/${this.id}`, {
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