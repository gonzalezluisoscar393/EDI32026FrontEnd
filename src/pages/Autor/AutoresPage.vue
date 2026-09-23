<template>
  <q-page class="q-pa-md">
    <q-table
      title="Autores"
      :rows="autorStore.autores"
      :columns="columns"
      row-key="id"
      :loading="autorStore.loading"
      :rows-per-page-options="[10, 20, 50, 0]"
      no-data-label="No hay autores para mostrar"
      loading-label="Cargando autores..."
    >
      <template #top-right>
        <q-btn
          flat
          round
          icon="refresh"
          aria-label="Actualizar"
          :loading="autorStore.loading"
          @click="autorStore.fetchAll()"
        />
      </template>
    </q-table>

    <q-banner v-if="autorStore.error" class="bg-negative text-white q-mt-md" rounded>
      {{ autorStore.error }}
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useAutorStore } from 'stores/autor';
import type { AutorResponseDto } from 'src/models/Autor/AutorResponseDto';

const autorStore = useAutorStore();

const columns: QTableColumn<AutorResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'apellido', label: 'Apellido', field: 'apellido', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'fechaNacimiento', label: 'Fecha de nacimiento', field: 'fechaNacimiento', align: 'center', sortable: true, }
];

onMounted(() => {
  void autorStore.fetchAll();
});
</script>
