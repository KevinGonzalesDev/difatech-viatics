<script setup>
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits(['saved', 'close'])
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useSnackbar } from '@/composables/useSnackbar'

const isEdit = ref(props.mode === 'edit')
const listDocumentTypes = ref(['LIQUIDACION', 'MOVILIDAD', 'DECLARACION_JURADA'])
const ListCategories = ref(['ALIMENTACION', 'ALOJAMIENTO', 'MOVILIDAD', 'COMPRAS'])
const snackbar = useSnackbar()


const FormConfig = ref({
  documentType: 'LIQUIDACION',
  category: 'ALIMENTACION',
  label: '',
})

const addConfigFunc = async () => {
  // lógica para agregar configuracion
  try {
    const payload = { ...FormConfig.value }

    if (isEdit.value) {
      // Editar configuracion
      await api.put(`/decviatics/configurations/liquidation`, payload)

      snackbar.open('configuracion actualizada', 'success')

    } else {
      // Crear concepto
      await api.post('/decviatics/configurations/liquidation', payload)
      snackbar.open('configuracion creada', 'success')
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    snackbar.open('No se pudo guardar la configuracion', 'error')
  }
}

onMounted(() => {
  if (isEdit.value && props.config) {
    FormConfig.value.documentType = props.config.document_type
    FormConfig.value.category = props.config.category
    FormConfig.value.label = props.config.label
  }
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        {{ isEdit ? 'Editar opcion' : 'Agregar opcion' }}
      </VCardTitle>
      <VDivider />
      <VCardText>
        <VRow>
          <!-- {{ config }} -->
          <VCol cols="12">
            <VSelect v-model="FormConfig.documentType" label="Tipo de Documento" :items="listDocumentTypes" />
          </VCol>
          <VCol cols="12">
            <VSelect v-model="FormConfig.category" label="Categoría" :items="ListCategories" />
          </VCol>
          <VCol cols="12">
            <VTextField v-model="FormConfig.label" label="Opción" />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="$emit('close')">Cancelar</VBtn>
        <VBtn color="primary" @click="addConfigFunc">{{ isEdit ? 'Actualizar' : 'Crear' }}</VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
