<template>
  <div class="container flex justify-center items-center column">
    <h4>Iniciar Sesion</h4>
    <q-form @submit="sendCredentials" @reset="onReset" class="q-gutter-md">
      <div class="row justify-center q-gutter-y-md">
        <div class="col-12">
          <q-input v-model="email" type="email" label="Correo" />
        </div>
        <div class="col-12">
          <q-input
            v-model="password"
            type="password"
            label="Contraseña"
            :rules="[
              (val) =>
                (val && val.length > 2) ||
                'Las contraseña debe tener minimo 3 caracteres',
            ]"
          />
        </div>
        <div>
          <q-btn label="Login" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>

<script>
import { useAuthStore } from "src/stores/auth";
import useApiService from "src/composables/useApiService";

export default {
  // name: 'PageName',

  data() {
    return {
      email: "juan@gmail.com",
      password: "123",
      apiService: useApiService(),
    };
  },
  methods: {
    async sendCredentials() {
      const data = {
        password: this.password,
        email: this.email,
      };

      const auth = useAuthStore();

      console.log(data);

      await this.apiService
        .apiPost("/login", data, false)
        .then((result) => {
          console.log("result: ", result);
          auth.saveToken(result.data);
          this.$router.push("/tasks");
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    },
    onReset() {
      this.password = "";
      this.email = "";
    },
  },
};
</script>

<style>
.container {
  height: 100vh;
}
</style>
