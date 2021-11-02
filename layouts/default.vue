<template>
  <el-container class="main-container">
    <el-aside :width="!collapse ? '200px' : '48px'" class="main-aside">
      <div v-if="collapse == false" class="logo-container">
        <img :src="getImgUrl('/img/logo.png')" height="23" />
      </div>
      <div v-if="collapse == true" class="logo-container">
        <img :src="getImgUrl('/img/logo-mini.png')" height="23" />
      </div>
      <div
        v-if="menuLoading"
        style="
          padding: 20px;
          text-align: center;
          color: #bcc6f7;
          font-size: 30px;
        "
      >
        <i class="el-icon-loading" />
      </div>
      <el-menu
        style="margin-top: 10px"
        v-if="!menuLoading"
        :collapse="collapse"
        :collapse-transition="false"
        background-color="#16294b"
        text-color="#bcc6f7"
        :default-active="menuActive"
        :router="true"
        active-text-color="#fff"
      >
        <el-menu-item index="0-0" :route="{ path: '/' }">
          <svg-icon icon-class="home"></svg-icon>
          <span slot="title">欢迎页</span>
        </el-menu-item>
        <template v-for="menu in menus">
          <submenu :key="menu.id" :menu="menu"></submenu>
        </template>
      </el-menu>
      <!-- <div class="footer-right" v-if="!collapse">麟客科技提供技术支持</div> -->
    </el-aside>
    <el-container>
      <el-header class="main-header" height="56px">
        <Hamburger @toggleClick="toggle" :isActive="!collapse"></Hamburger>
        <div class="operate-list">
          <span style="margin: 0 5px; font-width: 600">
            <el-tag size="small"
              >工号: &nbsp;{{ this.$auth.user.staffNo }}</el-tag
            >
          </span>
          <el-button size="mini" round @click="logout" type="primary" plain
            >退出</el-button
          >
        </div>
      </el-header>

      <el-main class="main-content">
        <nuxt :keepAlive="false"></nuxt>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Hamburger from "~/components/Hamburger";
import Submenu from "~/components/layout/Submenu";
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  components: { Hamburger, Submenu },
  data() {
    return {
      collapse: false,
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    toggle() {
      this.collapse = !this.collapse;
    },
    goHome() {
      this.$router.push({ path: "/" });
    },
    logout() {
      this.$auth.logout();
    },
    ...mapActions({
      getMenus: "getMenus",
    }),
    getImgUrl(url) {
      return `${process.env.staticPrefix}${url}`;
    },
  },
  mounted() {},
  computed: {
    ...mapState({
      menuActive: "menuActive",
      breadcrumb: "breadcrumb",
      menuLoading: "menuLoading",
    }),
    ...mapGetters({
      menus: "menus",
    }),
  },
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

html,
body,
#__nuxt,
#__layout {
  height: 100%;
}

.main-container {
  height: 100%;
  padding: 0;
  margin: 0;
}
.main-container .main-header {
  height: 56px;
  line-height: 56px;
  border-bottom: 1px solid #e5e9f2;
  padding-left: 5px;
  background: #fff;
  position: relative;
  z-index: 2;
}
.main-container .main-header .el-icon-menu:before {
  width: 20px;
  height: 20px;
}
.main-container .main-header .el-breadcrumb {
  display: inline-block;
  margin-left: 10px;
}
.main-container .main-header .operate-list {
  float: right;
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
.main-container .main-aside {
  background: #16294b;
  height: 100vh;
}
.main-container .main-aside .el-menu {
  border-right: none;
  width: 100% !important;
}
.main-aside .el-menu .svg-icon {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 20px;
  color: #cfd3e7 !important;
}
.main-aside .el-menu.el-menu--collapse .el-menu-item,
.main-aside .el-menu.el-menu--collapse .el-tooltip {
  padding-left: 10px !important;
}
.main-aside .el-menu.el-menu--collapse .el-submenu__title {
  padding-left: 10px !important;
}
.main-container .main-content {
  padding: 0;
  height: 100%;
  padding: 0px;
}

.logo-container {
  height: 56px;
  background: #fff;
  text-align: center;
  vertical-align: middle;
  border-radius: 0px 0 0 5px;
  padding-top: 12px;
}

.el-menu-item,
.el-submenu__title {
  height: 45px !important;
  line-height: 45px !important;
}

.el-menu-item.is-active::before {
  background-color: #fff !important;
  display: block;
  content: "";
  position: absolute;
  top: 4px;
  left: 0px;
  bottom: 6px;
  width: 4px;
  border-radius: 0px 3px 3px 0px;
  background-color: transparent;
  transition: background-color 0.15s linear 0s;
}

.pagination {
  padding: 15px;
}

.filter {
  color: #303133;
  transition: 0.3s;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 10px 15px;
  display: flex;
  background: #fff;
  align-items: center;
}

.filter > .el-form-item--mini {
  margin-bottom: 0px !important;
}

.el-drawer.rtl {
  overflow: scroll;
}

.footer-right {
  position: absolute;
  bottom: 0;
  padding: 8px;
  font-size: 10px;
  color: #8289a8;
  text-align: center;
  width: 200px;
}
</style>
