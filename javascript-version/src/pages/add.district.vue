<script setup>
import api from '@/services/api'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  district: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits(['saved', 'close'])
const provinceList = ref([])

const districtForm = ref({
  provinceId: '',
  name: '',
  id: null,
})

const loadProvinceList = async () => {
  // lógica para cargar la lista de provincias
  try {
    const { data } = await api.get('/locations/provinces')

    provinceList.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar las provincias')
  }
}

const addDistrict = async () => {
  // lógica para agregar provincia
  try {
    const payload = { ...districtForm.value }

    if (isEdit.value) {
      // Editar provincia
      await api.put(`/locations/districts/`, payload)
      alert('Provincia actualizada')
    } else {
      // Crear provincia
      await api.post('/locations/districts', payload)
      alert('Provincia creada')
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('No se pudo guardar el distrito')
  }
}

const isEdit = computed(() => props.mode === 'edit')

onMounted(() => {
  loadProvinceList()

  if (isEdit.value) {
    districtForm.value = {
      provinceId: props.district.province_id,
      name: props.district.name,
      id: props.district.id,
    }
  }
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        {{ isEdit ? 'Editar Distrito' : 'Agregar Distrito' }}
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VAutocomplete v-model="districtForm.provinceId" :items="provinceList" item-title="name" item-value="id"
              label="Provincia" dense outlined required />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="districtForm.name" label="Nombre del Distrito" dense outlined required />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="secondary" text @click="emit('close')">Cancelar</VBtn>
        <VBtn color="primary" @click="addDistrict">
          {{ isEdit ? 'Actualizar' : 'Guardar' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
