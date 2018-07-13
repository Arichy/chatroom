<template>
    <el-form ref="form" :model="regForm">
        <el-form-item label="用户名" label-width="20%">
            <el-input v-model="regForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="20%">
            <el-input v-model="regForm.password" type="password"></el-input>
        </el-form-item>

        <el-form-item class="text-center">
            <el-button type="primary" @click="reg">立即注册</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      regForm: {
        username: "nmsl",
        password: "nmsle"
      }
    };
  },
  methods: {
    reg(){
        alert("注册");
    }
  }
});
</script>
