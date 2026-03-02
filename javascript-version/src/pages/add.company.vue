<script setup>
const props = defineProps({
  company: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits(['saved', 'close'])
import { ref, computed, inject, onMounted } from 'vue'
import api from '@/services/api'
import { required, requiredObject, email } from '@/imports/rulesImport.js'

const user = JSON.parse(localStorage.getItem('user'))

const CompanyForm = ref({
  name: '',
  shortName: '',
  ruc: '',
  address: '',
  phone: '',
  email: '',
  createdBy: user ? user.id : null,
  updatedBy: user ? user.id : null,
  status: true,
  companyId: null,
})

const snackbar = inject('snackbar')

const addCompanyFunc = async () => {
  // lógica para agregar empresa
  try {
    const payload = { ...CompanyForm.value }

    if (isEdit.value) {
      // Editar empresa
      await api.put(`/companies/`, payload)
      snackbar.value = { show: true, message: 'Empresa actualizada exitosamente', color: 'success' }
    } else {
      // Crear empresa
      await api.post('/companies/', payload)
      snackbar.value = { show: true, message: 'Empresa creada exitosamente', color: 'success' }
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, message: 'No se pudo guardar la empresa', color: 'error' }
  }
}


const isEdit = computed(() => props.mode === 'edit')

onMounted(() => {
  if (isEdit.value) {
    // cargar datos existentes si es modo edición
    CompanyForm.value.name = props.company.name || null
    CompanyForm.value.shortName = props.company.short_name || null
    CompanyForm.value.ruc = props.company.ruc || null
    CompanyForm.value.address = props.company.address || null
    CompanyForm.value.phone = props.company.phone || null
    CompanyForm.value.email = props.company.email || null
    CompanyForm.value.status = props.company.status || true
    CompanyForm.value.companyId = props.company.id || null
  }
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        {{ isEdit ? 'Editar empresa' : 'Agregar empresa' }}
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VTextField v-model="CompanyForm.name" :rules="[required]" label="Nombre de la empresa" />
          </VCol>

          <VCol cols="12">
            <VTextField v-model="CompanyForm.shortName" :rules="[required]" label="Nombre corto de la empresa" />
          </VCol>

          <VCol cols="12">
            <VTextField v-model="CompanyForm.ruc" :rules="[required]" label="RUC de la empresa" />
          </VCol>

          <VCol cols="12">
            <VTextField v-model="CompanyForm.address" :rules="[required]" label="Dirección de la empresa" />
          </VCol>

          <VCol cols="12">
            <VTextField v-model="CompanyForm.phone" :rules="[required]" label="Teléfono de la empresa" />
          </VCol>

          <VCol cols="12">
            <VTextField v-model="CompanyForm.email" :rules="[required, email]" label="Correo de la empresa" />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="$emit('close')">Cancelar</VBtn>

        <VBtn color="primary" @click="addCompanyFunc">
          {{ isEdit ? 'Guardar cambios' : 'Crear empresa' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
