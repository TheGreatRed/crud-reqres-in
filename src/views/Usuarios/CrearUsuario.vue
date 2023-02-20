<template>
    <div class="CrearUsuario">
        <div class="container mt-5 mb-3">
            <form @submit.prevent="agregarUsuarioAPI()">
                <div class="row justify-content-center">
                    <div class="col-md-12 mb-3">
                        <h1 class="h4 mt-5 fw-bold text-center">Nuevo Usuario</h1>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="form-floating">
                            <input type="text" class="form-control form-control-sm" v-model="usuario.nombre"
                                id="floatingInput" placeholder="Nombre" required>
                            <label for="floatingInput">Nombre</label>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="form-floating">
                            <input type="text" class="form-control form-control-sm" v-model="usuario.apellidos"
                                id="floatingInput2" placeholder="Apellidos" required>
                            <label for="floatingInput2">Apellidos</label>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-floating">
                            <input type="email" class="form-control form-control-sm" v-model="usuario.correo"
                                id="floatingInput3" placeholder="Correo Electrónico" required>
                            <label for="floatingInput3">Correo Electrónico</label>
                        </div>
                    </div>
                </div>
                <div class="row mt-4 justify-content-center">
                    <div class="col-md-6 mb-3 text-center">
                        <router-link to="/usuarios">
                            <button type="button" class="btn btn-secondary w-100">Regresar</button>
                        </router-link>
                    </div>
                    <div class="col-md-6 mb-3 text-center">
                        <button type="submit" class="btn btn-primary w-100">Crear Usuario</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, doc, serverTimestamp, setDoc } from '@firebase/firestore';
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
    name: "CrearUsuario",

    data() {
        return {
            token: "",
            usuario: {
                nombre: "",
                apellidos: "",
                correo: "",
            }
        }
    },

    mounted() {
        document.title = 'Lista de Usuarios / Crear Usuario - PruebaTecnicaApp'
    },

    async created() {
        let usuario = await this.$store.state.obtenerUsuario(localStorage.getItem("correo"))
        if (!usuario) {
            this.$router.push('/login');
        } else {
            this.token = usuario.token;
        }
    },

    methods: {
        agregarUsuarioAPI() {
            this.$isLoading(true);
            axios({
                method: 'post',
                url: "https://reqres.in/api/users",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.token
                },
                data: {
                    first_name: this.usuario.nombre,
                    last_name: this.usuario.apellidos,
                    email: this.usuario.correo,
                    avatar: "https://yt3.ggpht.com/a/AGF-l7_ymSxOKPUYZG4H3FPiz6iWO6eVfqEs1jS5qw=s900-c-k-c0xffffffff-no-rj-mo"
                }
            }).then(res => {
                if (res.data.id) {
                    (async () => {
                        await this.agregarUsuarioDB(res.data)
                    })();
                }
            });
        },

        async agregarUsuarioDB(data) {
            const refUsuario = doc(collection(db, "registros"));
            await setDoc(doc(db, "registros", refUsuario.id), {
                idAPI: data.id,
                idBD: refUsuario.id,
                idUsuario: this.token,
                foto: data.avatar,
                nombre: data.first_name,
                apellidos: data.last_name,
                correo: data.email,
                registro: {
                    creacion: serverTimestamp(),
                    actualizacion: serverTimestamp()
                }
            });
            this.$isLoading(false);
            Swal.fire({
                icon: 'success',
                title: '<h5>¡Usuario creado correctamente!</h5>',
                confirmButtonText: 'Entendido',
                customClass: {
                    confirmButton: 'btn btn-secondary',
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.value) {
                    this.$router.push('/usuarios');
                }
            });
        }
    },
}
</script>

<style scoped>
div {
    animation: fadeIn;
    animation-duration: 1s;
}

.form-floating {
    font-size: 12pt;
}

.form-floating:focus-within {
    z-index: 2;
}

input[type="text"],
input[type="email"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
</style>