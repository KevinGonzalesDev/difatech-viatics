<script setup>
import { ref, onMounted } from 'vue'
import ButtonComponent from '@/components/buttonComponent.vue';
import api from '@/services/api'
import AddConfig from './add.config.vue';
import { headersLiquidationConfig, groupConfigurations } from '@/imports/headerstable.js';

const listConfigurations = ref([])

// variables de estado para el modal de configuración de opciones de documentación
const showConfigModal = ref(false)
const selectedConfig = ref(null)
const modeConfigModal = ref('create')

// variable de estado para el modal de informacion de la empresa
const showEmpConfigModal = ref(false)
const selectedEmpConfig = ref(null)
const modeEmpConfigModal = ref('view')

const infoCompany = ref({
  name: 'Nombre de la empresa',
  ruc: 'RUC de la empresa',
  status: 'active' // o 'inactive'
})


const loadLiquidityConfigs = async () => {
  try {
    const { data } = await api.get(`/decviatics/configurations/liquidation`)

    listConfigurations.value = data.data

    console.log('Liquidation Configurations:', data)
  } catch (error) {
    console.error('Error fetching liquidation configurations:', error)
  }
}

const createConfig = () => {
  modeConfigModal.value = 'create'
  selectedConfig.value = null
  showConfigModal.value = true
}

const editConfig = (item) => {
  modeConfigModal.value = 'edit'
  selectedConfig.value = item
  showConfigModal.value = true
}

onMounted(() => {
  loadLiquidityConfigs()
})
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="d-flex justify-space-between">
            Configuración de opciones de documentacion
            <VBtn @click="createConfig">
              Agregar opción
            </VBtn>
          </VCardTitle>
          <VCardText>
            <VDataTable :headers="headersLiquidationConfig" :group-by="groupConfigurations" :items="listConfigurations">
              <template #item.actions="{ item }">
                <ButtonComponent icon="ri-edit-line" tooltip="Editar configuración" color="primary"
                  @click="editConfig(item)" />
              </template>
            </VDataTable>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle>
            <span class="text-h6">CONFIGURACIONES DE LA EMPRESA</span>
          </VCardTitle>
          <VCardText>
            <div class="d-flex align-center mb-2">
              <VIcon color="primary" class="me-2">ri-building-fill</VIcon>
              <span>NOMBRE DE LA EMPRESA :</span>

            </div>
            <div class="d-flex align-center mb-2">
              <VIcon color="grey" class="me-2">mdi-circle</VIcon>
              <span>Configuración inactiva</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VDialog v-model="showConfigModal" max-width="500px">
      <AddConfig :config="selectedConfig" :mode="modeConfigModal" @close="showConfigModal = false"
        @saved="loadLiquidityConfigs" />
    </VDialog>
  </div>
</template>
