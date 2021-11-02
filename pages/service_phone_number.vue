<template>
  <page-container title="调度电话配置">
    <template v-slot:actions>
      <el-button type="primary" size="mini" @click="handleAddNew()"
        >添加调度电话</el-button
      ><el-button
        type="default"
        size="mini"
        @click="getItems"
        icon="el-icon-refresh
"
        >刷新</el-button
      >
    </template>
    <el-form
      :model="form"
      status-icon
      ref="form"
      label-width="150px"
      size="small"
      label-position="top"
    >
      <el-card v-loading="loading">
        <el-table :data="form.servicePhoneNumbers" stripe style="width: 100%">
          <el-table-column label="名称" width="250">
            <template slot-scope="scope">
              <el-form-item
                :prop="'servicePhoneNumbers[' + scope.$index + '].label'"
                :rules="{
                  required: true,
                  message: '名称不能为空',
                }"
                ><el-input
                  placeholder="请输入名称"
                  style="width: 200px"
                  maxlength="20"
                  v-model="scope.row.label"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="调度电话" width="250">
            <template slot-scope="scope">
              <el-form-item
                :prop="'servicePhoneNumbers[' + scope.$index + '].phoneNumber'"
                :rules="{
                  required: true,
                  message: '调度电话不能为空',
                }"
                ><el-input
                  placeholder="请输入调度电话"
                  style="width: 200px"
                  v-model="scope.row.phoneNumber"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="scope">
              <el-form-item
                ><el-input placeholder="请输入备注" v-model="scope.row.remark">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="" label="" width="130">
            <template slot-scope="scope">
              <el-form-item>
                <el-popconfirm
                  @confirm="handleRemoveDay(scope.$index)"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  icon="el-icon-info"
                  size="mini"
                  icon-color="red"
                  title="确定要删除吗?"
                >
                  <el-button slot="reference" size="mini" type="danger" plain
                    >删除</el-button
                  >
                </el-popconfirm>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <div style="padding: 10px">
          <el-button type="primary" size="small" @click="submitForm('form')"
            >保存配置</el-button
          >
        </div>
      </el-card>
    </el-form>
  </page-container>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      setting: false,
      loading: false,
      form: {
        servicePhoneNumbers: [],
      },
    };
  },
  created() {
    this.getItems({});
  },
  methods: {
    handleAddNew() {
      this.form.servicePhoneNumbers.push({});
    },
    handleRemoveDay(index) {
      this.form.servicePhoneNumbers.splice(index, 1);
    },
    getItems() {
      this.loading = true;
      this.$axios
        .get(`/api/v1/service_phone_numbers`)
        .then((res) => {
          this.form = {
            servicePhoneNumbers: res.data.data || [],
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
            .post(`/api/v1/service_phone_numbers`, {
              ...this.form,
            })
            .then((res) => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "保存成功",
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
  },
};
</script>

