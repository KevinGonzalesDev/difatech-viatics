<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import IconButton from '@/components/buttonComponent.vue'
import { headersBudgetViatics } from '@/imports/headerstable'
import AddBudget from './add.budget.vue'

const approvedViaticList = ref([])

// estados de budgetmodal
const showBudgetModal = ref(false)
const selectedBudgetViatic = ref(null)
const modeBudgetModal = ref('create') // 'create' o 'edit'

const addBudgetFunc = (item) => {
  showBudgetModal.value = true
  modeBudgetModal.value = 'create'
  selectedBudgetViatic.value = item
}

const ListApprovedViatics = async () => {
  try {
    const { data } = await api.get('/budget/listApprovedViatics')

    approvedViaticList.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los viáticos aprobados')
  }
}


onMounted(() => {
  ListApprovedViatics()
})
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <h1>Viáticos Aprobados</h1>
        <p>Aquí se mostrarán los viáticos que han sido aprobados.</p>
      </VCol>
      <VCol cols="12">
        <VDataTable :headers="headersBudgetViatics" :items="approvedViaticList" class="elevation-1">
          <template #item.employee_name="{ item }">
            {{ item.name }} {{ item.lastname }}
          </template>

          <template #item.status="{ item }">
            <VChip v-if="item.status === 'SOLICITED'" color="primary" label dark>
              SOLICITADO
            </VChip>
            <VChip v-if="item.status === 'APROB_ADMIN'" color="success" label="" dark>
              APROBADO
            </VChip>
            <VChip v-if="item.status === 'REFUSED'" color="error" label="" dark>
              RECHAZADO
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <IconButton icon="ri-wallet-line" tooltip="Agregar Presupuesto" color="primary"
              @click="addBudgetFunc(item)" />
          </template>
        </VDataTable>
      </VCol>
    </VRow>

    <VDialog v-model="showBudgetModal" max-width="800px">
      <AddBudget :viatic="selectedBudgetViatic" :mode="modeBudgetModal" />
    </VDialog>
  </div>
</template>
