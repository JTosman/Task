<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Tareas App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-item-section>
          <q-item-section
            >{{ user.name }} <br />
            {{ user.email }}</q-item-section
          >
        </q-item>

        <q-separator spaced inset vertical dark />

        <q-item clickable tag="a" to="/tasks">
          <q-item-section avatar>
            <q-icon name="task" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Tareas</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" to="/categories">
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Categorias</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable tag="a" to="/" @click="logout()">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Cerrar Sesion</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  setup() {
    const leftDrawerOpen = ref(false);

    const authStore = useAuthStore();

    const { user } = storeToRefs(authStore);
    console.log("user: ", user);

    const logout = async () => {
      await authStore.clearToken();
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      user,
      logout,
    };
  },
});
</script>
