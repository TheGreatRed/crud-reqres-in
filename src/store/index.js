import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '@/firebase';
import { collection, query, where, getDocs } from '@firebase/firestore';
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    async obtenerUsuario(correo) {
      let usuario = null;
      const q = query(collection(db, "usuarios"), where("correo", "==", correo));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        usuario = doc.data()
      });
      return usuario;
    }
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
