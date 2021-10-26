<template>
  <div class="bind">
    <el-select
      v-model="currentValue"
      v-loading="loading"
      remote
      filterable
      placeholder="请选择微信用户"
      @change="handleChange"
      :remote-method="getOptions"
    >
      <el-option
        v-for="(item, index) in options"
        :label="item.nickname"
        :key="index"
        :value="item.id"
      >
        <span style="float: left; padding: 3px">
          <el-avatar :src="item.avatarUrl" size="small"></el-avatar>
        </span>
        <span style="float: right; font-size: 14px">{{ item.nickname }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {},
  },
  created() {},
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
    getOptions(query) {
      if (!query) {
        return;
      }
      this.loading = true;
      this.$axios
        .get(`/api/v1/users/search_wx_users`, {
          params: {
            keyword: query,
          },
        })
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
