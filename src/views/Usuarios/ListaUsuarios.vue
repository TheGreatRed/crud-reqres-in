<template>
    <div class="ListaUsuarios">
        <div class="container mt-5 mb-3">
            <div class="row justify-content-center">
                <div class="col-md-12">
                    <h1 class="h4 mt-5 fw-bold text-center">Lista de Usuarios</h1>
                </div>
                <div class="col-md-11 mt-4 text-center">
                    <router-link to="/crear">
                        <button type="button" class="btn btn-primary">Crear Usuario</button>
                    </router-link>
                </div>
                <div class="col-md-8 mt-4 mb-4">
                    <div class="form-floating">
                        <input type="text" class="form-control form-control-sm" v-model="buscador" id="floatingInput"
                            placeholder="Buscar" :disabled="filtroUsuarios.length === 0 && !buscador">
                        <label for="floatingInput">Buscar</label>
                    </div>
                </div>
                <div v-if="filtroUsuarios.length === 0 && !buscador" class="col-md-8">
                    <h1 class="h6 mt-3 fw-normal text-center">No se encontraron usuarios</h1>
                </div>
                <div v-if="filtroUsuarios.length === 0 && buscador" class="col-md-8">
                    <h1 class="h6 mt-3 fw-normal text-center">No se encontraron resultados para "<b>{{ buscador }}</b>"</h1>
                </div>
                <div v-else class="card mb-3 me-3 ms-3 me-3 mw-540 shadow-sm" v-for="(usuario) of filtroUsuarios"
                    :key="usuario.idAPI">
                    <div class="d-flex g-0">
                        <img :src="usuario.foto" class="img-fluid rounded mt-3" width="110px" alt="">
                        <div class="card-body">
                            <h5 class="card-title">{{ usuario.nombre }} {{ usuario.apellidos }}</h5>
                            <p class="card-text fs-6 text-break">{{ usuario.correo }}</p>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end mb-3">
                        <button type="button" class="btn btn-secondary btn-sm me-2" data-bs-toggle="modal"
                            data-bs-target="#editarUsuario" @click="obtenerUsuario(usuario.idAPI)">Editar</button>
                        <button type="button" class="btn btn-danger btn-sm"
                            @click="eliminarUsuarioAPI(usuario.idAPI, usuario.idBD)">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- MODAL- EDITAR USUARIO -->
        <div class="modal fade" id="editarUsuario" tabindex="-1" aria-labelledby="editarUsuarioLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg modal-fullscreen-sm-down">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editarUsuarioLabel">Editar Usuario</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form @submit.prevent="editarUsuarioAPI(usuario.idAPI)">
                        <div class="modal-body">
                            <div class="row justify-content-center">
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
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                                id="cerrar">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, getDocs, orderBy, serverTimestamp, deleteDoc } from "firebase/firestore";
import axios from 'axios'
import Swal from 'sweetalert2';
export default {
    name: "ListaUsuarios",

    data() {
        return {
            usuarios: [],
            buscador: "",
            usuario: {
                idBD: "",
                idAPI: "",
                foto: "",
                nombre: "",
                apellidos: "",
                correo: "",
            },
            token: "",
        }
    },

    computed: {
        filtroUsuarios() {
            return this.usuarios.filter(usuario => {
                return (
                    usuario.nombre.toLowerCase().includes(this.buscador.toLowerCase()) ||
                    usuario.apellidos.toLowerCase().includes(this.buscador.toLowerCase()) ||
                    usuario.correo.toLowerCase().includes(this.buscador.toLowerCase())
                );
            });
        }
    },

    mounted() {
        this.cerrarModal();
        document.title = 'Lista de Usuarios - PruebaTecnicaApp'
    },

    async created() {
        let usuario = await this.$store.state.obtenerUsuario(localStorage.getItem("correo"))
        if (!usuario) {
            this.$router.push('/login')
        } else {
            this.$isLoading(true);
            this.token = usuario.token;
            await this.obtenerUsuariosAPI(1);
            await this.obtenerUsuariosAPI(2);
            await this.obtenerUsuariosBD();
            this.$isLoading(false);
        }
    },

    methods: {
        cerrarModal() {
            let button = document.querySelector("#cerrar");
            button.click();
        },

        async obtenerUsuariosAPI(pagina) {
            let response = await axios({
                method: 'get',
                url: "https://reqres.in/api/users?page=" + pagina,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.token
                },
            });
            let data = response.data.data;
            let usuarios = data.map(usuario => usuario);
            await this.registroUsuarioAPI(usuarios)
        },

        registroUsuarioAPI(usuarios) {
            usuarios.map(usuario => {
                (async () => {
                    let obtenerUsuario = await this.verificarUsuario(usuario.id);
                    if (!obtenerUsuario) {
                        const refUsuario = doc(collection(db, "registros"));
                        await setDoc(doc(db, "registros", refUsuario.id), {
                            idAPI: usuario.id,
                            idBD: refUsuario.id,
                            idUsuario: this.token,
                            foto: usuario.avatar,
                            nombre: usuario.first_name,
                            apellidos: usuario.last_name,
                            correo: usuario.email,
                            registro: {
                                creacion: serverTimestamp(),
                                actualizacion: serverTimestamp()
                            }
                        });
                    }
                })();
            });
        },

        async verificarUsuario(id) {
            let usuario = null;
            const q = query(collection(db, "registros"), where("idAPI", "==", id));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                usuario = doc.data()
            });
            return usuario;
        },

        obtenerUsuariosBD() {
            const q = query(collection(db, "registros"), where("idUsuario", "==", this.token), orderBy("registro.creacion", "asc"));
            onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    let usuario = {
                        idBD: change.doc.id,
                        idAPI: change.doc.data().idAPI,
                        foto: change.doc.data().foto,
                        nombre: change.doc.data().nombre,
                        apellidos: change.doc.data().apellidos,
                        correo: change.doc.data().correo,
                    };
                    if (change.type === "added") {
                        this.usuarios.unshift(usuario)
                    }
                    else if (change.type === "modified") {
                        for (let index = 0; index < this.usuarios.length; index++) {
                            if (change.doc.id == this.usuarios[index].idBD) {
                                this.usuarios.splice(index, 1, usuario);
                            }
                        }
                    }
                    else if (change.type === "removed") {
                        for (let index = 0; index < this.usuarios.length; index++) {
                            if (change.doc.id == this.usuarios[index].idBD) {
                                this.usuarios.splice(index, 1);
                            }
                        }
                    }
                });
                let set = new Set(this.usuarios.map(JSON.stringify));
                this.usuarios = Array.from(set).map(JSON.parse);
            });
        },

        obtenerUsuario(id) {
            this.usuario = JSON.parse(JSON.stringify(this.usuarios.find((item) => item.idAPI === id)));
        },

        editarUsuarioAPI(id) {
            this.$isLoading(true);
            axios({
                method: 'patch',
                url: `https://reqres.in/api/users/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": this.token
                },
                data: {
                    id: this.usuario.idAPI,
                    first_name: this.usuario.nombre,
                    last_name: this.usuario.apellidos,
                    email: this.usuario.correo,
                    avatar: this.usuario.foto,
                }
            }).then(res => {
                if (res.data.id === this.usuario.idAPI) {
                    let usuario = this.usuarios.find((item) => item.idAPI === id);
                    (async () => {
                        this.editarUsuarioBD(res.data, this.usuario.idBD)
                    })();
                }
            });
        },

        async editarUsuarioBD(data, id) {
            await updateDoc(doc(db, "registros", id), {
                foto: data.avatar,
                nombre: data.first_name,
                apellidos: data.last_name,
                correo: data.email,
                "registro.actualizacion": serverTimestamp()
            });
            this.$isLoading(false);
            Swal.fire({
                icon: 'success',
                title: '<h5>¡Usuario editado correctamente!</h5>',
                confirmButtonText: 'Entendido',
                customClass: {
                    confirmButton: 'btn btn-secondary',
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            await this.cerrarModal();
        },

        eliminarUsuarioAPI(idAPI, idBD) {
            Swal.fire({
                title: '<h5>¿Estás seguro que deseas eliminar este usuario?</h5>',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-secondary me-2'
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    this.$isLoading(true);
                    axios({
                        method: 'delete',
                        url: `https://reqres.in/api/users/${idAPI}`,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": this.token
                        },
                    }).then(res => {
                        if (res.status === 204) {
                            (async () => {
                                await this.eliminarUsuarioBD(idBD);
                            })();
                        }
                    });
                }
            });
        },

        async eliminarUsuarioBD(id) {
            await deleteDoc(doc(db, "registros", id));
            this.$isLoading(false);
            Swal.fire({
                icon: 'success',
                title: '<h5>¡Usuario eliminado correctamente!</h5>',
                confirmButtonText: 'Entendido',
                customClass: {
                    confirmButton: 'btn btn-secondary',
                },
                buttonsStyling: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
        }
    }
}
</script>

<style scoped>
.mw-540 {
    max-width: 540px;
}

.form-floating {
    font-size: 12pt;
}

div {
    animation: fadeIn;
    animation-duration: 1s;
}

.form-floating:focus-within {
    z-index: 2;
}

input[type="text"] {
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

@media screen and (max-width: 420px) {
    img {
        width: 70px;
        height: 70px;
    }
}
</style>