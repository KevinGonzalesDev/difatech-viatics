<script setup>
const props = defineProps({
  proyect: {
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

import api from '@/services/api'
import { ref, onMounted } from 'vue'

const clients = ref([])
const ubications = ref([])

const proyectForm = ref({
  clientId: null,
  locationId: null,
  costCenter: '',
  proyectName: '',
})

const loadClients = async () => {
  try {
    const { data } = await api.get('/proyects/clients')

    clients.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar los clientes')
  }
}

const loadUbicationsWid = async () => {
  try {
    const { data } = await api.get('/proyects/ubications/' + proyectForm.value.clientId)

    ubications.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar las ubicaciones')
  }
}

const addProyectFunc = async () => {
  // lógica para agregar provincia
  try {
    const payload = { ...proyectForm.value }

    if (isEdit.value) {
      // Editar provincia
      await api.put(`/proyects/`, payload)
      alert('Proyecto actualizado')
    } else {
      // Crear provincia
      await api.post('/proyects/', payload)
      alert('Proyecto creado')
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('No se pudo guardar el proyecto')
  }
}

const onClientChange = () => {
  if (isEdit.value) {
    proyectForm.value.locationId = null
  }
}

onMounted(async () => {
  await loadClients()

  if (isEdit.value) {
    proyectForm.value = {
      clientId: props.proyect.client_id,
      locationId: props.proyect.location_id,
      costCenter: props.proyect.cost_center_code,
      proyectName: props.proyect.project_name,
      id: props.proyect.id,
    }
  }
})

watch(
  () => proyectForm.value.clientId,
  async newClientId => {
    if (!newClientId) return

    // 👇 SOLO limpiar si NO es edición
    if (!isEdit.value) {
      proyectForm.value.locationId = null
    }

    await loadUbicationsWid()
  },
)
</script>

<template>
  <div>
    <VCard width="800">
      <VCardTitle>
        <span class="text-h5">{{ isEdit ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</span>
      </VCardTitle>

      <VCardText>
        <VForm>
          <VRow>
            <VCol cols="12" md="6">
              <VAutocomplete v-model="proyectForm.clientId" label="Cliente" :items="clients" item-title="name"
                item-value="id" @update:model-value="onClientChange">
              </VAutocomplete>
            </VCol>
            <VCol cols="12" md="6">
              <VAutocomplete v-model="proyectForm.locationId" label="Ubicacion(Sede)" :items="ubications"
                item-title="location_name" item-value="id">
                <template v-slot:item="{ props, item }">
                  <VListItem v-bind="props" :subtitle="item.raw.district_name" :title="item.raw.location_name" />
                </template>
              </VAutocomplete>
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="proyectForm.costCenter" label="Centro de costo" item-title="code" item-value="id" />
            </VCol>
            <VCol cols="12" md="6">
              <VTextField v-model="proyectForm.proyectName" label="Nombre del Proyecto" required />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="secondary" text @click="emit('close')">Cancelar</VBtn>
        <VBtn color="primary" @click="addProyectFunc">
          {{ isEdit ? 'Actualizar' : 'Guardar' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
