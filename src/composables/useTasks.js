import axios from "axios";
import { useAuthStore } from "src/stores/auth";
import { ref } from "vue";
import environment from "src/envirorment";
import { Notify } from "quasar";


const apiUrl = environment.host;


export default function useTasks() {

  const tasks = ref([])

  const auth = useAuthStore();

  const headers = {
    'Authorization': 'Bearer ' + auth.token
  }

  async function getTasks(params) {

    try {

      const response = await axios.get(apiUrl + '/tasks' + params, { headers: headers })

      return tasks.value = response.data.tasks

    } catch (err) {
      console.log('err: ', err);
    }
  }

  async function createTask(data) {
    await axios.post(apiUrl + '/task/create', data, { headers: headers }).then((result) => {

      Notify.create({
        type: 'positive',
        message: result.data.message
      })

    }).catch((err) => {
      Notify.create({
        type: 'negative',
        message: 'No se pudo crear la tarea, error ' + err.status
      })
    });


  }

  async function updateTask(data, id) {
    await axios.post(apiUrl + '/task/update/' + id, data, { headers: headers }).then((result) => {

      Notify.create({
        type: 'positive',
        message: result.data.message
      })

    }).catch((err) => {
      Notify.create({
        type: 'negative',
        message: 'No se pudo actualizar la tarea, error ' + err.status
      })
    });


  }

  async function deleteTask(id) {

    await axios.get(apiUrl + '/task/delete/' + id, { headers: headers }).then((result) => {

      Notify.create({
        type: 'positive',
        message: result.data.message
      })

    }).catch((err) => {
      Notify.create({
        type: 'negative',
        message: 'No se pudo eliminar la tarea, error ' + err.status
      })
    });

  }

  async function changeStateTask(id) {

    try {
      const response = await axios.get(apiUrl + '/task/complete/' + id, { headers: headers })
    } catch (error) {
      console.log('error: ', error);

    }
  }

  async function importantTask(value) {

    try {

      const response = await axios.get(apiUrl + '/tasks?important=' + value, { headers: headers })

      tasks.value = response.data.tasks

    } catch (err) {
      console.log('err: ', err);
    }
  }

  function setDataTask(data, edit) {

    console.log('data: ', data.category);

    if (edit) {
      data = reformatData(data)
      return {
        name: ref(data.name),
        category: ref(data.category),
        important: ref(data.important),
        init_date: ref(data.init_date),
        finish_date: ref(data.finish_date)
      }
    } else {

      let category = data.category.value;

      if (!category) {

        category = data.category;
      }

      return {
        name: data.name,
        category: category,
        important: data.important,
        init_date: data.init_date,
        finish_date: data.finish_date
      }
    }

  }

  function reformatData(data) {

    data.important == 1 ? data.important = true : data.important = false;

    data.category = {
      label: data.category.name,
      value: data.category_id
    }
    console.log('data: ', data);

    return data
  }

  return {

    tasks,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    changeStateTask,
    importantTask,
    setDataTask
  }
}
