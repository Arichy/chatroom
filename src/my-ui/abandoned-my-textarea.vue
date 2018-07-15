<template>
    <el-input type="textarea" ref="my-textarea"></el-input>
</template>

<script>
export default {
  props: [
    "myStyle", //设置渲染后的input原生样式
    "elAttr", //设置el-input的props属性
    "rawAttr", //设置渲染后的input的原生html属性
  ],

  mounted() {
    // el-input，Vue组件
    let elTextarea = this.$refs["my-textarea"];
    // textarea，原生html元素
    let textarea = elTextarea.$refs.textarea;

    for (let attr in this.$props["myStyle"]) {
      textarea.style[attr] = this.$props["myStyle"][attr];
    }

    /**
     * 这里会报错，因为正常写法应该是通过el-input的props传递值，即
     * 作为父组件的本组件向作为子组件的el-input传值，但是那样就需要
     * 在本组件的el-input上将属性通过:方式写出来，失去了可定制性。
     */
    for (let attr in this.$props["elAttr"]) {
      elTextarea[attr] = this.$props["elAttr"][attr];
    }

    for (let attr in this.$props["rawAttr"]) {
      textarea.setAttribute(attr, this.$props["rawAttr"][attr]);
    }
  }
};
</script>
