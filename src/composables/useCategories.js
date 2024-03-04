import axios from "axios";
import { useAuthStore } from "src/stores/auth";
import { ref } from "vue";
import environment from "src/envirorment";
import { Notify } from "quasar";



const apiUrl = environment.host;


export default function useCategories() {

  const categories = ref([])

  const auth = useAuthStore();

  const header = {
    'Authorization': 'Bearer ' + auth.token
  }

  async function getCategories() {

    try {

      const response = await axios.get(apiUrl + '/categories', { headers: header })

      return categories.value = response.data.categories.map(item => {

        return {
          label: item.name,
          value: item.id
        }
      });

    } catch (err) {
      console.log('err: ', err);
    }
  }

  async function createCategory(data) {


    await axios.post(apiUrl + '/category/create', data, { headers: header }).then((result) => {

      Notify.create({
        type: 'positive',
        message: result.data.message
      })

    }).catch((err) => {

      Notify.create({
        type: 'negative',
        message: 'No se pudo crear la categoria, error ' + err.status
      })

    });

  }

  async function updateCategory(data, id) {


    await axios.post(apiUrl + '/category/update/' + id, data, { headers: header }).then((result) => {

      Notify.create({
        type: 'positive',
        message: result.data.message
      })
    }).catch((err) => {

      Notify.create({
        type: 'negative',
        message: 'No se pudo actualizar la categoria, error ' + err.status
      })

    });


  }

  async function deleteCategory(id) {


    await axios.get(apiUrl + '/category/delete/' + id, { headers: header }).then((result) => {

      Notify.create({
        type: 'positive',
        message: result.data.message
      })

    }).catch((err) => {

      Notify.create({
        type: 'negative',
        message: 'No se pudo eliminar la categoria, error ' + err.status
      })

    });


  }

  function setDataCategory(data, edit) {


    if (edit) {
      return {
        name: ref(data.label),
      }
    } else {
      return {
        name: data.name,
      }
    }

  }

  return {

    categories,
    getCategories,
    createCategory,
    updateCategory,
    setDataCategory,
    deleteCategory
  }
}
