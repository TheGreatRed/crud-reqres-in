<template>
  <div class="Inicio">
    <div class="container container-center">
      <div class="row justify-content-center">
        <div class="col-md-12 mt-4 text-center">
          <div>
            <i class="fas fa-id-card text-dark" style="font-size: 100px"></i>
          </div>
        </div>
        <div class="col-md-12 mt-2 text-center">
          <p v-if="correo">
            <b class="text-primary">[</b> Usuario
            <b class="text-primary">]</b>
            <b class="text-primary">[</b> {{ correo }}
            <b class="text-primary">]</b>
            <br />
          </p>
        </div>
        <div class="col-md-4 text-center">
          <button type="button" class="btn btn-primary btn-sm w-100" data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
            MENÚ
          </button>
        </div>
        <div class="col-12 mt-4 mb-3">
          <div class="row">
            <div class="col-sm-3"></div>
            <div class="col-sm-6 text-center">
              <div class="alert alert-info" role="alert">
                <h4 class="alert-heading fs-6">
                  📌 Hola, bienvenido a <small><b>PruebaTecnicaApp v0.0.0</b></small>
                </h4>
              </div>
            </div>
            <div class="col-sm-6"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Inicio",

  data() {
    return {
      correo: "",
    }
  },

  mounted() {
    document.title = 'Inicio - PruebaTecnicaApp'
  },

  async created() {
    let usuario = await this.$store.state.obtenerUsuario(localStorage.getItem("correo"))
    if (!usuario) {
      this.$router.push('/login')
    } else {
      this.correo = usuario.correo;
    }
  },
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

div {
  animation: fadeIn;
  animation-duration: 1s;
}
</style>