<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <!-- <tags-view/> -->
      <AppMain/>
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
    // TagsView
  }
};
</script>

<style scoped lang="scss">
@import "~/assets/css/index/index.scss";
</style>
