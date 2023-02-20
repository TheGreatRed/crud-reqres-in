<template>
    <div class="Login">
        <div class="container container-center">
            <div class="form-signin w-100 m-auto text-center">
                <form @submit.prevent="iniciarSesion()">
                    <img src="https://keybe.co/wp-content/uploads/2023/02/KB-Keybe-brand-white.svg" alt="" width="72"
                        height="57">
                    <h1 class="h6 mb-3 fw-normal">¡Bienvenido a PruebaTecnicaApp!</h1>
                    <div class="form-floating">
                        <input type="email" class="form-control form-control-sm" v-model="usuario.correo" id="floatingInput"
                            placeholder="Correo Electrónico" required>
                        <label for="floatingInput">Correo Electrónico</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control form-control-sm" v-model="usuario.clave"
                            id="floatingPassword" placeholder="Contraseña" required>
                        <label for="floatingPassword">Contraseña</label>
                    </div>
                    <button class="w-100 btn btn-md btn-primary" type="submit">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, doc, serverTimestamp, setDoc } from '@firebase/firestore';
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
    name: "Login",

    data() {
        return {
            usuario: {
                correo: "eve.holt@reqres.in",
                clave: "",
            }
        }
    },

    mounted() {
        document.title = 'Login - PruebaTecnicaApp'
    },

    async created() {
        let usuario = await this.$store.state.obtenerUsuario(localStorage.getItem("correo"))
        if (usuario) {
            this.$router.push('/inicio')
        }
    },

    methods: {
        async iniciarSesion() {
            this.$isLoading(true);
            try {
                let response = await axios({
                    method: 'post',
                    url: "https://reqres.in/api/login",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: {
                        email: this.usuario.correo,
                        password: this.usuario.clave,
                    },
                });
                let result = response;
                if (result.status === 400) {
                    Swal.fire({
                        icon: 'error',
                        title: '<h5>¡Usuario no encontrado!</h5>',
                        confirmButtonText: 'Entendido',
                        customClass: {
                            confirmButton: 'btn btn-secondary',
                        },
                        buttonsStyling: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                    });
                } else {
                    (async () => {
                        await this.registrarUsuario(result.data.token)
                    })();
                }
                this.$isLoading(false);
            } catch (error) {
                this.$isLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: '<h5>¡Usuario no encontrado!</h5>',
                    confirmButtonText: 'Entendido',
                    customClass: {
                        confirmButton: 'btn btn-secondary',
                    },
                    buttonsStyling: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                });
            }
        },

        async registrarUsuario(token) {
            let usuario = await this.$store.state.obtenerUsuario(this.usuario.correo);
            if (!usuario) {
                const refUsuario = doc(collection(db, "usuarios"));
                await setDoc(doc(db, "usuarios", refUsuario.id), {
                    id: refUsuario.id,
                    token: token,
                    correo: this.usuario.correo,
                    registro: {
                        creacion: serverTimestamp(),
                        actualizacion: serverTimestamp()
                    }
                });
            };
            this.$store.state.esLogeado = true;
            localStorage.setItem("correo", this.usuario.correo);
            this.$router.go(0);
        },
    }
}
</script>

<style scoped>
.container-center {
    position: absolute;
    left: 50%;
    top: 50%;
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.form-signin {
    max-width: 400px;
    padding: 15px;
    font-size: 12pt;
}

.form-signin .form-floating:focus-within {
    z-index: 2;
}

.form-signin input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
</style>