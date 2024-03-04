import { defineStore } from 'pinia'
import useApiService from '../composables/useApiService'
import { ref } from 'vue'
import axios from 'axios'
import environment from 'src/envirorment'
import { Notify } from 'quasar'

const apiUrl = environment.host

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    loggedIn: false,
    user: ref({})
  }),


  actions: {
    saveToken(data) {
      console.log('data: ', data);
      this.token = data.access_token
      this.loggedIn = true
      this.user = data.user
    },
    async clearToken() {

      const data = ''

      await axios.post(apiUrl + '/logout', data, {
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      }).then((result) => {
        console.log('result: ', result);

        Notify.create({
          type: 'positive',
          message: 'Sesion Cerrada'
        })

        this.token = null
        this.loggedIn = null
        this.user = ref(null)


      }).catch((err) => {

        // Notify.create({
        //   type: 'positive',
        //   message: 'No se pudo cerrar sesion'
        // })

      });
    }
  }
})
