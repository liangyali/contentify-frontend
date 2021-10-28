<template>
  <span>
    <el-button type="primary" @click="showVisiable = true" size="mini"
      >添加车辆</el-button
    >
    <el-drawer
      title="添加车辆"
      width="650px"
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
          <el-form-item label="车牌号" prop="carNumber">
            <el-input
              type="text"
              v-model="form.carNumber"
              :maxlength="10"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="载客容量" prop="capacity">
            <el-input
              type="text"
              v-model="form.capacity"
              :maxlength="3"
              autocomplete="off"
            ></el-input>
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
          <el-form-item label="车型" prop="model">
            <el-input
              type="text"
              v-model="form.model"
              :maxlength="10"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item label="行驶公里数" prop="vkt">
            <el-input
              type="text"
              v-model="form.vkt"
              :maxlength="10"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入备注"
              v-model="form.remark"
              maxlength="500"
            >
            </el-input>
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
export default {
  components: {},
  data() {
    return {
      showVisiable: false,
      form: {},
      creating: false,
      rules: {
        carNumber: [
          {
            required: true,
            message: "车牌号不能为空",
          },
        ],
        capacity: [
          {
            required: true,
            message: "载客容量不能为空",
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
            .post(`/api/v1/cars`, {
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