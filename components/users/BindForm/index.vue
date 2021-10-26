<template>
  <div style="padding: 15px">
    <el-form
      :model="form"
      status-icon
      ref="form"
      label-width="100px"
      size="small"
    >
      <el-form-item label="工号"> {{ item.staffNo }} </el-form-item>
      <el-form-item label="姓名"> {{ item.realName }} </el-form-item>
      <el-form-item label="绑定微信" prop="wxUserId">
        <WxUserSelect v-model="form.wxUserId" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          plain
          :loading="binding"
          @click="submitForm('form')"
          >提交</el-button
        >
        <el-button type="info" plain @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import WxUserSelect from "../WxUserSelect";
export default {
  props: {
    item: {
      default: () => {},
    },
  },
  components: {
    WxUserSelect,
  },
  data() {
    return {
      showVisiable: false,
      form: { wxUserId: undefined },
      binding: false,
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creating = true;
          this.$axios
            .post(`/api/v1/users/bind_wx_user`, {
              sysUserId: this.item.id,
              wxUserId: this.form.wxUserId,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "绑定成功",
                  type: "success",
                });
                this.form = { wxUserId: undefined };
                this.$emit("success");
              }
            })
            .finally(() => {
              this.binding = false;
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