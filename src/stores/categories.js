import { defineStore } from 'pinia'
import useCategories from 'src/composables/useCategories';
import { ref } from 'vue';

const { getCategories, createCategory, updateCategory, deleteCategory } = useCategories();

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: ref([])
  }),
  actions: {
    async loadCategories() {
      this.categories = await getCategories();
    },
    async saveCategory(data) {

      await createCategory(data)

      this.loadCategories()
    },
    async editCategory(data, id) {

      await updateCategory(data, id)

      this.loadCategories();
    },
    async removeCategory(id) {

      await deleteCategory(id)

      this.loadCategories();

    },
  }
})
