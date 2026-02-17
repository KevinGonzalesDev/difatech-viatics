<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import ButtonComponent from '@/components/buttonComponent.vue'
import BaseDatatable from '@/components/BaseDatatable.vue'
import { headersDeclarationsUser } from '@/imports/headerstable'
import ViewDeclare from './view.declare.vue'

const userDeclarationsList = ref([])
const user = JSON.parse(localStorage.getItem('user')) || {}

// variables de estado para visualizacion de detallado de viatico
const showDetailForm = ref(false)
const selectedDeclarationId = ref(null)

// fuincion para abrir el detallado de viatico
const viewUserDeclarationFunc = (declaration) => {
  selectedDeclarationId.value = declaration.viatic_id
  showDetailForm.value = true
}

const closeForm = () => {
  showDetailForm.value = false
}


const loadUserDeclarations = async () => {
  try {
    const response = await api.get(`/decviatics/${user.id}`)

    userDeclarationsList.value = response.data.data
  } catch (error) {
    console.error('Error loading user declarations:', error)
  }
}

const generatePDF = (id) => {
  window.open(`${import.meta.env.VITE_API_URL}/decviatics/pdf/${id}`, '_blank')
}

const generateLiquidationPDF = (id) => {
  window.open(`${import.meta.env.VITE_API_URL}/decviatics/pdf/liquidation/${id}`, '_blank')
}

const generateMobilityPDF = (id) => {
  window.open(`${import.meta.env.VITE_API_URL}/decviatics/pdf/movility/${id}`, '_blank')
}

onMounted(() => {
  loadUserDeclarations()
})
</script>

<template>
  <div>
    <template v-if="!showDetailForm">
      <VRow dense>
        <VCol cols="12" md="6">
          <h2>Declaraciones de Usuario</h2>
          <p>Aquí se mostrarán las declaraciones realizadas por los usuarios.</p>
        </VCol>
        <VCol cols="12">
          <BaseDatatable :headers="headersDeclarationsUser" :items="userDeclarationsList">
            <template #item.project="{ item }">
              {{ item.proyect_name }}
              {{ item.project_code }}
            </template>

            <template #item.client="{ item }">
              <VChip outlined size="small" label>
                {{ item.client_name }}
              </VChip>
              {{ item.location_name }}
            </template>

            <template #item.balance="{ item }">
              <VChip size="small" label class="mb-1">
                Presupuesto: {{ item.budget_total }}
              </VChip>
              <br>
              <VChip size="small" label color="success">
                Saldo: {{ item.deposit_amount }}
              </VChip>
            </template>

            <template #item.actions="{ item }">
              <ButtonComponent icon="ri-hand-coin-line" tooltip="Declarar gasto"
                @click="viewUserDeclarationFunc(item)" />

              <VMenu>
                <template v-slot:activator="{ props }">
                  <ButtonComponent icon="ri-list-unordered" tooltip="Lista de PDFs" variant="text" v-bind="props" />
                </template>

                <VList>
                  <template v-slot:prepend>
                    <v-icon class="mr-n2" size="small"></v-icon>
                  </template>
                  <VListItem>
                    <VListItemTitle>
                      <VBtn @click="generatePDF(item.viatic_id)" prepend-icon="ri-file-pdf-2-line" variant="plain">
                        Resumen PDF
                      </VBtn>
                    </VListItemTitle>
                    <VListItemTitle>
                      <VBtn @click="generateLiquidationPDF(item.viatic_id)" prepend-icon="ri-file-pdf-2-line"
                        variant="plain">
                        Liquidación PDF
                      </VBtn>
                    </VListItemTitle>
                    <VListItemTitle>
                      <VBtn @click="generateMobilityPDF(item.viatic_id)" prepend-icon="ri-file-pdf-2-line"
                        variant="plain">
                        Movilidad PDF
                      </VBtn>
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </template>
          </BaseDatatable>
        </VCol>
      </VRow>
    </template>
    <template v-else>
      <ViewDeclare :viatic="selectedDeclarationId" @close="closeForm" />
    </template>
  </div>
</template>
