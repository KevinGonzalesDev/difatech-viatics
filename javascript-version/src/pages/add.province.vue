<script setup>
const props = defineProps({
  province: {
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
import { ref, onMounted, computed, watch } from 'vue'

const departmentList = ref([])

const proviceForm = ref({
  departmentId: '',
  name: '',
  id: null,
})

const loadDepartmentList = async () => {
  // lógica para cargar la lista de departamentos
  try {
    const { data } = await api.get('/locations/departments')

    departmentList.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar los departamentos')
  }
}

const addProvince = async () => {
  // lógica para agregar provincia
  try {
    const payload = { ...proviceForm.value }

    if (isEdit.value) {
      // Editar provincia
      await api.put(`/locations/provinces/`, payload)
      alert('Provincia actualizada')
    } else {
      // Crear provincia
      await api.post('/locations/provinces', payload)
      alert('Provincia creada')
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('No se pudo guardar la provincia')
  }
}



const isEdit = computed(() => props.mode === 'edit')

watch(
  () => props.province,
  province => {
    if (!province) return

    proviceForm.value = {
      departmentId: province.department_id,
      name: province.name,
      id: province.id,
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadDepartmentList()
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>{{ isEdit ? 'Editar Provincia' : 'Agregar Provincia' }}</VCardTitle>
      <VDivider />
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VAutocomplete v-model="proviceForm.departmentId" label="Departamentos"
              placeholder="Seleccione departamento" :items="departmentList" item-title="name" item-value="id"
              clearable />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="proviceForm.name" label="Nombre de la provincia"
              placeholder="Ingrese el nombre de la provincia" />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="secondary" text @click="emit('close')">Cancelar</VBtn>
        <VBtn color="primary" @click="addProvince">
          {{ isEdit ? 'Actualizar' : 'Guardar' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
