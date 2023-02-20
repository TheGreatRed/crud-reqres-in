<template>
  <div id="app">
    <div id="nav">
      <Navbar />
    </div>
    <div id="contenedor">
      <router-view />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import loading from "vuejs-loading-screen";
import Navbar from "@/components/Navbar";
Vue.use(loading, {
  bg: "rgba(0,0,0,0.5);",
  slot: `
    <div class="px-5 py-3 bg-gray-800 rounded">
      <h3 class="text-4xl color-loading"><i class="fas fa-circle-notch fa-spin" style="font-size: 50pt"></i></h3>
    </div>
  `,
});
export default {
  components: {
    Navbar,
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Cutive+Mono');

*,
*:before,
*:after {
  box-sizing: border-box;
}

html {
  font: dubai;
  font-size: 18px;
}

body {
  font-family: "dubai", serif;
  font-size: 1.1em;
  line-height: 1.6;
  background: #ffffff;
  overflow-x: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav a {
  font-size: 12pt;
}

#contenedor {
  padding: 10px;
}

.color-loading,
.text-primary {
  color: #01cfe4 !important;
}

.btn-primary {
  background-color: #01cfe4;
  border: none;
}

.form-control:focus {
  border-color: #01cfe4;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0), 0 0 8px rgba(0, 0, 0, 0);
}

.btn-primary:hover,
.btn-danger:hover,
.btn-secondary:hover,
.btn-success:hover,
.btn-primary:focus,
.btn-danger:focus,
.btn-secondary:focus,
.btn-success:focus {
  background-color: #fff;
  border: 1px solid #01cfe4;
  color: #01cfe4;
}

.btn:focus {
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0), 0 0 8px rgba(0, 0, 0, 0) !important;
}
</style>
