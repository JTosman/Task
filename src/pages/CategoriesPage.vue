<template>
  <q-page padding>
    <!-- content -->
    <h3>Categorias</h3>
    <div class="row q-gutter-x-sm q-mb-lg">
      <div class="col-5">
        <q-btn
          color="primary"
          icon="category"
          label="Crear categoria"
          @click="categoryDialog = true"
        />

        <q-dialog v-model="categoryDialog" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Crear</div>
            </q-card-section>

            <q-form
              @submit="
                sendCategory(categoryForm.inputs), (categoryDialog = false)
              "
              class="q-gutter-md"
            >
              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  v-model="categoryForm.inputs.name"
                  autofocus
                  maxlength="12"
                  :rules="[(val) => !!val || 'El nombre es requerido']"
                />
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn label="Guardar" type="submit" color="primary" />
                <q-btn
                  flat
                  label="Cancel"
                  @click="onReset(), (categoryDialog = false)"
                />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
      </div>
    </div>
    <div class="q-pa-md flex flex-center" style="max-width: 350px">
      <div class="col-12">
        <q-list bordered separator v-for="item in categories" :key="item.value">
          <q-dialog v-model="alertDialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">Alert</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                Cuidado estas apunto de borrar una categoria, ten en cuenta que
                si borras esta categoria se eliminaran las tareas relacionadas a
                ella
              </q-card-section>

              <q-card-actions align="right">
                <q-btn
                  flat
                  label="OK"
                  color="primary"
                  @click="deleteCategory(item.value), (alertDialog = false)"
                />
                <q-btn label="Cancel" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="category" />
            </q-item-section>
            <q-item-section class="q-mr-xl">
              <q-item-label overline>{{ item.label }}</q-item-label>
            </q-item-section>
            <q-item-section style="margin-left: 115px">
              <q-fab
                label-position="top"
                external-label
                color="purple"
                icon="keyboard_arrow_right"
                direction="right"
                padding="xs"
              >
                <q-fab-action
                  padding="5px"
                  external-label
                  label-position="top"
                  color="primary"
                  @click="editCategory(item), (categoryDialog = true)"
                  icon="edit"
                />
                <q-fab-action
                  padding="5px"
                  external-label
                  label-position="top"
                  color="orange"
                  icon="delete"
                  @click="alertDialog = true"
                />
              </q-fab>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
import { storeToRefs } from "pinia";
import useCategories from "src/composables/useCategories";
import categoryFormInterface from "src/interfaces/categoryFormInterface";
import { useCategoriesStore } from "src/stores/categories";
import { onMounted } from "vue";
import { ref } from "vue";

export default {
  // name: 'PageName',
  setup() {
    const { setDataCategory } = useCategories();
    const categoriesStore = useCategoriesStore();

    let categoryId = null;
    const categoryForm = ref(categoryFormInterface());
    const { categories } = storeToRefs(categoriesStore);

    onMounted(() => {
      categoriesStore.loadCategories();
    });

    const sendCategory = (data) => {
      const body = setDataCategory(data, false);
      console.log("body: ", body);

      if (categoryForm.value.action == "create") {
        categoriesStore.saveCategory(body);
      } else {
        categoriesStore.editCategory(body, categoryId);
      }

      onReset();
    };

    const editCategory = async (data) => {
      categoryForm.value.inputs = await setDataCategory(data, true);
      categoryForm.value.action = "edit";
      categoryId = data.value;
    };

    const deleteCategory = (id) => {
      categoriesStore.removeCategory(id);
    };

    const onReset = () => {
      categoryForm.value = categoryFormInterface();
      categoryId = null;
    };

    return {
      categories,
      categoryForm,
      categoryDialog: ref(false),
      alertDialog: ref(false),
      sendCategory,
      editCategory,
      deleteCategory,
      onReset,
    };
  },
};
</script>
