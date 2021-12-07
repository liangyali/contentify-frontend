<template>
  <div>
    <el-select
      v-model="currentValue"
      multiple
      filterable
      remote
      reserve-keyword
      placeholder="请输入标签进行搜索"
      :loading="loading"
      style="width: 100%"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
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
      this.currentValue = this.transform(val || []);
    },
  },
  created() {
    this.getTags();
  },
  data() {
    return {
      currentValue: this.transform(this.value || []),
      options: [],
      loading: true,
    };
  },
  methods: {
    handleChange(v) {
      this.$emit("input", v);
      this.$emit("change", v);
    },
    getTags() {
      this.loading = true;
      this.$axios
        .get(`/admin/api/v1/options/product_tags`)
        .then((res) => {
          this.options = res.data.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    transform(v) {
      if (typeof v == "string") {
        return [Number(v)];
      }

      if (Array.isArray(v)) {
        return v.map((item) => Number(item));
      }

      return v;
    },
  },
};
</script>
