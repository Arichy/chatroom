<!-- 
    @Auther Arichy

    利用div模拟textarea
    实现以下功能:
        • 样式定制
        • enter发送消息
        • ctrl+enter换行
 -->

 <template>
    <div
    class="my-textarea" 
    ref="textarea" 
    contenteditable 

    :value="value"
    
    @input="$emit('input',$event.target.innerText)"
    @keyup.enter="submit"
    >
    {{value}}
     </div>
 </template>
 
 <script>
export default {
  data() {
    return {};
  },
  props: ["css", "value"],

  watch: {
    value(newValue) {
      this.$refs.textarea.innerText = newValue;
    }
  },

  methods: {
    submit() {}
  },

  mounted() {
    // 设置父组件传递进来的css
    let textarea = this.$refs.textarea;
    for (let attr in this.css) {
      textarea.style[attr] = this.css[attr];
    }

    let range = document.getSelection();

    range.selectAllChildren(textarea);
    range.collapseToEnd();

  }
};
</script>
 
 <style lang="scss" scoped>
.my-textarea {
  // background-color: skyblue;

  padding: 10px 10px;
  font-size: 13px;
  overflow: hidden;
}
</style>
 