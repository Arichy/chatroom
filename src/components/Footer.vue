<template>
    <el-footer>
        <div class="text-center">
            <span class="foot">Made by Arichy of Wuhan University in Republic of Sichuan</span><br>
            <span class="foot">Copyright &copy;2018</span>
        </div>
    </el-footer>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
})
</script>


<style lang="scss" scoped>
.el-footer {
    position: absolute;
    bottom: 0px;
    width: 100%;

    .foot {
      color: #aaa;
      font-size: 15px;
    }
    .foot:last-child{
      font-size: 13px;
    }
}
</style>
