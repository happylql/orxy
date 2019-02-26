<template>
  <div class="login-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="login-form"
      label-position="left"
    >
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input v-model="registerForm.username" name="username" type="text"/>
      </el-form-item>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email"/>
        </span>
        <el-input v-model="registerForm.email" name="email" type="email"/>
        <el-button size="mini" round @click="sendCode">{{$t('register.sendCode')}}</el-button>
        <span class="status">{{statusMsg}}</span>
      </el-form-item>
      <el-form-item prop="code" :label="$t('register.code')">
        <el-input v-model="registerForm.code" maxlength="4"/>>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input v-model="registerForm.password" :type="passwordType" name="password"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>
      <el-form-item prop="cpassword">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input v-model="registerForm.cpassword" type="passward"/>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleRegister"
      >{{ $t('register.signup') }}</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Register",
  layout: "blank",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(this.$t("login.nopassword")));
      } else {
        callback();
      }
    };
    const validateCPassword = (rule, value, callback) => {
      if (value !== this.password) {
        callback(new Error(this.$t("register.diffpassword")));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        username: "",
        password: "",
        cpassword: "",
        email: "",
        code: ""
      },
      registerRules: {
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword
          }
        ],
        cpassword: [
          {
            required: true,
            trigger: "blur",
            validator: validateCPassword
          }
        ]
      },
      passwordType: "password",
      loading: false,
      statusMsg: ""
    };
  },
  methods: {
    showPwd() {
      this.passwordType = this.passwordType === "password" ? "" : "password";
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/register", this.registerForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/login" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    sendCode() {
      let namePass, emailPass;
      if (this.timerId) {
        return false;
      }
      this.$refs.registerForm.validateField("username", valid => {
        namePass = valid;
      });
      this.statusMsg = "";
      if (namePass) {
        return false;
      }
      this.$refs.registerForm.validateField("email", valid => {
        emailPass = valid;
      });

      if (!namePass && !emailPass) {
        this.$store
          .dispatch("user/sendCode", this.registerForm)
          .then(() => {
            let count = 60;
            this.statusMsg = `验证码已发送，剩余${count--}秒`;
            this.timerId = setInterval(() => {
              this.statusMsg = `验证码已发送，剩余${count--}秒`;
              if (count === 0) {
                clearInterval(this.timerId);
                this.statusMsg = "";
              }
            }, 1000);
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "~/assets/styles/login/index.scss";
.login-container {
  .status {
    font-size: 12px;
    margin-left: 20px;
    color: #e6a23c;
  }
}
</style>
