<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import ButtonComponent from '@/components/buttonComponent.vue'
import { headersBudgetViatics } from '@/imports/headerstable'
import AddBudget from './add.budget.vue'
import ListDeposits from './list.deposits.vue'

const approvedViaticList = ref([])
const search = ref('')

// estados de budgetmodal
const showBudgetModal = ref(false)
const selectedBudgetViatic = ref(null)
const modeBudgetModal = ref('create') // 'create' o 'edit'

// estados de depositmodal
const showDepositModal = ref(false)
const selectedDepositViatic = ref(null)
const modeDepositModal = ref('create') // 'create' o 'edit'
const showListDepositsModal = ref(false)





const addBudgetFunc = (item) => {
  showBudgetModal.value = true
  modeBudgetModal.value = 'create'
  selectedBudgetViatic.value = item
}

const editBudgetFunc = (item) => {
  showBudgetModal.value = true
  modeBudgetModal.value = 'edit'
  selectedBudgetViatic.value = item
}

const showListDepositsModalFunc = (item) => {
  showListDepositsModal.value = true
  selectedDepositViatic.value = item
}

const getBudgetStatus = (item) => {
  const deposited = Number(item.deposit_amount || 0)
  const budget = Number(item.budget_total || 0)

  if (item.status !== 'APROB_TESO') return null

  if (deposited === 0) {
    return { text: 'PRESUPUESTADO', color: 'info' }
  }

  if (deposited < budget) {
    return { text: 'ABONADO', color: 'error' }
  }

  return { text: 'ABONADO', color: 'success' }
}



const ListApprovedViatics = async () => {
  try {
    const { data } = await api.get('/budget')

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
        <VTextField v-model="search" label="Buscar distrito o concepto" prepend-inner-icon="ri-search-line"
          density="compact" clearable class="mb-4" />
      </VCol>
      <VCol cols="12">
        <!-- {{ approvedViaticList }} -->
        <VDataTable :headers="headersBudgetViatics" :items="approvedViaticList" class="elevation-1" :search="search">
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

            <VChip v-else-if="item.status === 'APROB_TESO'" :color="getBudgetStatus(item).color" label>
              {{ getBudgetStatus(item).text }}
            </VChip>
          </template>

          <template #item.budget_total="{ item }">
            <span v-if="item.budget_total">{{ item.budget_total }}</span>
            <VChip label v-else>No asignado</VChip>
          </template>

          <template #item.actions="{ item }">
            <ButtonComponent v-if="!item.budget_total" icon="ri-wallet-line" tooltip="Agregar Presupuesto"
              color="primary" @click="addBudgetFunc(item)" />

            <ButtonComponent v-if="item.budget_total" icon="ri-edit-2-line" tooltip="Editar Presupuesto" color="warning"
              @click="editBudgetFunc(item)" />

            <ButtonComponent v-if="item.status === 'APROB_TESO'" icon="ri-money-dollar-circle-line"
              tooltip="Ver depositos" color="success" @click="showListDepositsModalFunc(item)" />
          </template>
        </VDataTable>
      </VCol>
    </VRow>

    <VDialog v-model="showBudgetModal" max-width="1000px">
      <AddBudget :viatic="selectedBudgetViatic" @saved="ListApprovedViatics" @close="showBudgetModal = false"
        :mode="modeBudgetModal" />
    </VDialog>

    <VDialog v-model="showListDepositsModal" max-width="1000px">
      <ListDeposits :viatic="selectedDepositViatic" @close="showListDepositsModal = false" />
    </VDialog>
  </div>
</template>
