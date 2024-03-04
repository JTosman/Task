<template>
  <q-page padding>
    <h3>Mis tareas</h3>
    <div class="row q-gutter-x-sm q-mb-lg">
      <div class="col-2">
        <q-select
          color="primary"
          filled
          v-model="orderOptions.selected.value"
          :options="categories"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          label="Ordenar"
          @update:model-value="orderTasks()"
          y
        >
          <template v-if="orderOptions.selected.value" v-slot:append>
            <q-icon
              name="cancel"
              @click.stop.prevent="
                (orderOptions.selected.value = null), orderTasks()
              "
              class="cursor-pointer"
            />
          </template>
        </q-select>
      </div>
      <div class="col-2 flex">
        <q-btn
          color="primary"
          icon="task"
          label="Crear tarea"
          @click="taskDialog = true"
        />

        <q-dialog v-model="taskDialog" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Crear</div>
            </q-card-section>
            <q-form
              @submit="sendTask(taskForm.inputs), (taskDialog = false)"
              class="q-gutter-md"
            >
              <q-card-section class="q-pt-none">
                <q-input
                  dense
                  v-model="taskForm.inputs.name"
                  label="Nombre"
                  maxlength="15"
                  :rules="[(val) => !!val || 'El nombre es requerido']"
                />
                <q-select
                  v-model="taskForm.inputs.category"
                  :options="categories"
                  label="Categoria"
                  emit-value
                  map-options
                  :rules="[(val) => !!val || 'La categoria es requerida']"
                />
                <q-separator spaced />

                <q-toggle
                  v-model="taskForm.inputs.important"
                  label="Importante?"
                  left-label
                />
                <q-separator spaced />
                <div v-if="taskForm.inputs.important == true">
                  <q-date
                    v-model="taskForm.inputs.init_date"
                    minimal
                    mask="MM-DD-YYYY"
                    :rules="[
                      (val) =>
                        val > taskForm.inputs.finish_date.value || 'Error',
                    ]"
                  />
                  <q-date
                    v-model="taskForm.inputs.finish_date"
                    minimal
                    mask="MM-DD-YYYY"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <q-btn
                  flat
                  label="Cancel"
                  @click="onReset(), (taskDialog = false)"
                />
                <q-btn
                  v-if="taskForm.action == 'create'"
                  label="Guardar"
                  type="submit"
                  color="primary"
                />
                <q-btn
                  v-if="taskForm.action == 'edit'"
                  label="Actualizar"
                  type="submit"
                  color="primary"
                />
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
      </div>
    </div>

    <p v-if="tasks.length == 0" class="text-h6 text-center q-my-xl">
      No hay Tareas
    </p>
    <div class="row" v-if="tasks">
      <div class="col-4" v-for="task in tasks" :key="task.id">
        <q-card flat bordered class="my-card">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">
                  {{ task.name }}
                  <q-badge
                    v-if="task.important"
                    outline
                    align="middle"
                    color="teal"
                  >
                    Importante
                  </q-badge>
                </div>
                <div>
                  <q-chip color="teal" text-color="white" icon="bookmark">
                    {{ task.category.name }}
                  </q-chip>
                </div>
                <q-separator spaced />

                <div v-if="task.important">
                  Tiempo {{ task.init_date }} - {{ task.finish_date }}
                </div>
                <div v-if="!task.important">Tiempo Indefinido</div>
              </div>

              <div class="col-auto">
                <q-btn color="grey-7" round flat icon="more_vert">
                  <q-menu cover auto-close>
                    <q-list>
                      <q-item
                        clickable
                        @click="editTask(task), (taskDialog = true)"
                      >
                        <q-item-section>Editar</q-item-section>
                      </q-item>
                      <q-item clickable @click="deleteTask(task.id)">
                        <q-item-section>Eliminar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn
              v-if="task.completed"
              color="secondary"
              icon="check"
              label="Completado"
              @click="markTask(task.id)"
            />
            <q-btn
              v-if="!task.completed"
              color="brown-5"
              icon="pending"
              label="Sin completar"
              @click="markTask(task.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useTasksStore } from "src/stores/tasks";
import useTasks from "src/composables/useTasks";
import { ref, onMounted } from "vue";
import taskFormInterface from "src/interfaces/taskFormInterface";
import { storeToRefs } from "pinia";
import { useCategoriesStore } from "src/stores/categories";

export default {
  // name: 'PageName',

  setup() {
    const { setDataTask } = useTasks();
    const tasksStore = useTasksStore();
    const categoriesStore = useCategoriesStore();
    const { tasks } = storeToRefs(tasksStore);
    const { categories } = storeToRefs(categoriesStore);
    const taskForm = ref(taskFormInterface());

    onMounted(() => {
      tasksStore.loadTasks();
      categoriesStore.loadCategories();
    });

    const orderOptions = {
      selected: ref(null),
    };

    let taskId = null;

    const sendTask = (data) => {
      const body = setDataTask(data, false);
      console.log("body: ", body);

      if (taskForm.value.action == "create") {
        tasksStore.saveTasks(body);
      } else {
        tasksStore.editTask(body, taskId);
      }
      onReset();
    };

    const deleteTask = (id) => {
      tasksStore.removeTask(id);
    };

    const editTask = async (data) => {
      taskForm.value.inputs = await setDataTask(data, true);
      taskForm.value.action = "edit";
      taskId = data.id;
    };

    const markTask = (id) => {
      tasksStore.changeTask(id);
    };

    const orderTasks = () => {
      if (orderOptions.selected.value != null) {
        tasksStore.orderTasks(orderOptions.selected.value);
      } else {
        tasksStore.loadTasks();
      }
    };

    const onReset = () => {
      taskForm.value = taskFormInterface();
      taskId = null;
    };

    return {
      tasks,
      taskDialog: ref(false),
      taskForm,
      taskId,
      sendTask,
      editTask,
      deleteTask,
      markTask,
      onReset,
      categories,
      orderOptions,
      orderTasks,
    };
  },
};
</script>

<style>
.my-card {
  max-height: 209px;
  min-height: 209px;
}
</style>
