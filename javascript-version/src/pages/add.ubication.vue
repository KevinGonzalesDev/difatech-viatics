<script setup>
const props = defineProps({
  ubication: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits(['saved', 'close'])


import api from '@/services/api'
import { ref, computed, onMounted } from 'vue'

const isEdit = computed(() => props.mode === 'edit')
const clientList = ref([])
const districtList = ref([])

const ubicationForm = ref({
  clientId: null,
  name: '',
  address: '',
  districtId: null,
})

const loadClients = async () => {
  try {
    const { data } = await api.get('/proyects/clients')

    clientList.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar los clientes')
  }
}

const loadDistricts = async () => {
  try {
    const { data } = await api.get('/locations/districts')

    districtList.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar las ciudades')
  }
}

const addUbicationfunc = async () => {
  // lógica para agregar ubicacion
  try {
    const payload = { ...ubicationForm.value }

    if (isEdit.value) {
      // Editar ubicacion
      await api.put(`/proyects/ubications/`, payload)
      alert('Ubicacion actualizada')
    } else {
      // Crear ubicacion
      await api.post('/proyects/ubications', payload)
      alert('Ubicacion creada')
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('No se pudo guardar la ubicacion')
  }
}

onMounted(() => {
  loadClients()
  loadDistricts()

  if (isEdit.value) {
    ubicationForm.value = {
      clientId: props.ubication.client_id,
      name: props.ubication.location_name,
      address: props.ubication.address,
      districtId: props.ubication.district_id,
      id: props.ubication.id,
    }
  }

})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        <span class="text-h5"> {{ isEdit ? 'Editar Ubicación' : 'Agregar Nueva Ubicación' }}</span>
      </VCardTitle>
      <VCardText>
        <VRow>
          <!-- {{ ubication }} -->
          <VCol cols="12">
            <VAutocomplete v-model="ubicationForm.clientId" label="Cliente" :items="clientList" item-title="name"
              item-value="id" required />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="ubicationForm.name" label="Nombre de la sede" required />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="ubicationForm.address" label="Direccion" required />
          </VCol>
          <VCol cols="12">
            <VAutocomplete v-model="ubicationForm.districtId" label="Ciudad" :items="districtList" item-title="name"
              item-value="id" required>
              <template v-slot:item="{ props, item }">
                <VListItem v-bind="props" :subtitle="item.raw.province_name" :title="item.raw.name" />
              </template>
            </VAutocomplete>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" @click="addUbicationfunc">Guardar</VBtn>
        <VBtn text @click="emit('close')">Cancelar</VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
