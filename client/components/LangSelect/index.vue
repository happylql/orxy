<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language"/>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      return this.$store.getters.locale;
    }
  },
  methods: {
    handleSetLanguage(lang) {
      // 重定向以更新国际化显示
      const fullPath = this.$route.fullPath;
      const locale = this.$store.getters.locale;
      let pathname = "/" + lang + fullPath;
      if (fullPath.indexOf("/" + locale) === 0) {
        const re = new RegExp("^/" + locale);
        pathname = fullPath.replace(re, "/" + lang);
      }
      // this.$store.dispatch("app/setLanguage", lang);
      // this.$message({
      //   message: "Switch Language Success",
      //   type: "success"
      // });
      location.href = location.origin + pathname;
    }
  }
};
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px !important;
}
</style>

