<template>
  <div class="dashboard-container">
    <component :is="currentDashboard"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "~/components/Home/editor"; // TODO: 暂时只用编辑角色
// import adminDashboard from "~/components/Dashboard/admin";
import editorDashboard from "~/components/Home/editor";

export default {
  name: "Home",
  components: { adminDashboard, editorDashboard },
  head() {
    return {
      title: "首页",
      meta: [
        {
          hid: "home custom title",
          name: "home",
          content: "home custom title description"
        }
      ]
    };
  },
  data() {
    return { currentRole: "admin" };
  },
  computed: {
    ...mapGetters(["roles"]),
    currentDashboard() {
      return this.currentRole + "Dashboard";
    }
  },
  created() {
    if (!this.roles.includes("admin")) {
      this.currentRole = "editor";
    }
  }
};
</script>
<style scoped lang="scss">
</style>
