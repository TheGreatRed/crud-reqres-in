<template>
    <div class="Navbar">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm">
            <div class="container-fluid">
                <router-link to="/inicio">
                    <a class="navbar-brand text-decoration-none" href="javascript:void(0)">
                        <img src="https://keybe.co/wp-content/uploads/2023/02/KB-Keybe-brand-white.svg" alt="" width="50"
                            class="d-inline-block align-text-top" />
                    </a>
                </router-link>
                <button class="btn btn-dark btn-sm" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
        </nav>
        <div class="offcanvas offcanvas-start bg-dark text-light" tabindex="-1" id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title fw-bold fs-6" id="offcanvasExampleLabel">
                    <img src="https://keybe.co/wp-content/uploads/2023/02/KB-Keybe-brand-white.svg" alt="" width="50"
                        class="d-inline-block align-text-center me-2" /> PruebaTecnicaApp
                </h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body justify-content-start">
                <ul class="list-unstyled ps-0" id="navegacion">
                    <template v-if="!esLogeado">
                        <li class="mb-1">
                            <router-link to="/login">
                                <button class="btn text-light fw-bold align-items-center rounded shadow-none"
                                    data-bs-dismiss="offcanvas" aria-label="Close">
                                    Login
                                </button>
                            </router-link>
                        </li>
                    </template>
                    <template v-else>
                        <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                            data-bs-target="#usuario-collapse" aria-expanded="false">
                            {{ correo }}
                        </button>
                        <div class="collapse" data-bs-parent="#navegacion" id="usuario-collapse">
                            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li>
                                    <a href="javascript:void(0)" class="rounded" data-bs-dismiss="offcanvas"
                                        aria-label="Close" @click="cerrarSesion()">
                                        Cerrar Sesión
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <li class="border-top my-3"></li>
                        <li class="mb-1">
                            <router-link to="/inicio">
                                <button class="btn text-light fw-bold align-items-center rounded shadow-none"
                                    data-bs-dismiss="offcanvas" aria-label="Close">
                                    Inicio
                                </button>
                            </router-link>
                        </li>
                        <li class="mb-1">
                            <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse"
                                data-bs-target="#usuarios-collapse" aria-expanded="false">
                                Usuarios
                            </button>
                            <div class="collapse" data-bs-parent="#navegacion" id="usuarios-collapse">
                                <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                    <li>
                                        <router-link to="/usuarios" class="rounded" data-bs-dismiss="offcanvas"
                                            aria-label="Close">
                                            Lista
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link to="/crear" class="rounded" data-bs-dismiss="offcanvas"
                                            aria-label="Close">
                                            Crear Usuario
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';
export default {
    name: "Navbar",

    data() {
        return {
            esLogeado: null,
            correo: ""
        }
    },

    async created() {
        let obtenerUsuario = await this.$store.state.obtenerUsuario(localStorage.getItem("correo"));
        if (obtenerUsuario) {
            this.esLogeado = true;
            this.correo = localStorage.getItem("correo");
        }
    },

    methods: {
        cerrarSesion() {
            Swal.fire({
                title: '<h5>¿Deseas cerrar sesión?</h5>',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Cerrar Sesión',
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
                    localStorage.setItem("correo", "");
                    this.esLogeado = false;
                    this.correo = "";
                    this.$router.push('/login');
                }
            });
        }
    }
}
</script>

<style scoped>
.btn-toggle {
    display: inline-flex;
    align-items: center;
    padding: .25rem .5rem;
    font-weight: 600;
    color: #e5e5e5;
    background-color: transparent !important;
    box-shadow: none;
    border: 0;
}

.btn-toggle:hover,
.btn-toggle:focus {
    color: #e5e5e5;
    background-color: #e5e5e5;
}

.btn-toggle::before {
    width: 1.25em;
    line-height: 0;
    content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
    transition: transform .35s ease;
    transform-origin: .5em 50%;
    filter: invert(1);
}

.btn-toggle[aria-expanded="true"] {
    color: rgba(255, 255, 255, .85);
}

.btn-toggle[aria-expanded="true"]::before {
    transform: rotate(90deg);
}

.btn-toggle-nav a {
    display: inline-flex;
    padding: .1875rem .5rem;
    margin-top: .125rem;
    margin-left: 1.25rem;
    text-decoration: none;
    color: rgba(255, 255, 255, .85);
}

.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
    background-color: #e5e5e5;
    color: #2f2f2f;
}

.btn-toggle-nav a.active {
    font-weight: bold;
}

.btn-close {
    filter: invert(1) !important;
    box-shadow: none !important
}
</style>