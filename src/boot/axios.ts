import { defineBoot } from '#q-app/wrappers';
import axios, { type AxiosInstance } from 'axios';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Instancia de axios apuntando a la API de Biblioteca.
// Los stores importan `api` directamente; `$api` queda disponible en los componentes.
const api = axios.create({
  baseURL: 'https://localhost:7024/api',
  headers: { 'Content-Type': 'application/json' },
});

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
