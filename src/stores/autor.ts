import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { AutorResponseDto } from 'src/models/AutorResponseDto';

export const useAutorStore = defineStore('autor', () => {
  const autores = ref<AutorResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Autores/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<AutorResponseDto[]>('/Autores/All');
      autores.value = data;
    } catch (e) {
      autores.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los autores`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los autores';
      }
    } finally {
      loading.value = false;
    }
  }

  return { autores, loading, error, fetchAll };
});
