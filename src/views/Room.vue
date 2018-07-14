<template>
    <el-container>
        <el-header>
            <nav-menu></nav-menu>
        </el-header>
        <el-main></el-main>
        <Footer></Footer>
    </el-container>
</template>

<script lang="ts">
import Vue from "vue";
import NavMenu from "@/components/NavMenu.vue";
import Footer from "@/components/Footer.vue";
export default Vue.extend({
  components: {
    NavMenu,
    Footer
  }
});
</script>

<style lang="scss" scoped>
</style>
