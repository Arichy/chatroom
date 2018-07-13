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
  // background-color: grey;
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
</style>
