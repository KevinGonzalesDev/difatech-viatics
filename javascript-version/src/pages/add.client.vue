<script setup>
import api from '@/services/api'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  client: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits(['saved', 'close'])
const isEdit = computed(() => props.mode === 'edit')




const clientForm = ref({
  name: '',
})


const addClientfunc = async () => {
  // lógica para agregar provincia
  try {
    const payload = { ...clientForm.value }

    if (isEdit.value) {
      // Editar provincia
      await api.put(`/proyects/clients/`, payload)
      alert('Cliente actualizado')
    } else {
      // Crear provincia
      await api.post('/proyects/clients/', payload)
      alert('Cliente creado')
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('No se pudo guardar el cliente')
  }
}

onMounted(() => {
  if (isEdit.value) {
    clientForm.value = {
      name: props.client.name,
      id: props.client.id,
    }
  }
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        {{ isEdit ? 'Editar Cliente' : 'Agregar Cliente' }}
      </VCardTitle>
      <VCardText>
        <VRow>
          {{ client }}
          <VCol cols="12">
            <p>Ingresa el nombre del nuevo cliente que deseas agregar.</p>
          </VCol>
          <VCol cols="12">
            <VTextField v-model="clientForm.name" label="Nombre del Cliente" required />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="secondary" text @click="emit('close')">Cancelar</VBtn>
        <VBtn color="primary" @click="addClientfunc">
          {{ isEdit ? 'Actualizar' : 'Guardar' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
