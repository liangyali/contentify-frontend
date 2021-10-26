<template>
  <el-card v-loading="loading">
    <el-tree
      ref="tree"
      :data="options"
      show-checkbox
      :check-strictly="true"
      :default-expand-all="expandAll"
      node-key="id"
      :props="defaultProps"
      @check="onChange"
    />
  </el-card>
</template>

<script>
export default {
  props: ["value"],
  watch: {
    value(v) {
      this.$refs.tree.setCheckedKeys(v || []);
    },
  },
  created() {
    this.getPermissions();
  },
  data() {
    return {
      expandAll: true,
      options: [],
      loading: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    getPermissions() {
      this.loading = true;
      this.$axios
        .get(`/api/v1/options/permissions`)
        .then((res) => {
          this.options = this.processData(res.data.data);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    processData(data) {
      let menus = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === 0) {
          menus.push({
            ...data[i],
            id: data[i].id,
            label: data[i].name,
            children: this.menuRecursion(data, data[i]),
          });
        }
      }
      return menus;
    },
    menuRecursion(data, item) {
      let menus = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].parentId === item.id) {
          menus.push({
            ...data[i],
            id: data[i].id,
            label: data[i].name,
            children: this.menuRecursion(data, data[i]),
          });
        }
      }
      return menus;
    },
    onChange() {
      const keys = this.$refs.tree.getCheckedKeys();
      this.$emit("input", keys);
    },
  },
};
</script>
