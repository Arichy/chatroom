<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}
li {
  list-style: none;
}
a {
  color: #000;
}

html {
  height: 100%;
  min-height:100%;
}
body {
  min-height: 100%;
  position: relative;
}

.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}

// 一些简单的hr样式
.hr-cloud {
  border: 0;
  height: 0; /* Firefox... */
  box-shadow: 0 0 10px 1px black;
}
.hr-cloud::after{
  content:""// 防止margin塌陷
}

// .my-textarea {
//   .el-textarea__inner {
//     border-radius: 0px;
//   }
// }

// .my-input {
//   .el-input__inner {
//     border-radius: 0px;
//   }
// }
</style>
