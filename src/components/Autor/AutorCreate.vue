<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar autor' : 'Nuevo autor' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.nombre"
          label="Nombre"
          outlined
          class="q-mb-sm"
          :maxlength="30"
          counter
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el nombre']"
        />
        <q-input
          v-model="form.apellido"
          label="Apellido"
          outlined
          class="q-mb-sm"
          :maxlength="30"
          counter
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresa el apellido']"
        />
        <q-input
          v-model="form.email"
          label="Email"
          type="email"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[
            (v: string) => (!!v && v.trim().length > 0) || 'Ingresa el email',
            (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || 'Ingresa un email valido',
          ]"
        />
        <!-- La fecha se guarda como texto ISO (yyyy-MM-dd), que es lo que espera la API -->
        <q-input
          v-model="form.fechaNacimiento"
          label="Fecha de nacimiento"
          outlined
          mask="####-##-##"
          hint="aaaa-mm-dd"
          lazy-rules
          :rules="[(v: string) => (!!v && v.length === 10) || 'Ingresa la fecha']"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.fechaNacimiento" mask="YYYY-MM-DD" minimal />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="$emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="autorStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useAutorStore } from 'stores/autor';
import type { AutorRequestDto } from 'src/models/Autor/AutorRequestDto';
import { notificarError } from 'src/utils/notificar';

// editId null = alta; con numero = modificacion
const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const autorStore = useAutorStore();
const formRef = ref<QForm | null>(null);

// El formulario completa el mismo DTO que viaja a la API
const form = ref<AutorRequestDto>({
  nombre: '',
  apellido: '',
  email: '',
  fechaNacimiento: '',
});

// Si es modificacion, se traen los datos actuales del autor
onMounted(async () => {
  if (props.editId) {
    const autor = await autorStore.fetchById(props.editId);
    if (autor) {
      form.value = {
        nombre: autor.nombre,
        apellido: autor.apellido,
        email: autor.email,
        fechaNacimiento: autor.fechaNacimiento,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.editId) {
      await autorStore.update(props.editId, form.value);
    } else {
      await autorStore.create(form.value);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el autor');
  }
}
</script>
