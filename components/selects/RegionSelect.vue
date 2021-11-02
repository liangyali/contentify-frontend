<template>
  <div class="bind">
    <el-select
      v-model="currentValue"
      v-loading="loading"
      filterable
      multiple=""
      placeholder="请选择区域"
      @change="handleChange"
    >
      <el-option
        v-for="(item, index) in options"
        :label="item.name"
        :key="index"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
  },
  watch: {
    value(val) {
      this.currentValue = val;
    },
  },
  created() {
    this.getOptions();
  },
  data() {
    return {
      currentValue: this.value || [],
      options: [],
      loading: false,
    };
  },

  methods: {
    handleChange(v) {
      this.$emit("input", v);
    },
    getOptions() {
      this.loading = true;
      this.$axios
        .get(`/api/v1/options/regions`)
        .then((res) => {
          this.options = res.data.data || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>
