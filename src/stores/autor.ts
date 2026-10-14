import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { AutorResponseDto } from 'src/models/Autor/AutorResponseDto';
import type { AutorRequestDto } from 'src/models/Autor/AutorRequestDto';
import { notificarExito } from 'src/utils/notificar';

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

  /** GET api/Autores/ById?Id=... Devuelve el autor o null si no existe. */
  async function fetchById(id: number): Promise<AutorResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<AutorResponseDto>(`/Autores/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Autores */
  async function create(autor: AutorRequestDto) {
    loading.value = true;
    try {
      await api.post('/Autores', autor);
      notificarExito('Autor creado');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Autores?Id=... */
  async function update(id: number, autor: AutorRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Autores?Id=${id}`, autor);
      notificarExito('Autor modificado');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Autores?Id=... (se llama borrar porque delete es palabra reservada) */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Autores?Id=${id}`);
      notificarExito('Autor eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { autores, loading, error, fetchAll, fetchById, create, update, borrar };
});
