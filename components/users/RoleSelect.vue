<template>
  <el-checkbox-group
    :loading="loading"
    v-model="currentValue"
    @change="handleChange"
  >
    <el-checkbox
      v-for="(item, index) in options"
      :label="item.id"
      :key="index"
      >{{ item.name }}</el-checkbox
    >
  </el-checkbox-group>
</template>

<script>
export default {
  props: {
    value: {},
    roleType: {},
  },
  watch: {
    value(val) {
      this.currentValue = val || [];
    },
    roleType(val) {
      this.getRoles();
    },
  },
  created() {
    this.getRoles();
  },
  data() {
    return {
      currentValue: this.value || [],
      options: [],
      loading: true,
    };
  },
  methods: {
    handleChange(v) {
      this.$emit("input", v);
    },
    getRoles() {
      this.loading = true;
      this.$axios
        .get(`/admin/api/v1/options/roles`)
        .then((res) => {
          this.options = res.data.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
