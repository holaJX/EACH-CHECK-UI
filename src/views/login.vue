<template>
  <div class="login">
    <div class="login-bg"></div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <div class="header">
        <img src="../assets/images/main-logo.png"/>
        <div class="title0">云南省社会单位</div>
        <div class="title1">消防安全检查示教点评系统</div>
      </div>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 175px"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" class="remember-pwd">记住密码</el-checkbox>
      <el-form-item class="login-footer-wrap">
        <el-button
          class="login-submit"
          :loading="loading"
          size="medium"
          type="primary"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <el-button
          class="login-register"
          size="medium"
          type="success"
          @click="$router.push({path: '/register'})"
        >
          <span>注 册</span>
        </el-button>
      </el-form-item>
    </el-form>
    <div class="login-bottom">
      <div class="wave1"></div>
      <div class="wave2"></div>
      <div class="wave3"></div>
      <div class="wave4"></div>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" }
        ],
        code: [{ required: true, trigger: "change", message: "验证码不能为空" }]
      },
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
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch(() => {
            this.loading = false;
            this.getCode();
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-left: 5%;
  padding-right: 5%;
  background: linear-gradient(180deg, #07A9F7 0%, #0170DB 100%);
  background-size: cover;
  min-height: 100%;
  overflow: hidden;
  .login-bottom {
    .wave1{
      position: absolute;
      bottom: -93vw;
      left: -20vw;
      width: 100vw;
      height: 100vw;
      background-image: linear-gradient(110deg, rgb(255, 255, 255), rgba(0, 0, 0, 0.68));
      transform:rotate(110deg);
      opacity: 0.2;
      border-radius: 40%;
      box-shadow: 10px 5px 5px #3132cc;
    }
    .wave2{
      position: absolute;
      bottom: -75vw;
      left: 16vw;
      width: 80vw;
      height: 80vw;
      background-image: linear-gradient(110deg, rgb(255, 255, 255), rgba(0, 0, 0, 0.68));
      transform:rotate(110deg);
      opacity: 0.1;
      border-radius: 40%;
      box-shadow: 10px 5px 5px #3132cc;
    }
    .wave3{
      position: absolute;
      bottom: -104vw;
      left: 29vw;
      width: 110vw;
      height: 110vw;
      background-image: linear-gradient(110deg, rgb(168, 217, 255), rgba(0, 0, 0, 0.68));
      transform:rotate(110deg);
      opacity: 0.2;
      border-radius: 40%;
      box-shadow: 10px 5px 5px #3132cc;
    }
    .wave4{
      position: absolute;
      bottom: -101vw;
      left: 36vw;
      width: 100vw;
      height: 100vw;
      background-image: linear-gradient(110deg, rgb(244, 245, 255), rgba(0, 0, 0, 0.68));
      transform:rotate(110deg);
      opacity: 0.2;
      border-radius: 40%;
      box-shadow: 10px 5px 5px #3132cc;
    }
  }
  .login-bg{
    z-index: 2;
    width: 706px;
    height: 587px;
    background-image: url("../assets/images/login-mian-bg.png");
    background-size: 100% 100%;
  }
}
.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 440px;
  height: 540px;
  padding: 30px 70px 5px 70px;
  z-index: 2;
  .header{
    width: 300px;
    img{
      width: 32px;
      height: 33px;
      display: block;
      margin: 0 auto;
    }
    .title0 {
      text-align: center;
      color: #000000;
      font-size: 14px;
      margin-top: 10px;
    }

    .title1 {
      text-align: center;
      color: #000000;
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 30px;
    }
  }
  .el-input {
    width: 300px;
    height: 40px;
    font-size: 14px;
    input {
      width: 100%;
      height: 40px;
      font-size: 14px;
      padding-left: 36px;
    }
  }
  .input-icon {
    height: 15px;
    width: 14px;
    margin: 12px 0 0 10px;
  }
  .remember-pwd{
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 104px;
  height: 40px;
  float: right;
  border: 1px solid #E6E6E6;
  img {
    cursor: pointer;
    vertical-align: middle;
    width: 100%;
    height: 100%;
  }
}
.login-code-img {
  height: 38px;
}
.login-footer-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 353px;
  .el-button.login-submit{
    width: 300px;
    height: 44px;
    background: linear-gradient(180deg, #0AB5FD 0%, #0164D5 100%);
    opacity: 1;
    border-radius: 10px;
    font-size: 16px;
    margin-top: 30px;
  }
  .el-button.login-register{
    width: 300px;
    height: 44px;
    border: 2px solid #2979FF;
    opacity: 1;
    border-radius: 10px;
    font-size: 16px;
    color: #2979FF;
    background-color: white;
    margin-top: 15px;
    margin-left: 0
  }
}
@media screen and (max-height: 850px) {
  .login>.login-bg{
    width: 570px;
    height: 470px;
  }
}
@media screen and (max-width: 1000px) {
  .login>.login-bg{
    display: none;
  }
  .login-form{
    margin: 0 auto !important;
  }
}
</style>
