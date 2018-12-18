<template>
    <el-form ref="form" :model="loginForm">
        <div class="wrapper">
            <el-form-item label="用户名" label-width="70px">
                <el-input v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="70px">
                <el-input v-model="loginForm.password" type="password"></el-input>
            </el-form-item>

            <el-alert :title="msg" v-show="showMsg" :closable="false" :type="type" class="text-center"></el-alert>
        </div>
    
        <el-form-item class="text-center">
            <el-button type="primary" @click="handleLogin">立即登陆</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import Vue from "vue";
import { vuser_pass as validate } from "@/assets/util/validate.js";

export default Vue.extend({
  data() {
    return {
      loginForm: {
        username: "Arichy",
        password: "123"
      },
      msg: "",
      type: "error",
      showMsg: false
    };
  },
  methods: {
    async handleLogin() {
      const { username, password } = this.loginForm;
      const { msg, type } = validate(username, password);

      if (type == "error") {
        this.msg = msg;
        this.type = type;
        this.showMsg = true;

        return false;
      }

      try {
        const res = await this.$http.post(`/api/login`, {
          username: this.loginForm.username,
          password: this.loginForm.password
        });
        console.log("loginres", res);

        // 登陆成功
        if (res.data.success) {
          // 存储用户名
          sessionStorage.setItem("username", this.loginForm.username);
          // 跳转至showroom页面
          this.$router.push("showroom");
        } else {
          this.showMsg = true;
          this.msg = res.data.msg;
        }
      } catch (err) {
        this.showMsg = true;
        this.msg = "登录失败，请稍后再试";
      }
    }
  },

  mounted() {
    // 弹出"请登录"的提示
    if (this.$route.query.tip === true) {
      this.$alert("请先登录", "登录提示");
    }
  }
});
</script>

<style lang="scss" scoped>
.el-form {
  .wrapper {
    height: 170px;
    .el-form-item {
      .el-input {
        min-width: 200px;
      }
    }
    .el-alert {
      width: 300px;
      margin-left: 20%;
      text-align: center;
    }
  }
}
</style>
