<template>
  <page-container title="系统设置">
    <el-card style="padding: 15px" v-loading="loading">
      <el-form
        :model="form"
        status-icon
        ref="form"
        label-width="150px"
        :rules="rules"
        size="small"
        label-position="top"
      >
        <el-form-item
          label="司机接单超时时间(分)"
          prop="driverReceiveTimeoutMinutes"
        >
          <el-input
            placeholder="请输入内容"
            style="width: 200px"
            v-model.number="form.driverReceiveTimeoutMinutes"
          >
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="一次可以预约最大的人数" prop="orderMaxNumber">
          <el-input
            placeholder="请输入内容"
            v-model.number="form.orderMaxNumber"
            style="width: 200px"
          >
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="setting"
            @click="submitForm('form')"
            >保存设置</el-button
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
      item: {},
      loading: false,
      setting: false,
      rules: {
        driverReceiveTimeoutMinutes: [
          {
            required: true,
            type: "number",
            message: "司机接单超时时间格式不正确",
          },
        ],
        orderMaxNumber: [
          {
            required: true,
            type: "number",
            message: "一次可以预约最大的人数格式不争取",
          },
        ],
      },
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.loading = true;
      this.$axios
        .get("/api/v1/setting")
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
          this.setting = true;
          this.$axios
            .post(`/api/v1/setting`, {
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "设置保存成功",
                  type: "success",
                });
                this.$emit("success");
              }
            })
            .finally(() => {
              this.setting = false;
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