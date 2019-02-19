<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
        <lang-select class="set-language"/>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >{{ $t('login.logIn') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import LangSelect from "~/components/LangSelect";

export default {
  name: "Login",
  components: { LangSelect },
  layout: "blank",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(this.$t("login.nopassword")));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword
          }
        ]
      },
      passwordType: "password",
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === "password" ? "" : "password";
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/loginByUserName", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~/assets/styles/login/index.scss";
</style>
