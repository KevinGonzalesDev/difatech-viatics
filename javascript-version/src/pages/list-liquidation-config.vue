<script setup>
import { ref, onMounted } from 'vue'
import ButtonComponent from '@/components/buttonComponent.vue';
import api from '@/services/api'
import AddConfig from './add.config.vue';
import { headersLiquidationConfig, groupConfigurations } from '@/imports/headerstable.js';

const listConfigurations = ref([])

const showConfigModal = ref(false)
const selectedConfig = ref(null)
const modeConfigModal = ref('create')

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
      <VCol cols="12">
        <VCard variant="outlined">
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
    </VRow>
    <VDialog v-model="showConfigModal" max-width="500px">
      <AddConfig :config="selectedConfig" :mode="modeConfigModal" @close="showConfigModal = false"
        @saved="loadLiquidityConfigs" />
    </VDialog>
  </div>
</template>
