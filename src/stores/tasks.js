import { defineStore } from 'pinia'
import useTasks from 'src/composables/useTasks'
import { ref } from 'vue';

const { createTask, updateTask, getTasks, deleteTask, changeStateTask } = useTasks();

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: ref([])
  }),
  actions: {
    async loadTasks() {

      this.tasks = await getTasks('')

    },
    async saveTasks(data) {

      await createTask(data)

      this.loadTasks();
    },
    async editTask(data, id) {

      await updateTask(data, id)

      this.loadTasks();
    },
    async removeTask(id) {

      await deleteTask(id)

      this.loadTasks()
    },
    async changeTask(id) {

      await changeStateTask(id)

      this.loadTasks()
    },
    async orderTasks(id) {

      const param = '?order=' + id

      this.tasks = await getTasks(param)
    }
  }
})
