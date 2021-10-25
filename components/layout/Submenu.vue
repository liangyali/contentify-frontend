<template>
  <el-submenu v-if="menu.value.length > 0" :index="menu.index.id + ''">
    <template slot="title">
      <svg-icon v-if="menu.index.icon" :icon-class="menu.index.icon"></svg-icon>
      <span>{{ menu.index.name }}</span>
    </template>
    <template v-for="m in menu.value">
      <submenu :key="m.id" :menu="m"></submenu>
    </template>
  </el-submenu>
  <el-menu-item
    v-else
    :route="handRoute(menu.index.uri)"
    :index="menu.index.id + ''"
  >
    <svg-icon
      v-if="menu.index.icon && menu.index.icon != ''"
      :icon-class="menu.index.icon"
    ></svg-icon>
    <span slot="title">
      {{ menu.index.name }}
    </span>
  </el-menu-item>
</template>

<script>
import { routeUrl } from "~/utils";
export default {
  name: "submenu",
  props: {
    menu: {
      type: Object,
      required: true,
    },
  },
  methods: {
    handRoute(url) {
      return {
        path: routeUrl(url),
      };
    },
  },
};
</script>
