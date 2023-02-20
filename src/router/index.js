import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LoadingTo',
    component: () => import("../views/LoadingTo.vue"),
  },
  {
    path: '/inicio',
    name: 'Inicio',
    component: () => import("../views/Inicio.vue"),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("../views/Usuario/Login.vue"),
  },
  {
    path: '/usuarios',
    name: 'ListaUsuarios',
    component: () => import("../views/Usuarios/ListaUsuarios.vue"),
  },
  {
    path: '/crear',
    name: 'CrearUsuario',
    component: () => import("../views/Usuarios/CrearUsuario.vue"),
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    };
  },
});

export default router
