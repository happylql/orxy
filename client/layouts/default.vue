<template>
  <div id="app">
    <div class="app-wrapper" :class="classObj">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
      <sidebar class="sidebar-container"/>
      <div class="main-container">
        <navbar/>
        <app-main/>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar";
import Sidebar from "~/components/Sidebar";
import AppMain from "~/components/AppMain";

export default {
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      debugger;
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    }
  },
  mounted() {
    // TODO: 服务端渲染左侧导航条及pannel页面内容
    this.$store.dispatch("promission/generateRouters", { roles: ["admin"] });
  }
};
</script>

<style scoped lang="scss">
@import "~/assets/styles/index/index.scss";
</style>
