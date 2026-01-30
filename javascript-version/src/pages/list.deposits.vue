<script setup>
const props = defineProps({
  viatic: {
    type: Object,
    default: () => ({}),
  },
})

import { ref, onMounted } from 'vue'
import api from '@/services/api'
import ButtonComponent from '@/components/buttonComponent.vue'
import { headersDepositsList } from '@/imports/headerstable'
import ConfirmDialog from '@/components/modalConfirmation.vue'
import AddDeposit from './add.deposit.vue'
import { useSnackbar } from '@/composables/useSnackbar'


const depositList = ref([])

// estados de modal de depositos
const depositModal = ref(false)
const selectedDeposit = ref(null)
const mode = ref('create')

// estados de confirmacion
const showConfirm = ref(false)
const depositIdToDelete = ref(null)


const addDepositFunc = () => {
  mode.value = 'create'
  selectedDeposit.value = null
  depositModal.value = true
}

const editDepositFunc = (item) => {
  mode.value = 'edit'
  selectedDeposit.value = item
  depositModal.value = true
}

const openDeleteDepositConfirm = (depositId) => {
  depositIdToDelete.value = depositId
  showConfirm.value = true
}

const deleteDepositFunc = async () => {
  try {
    await api.delete('/deposits/' + depositIdToDelete.value)
    alert('Depósito eliminado correctamente')
    ListDeposits()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar el depósito')
  }
}

const ListDeposits = async () => {
  try {
    const { data } = await api.get(`/deposits/find/${props.viatic.id}`)

    depositList.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los depósitos')
  }
}

onMounted(() => {
  ListDeposits()
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        Lista de Depósitos
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12" class="d-flex justify-end">
            <VBtn color="primary" @click="addDepositFunc">
              Agregar deposito
            </VBtn>
          </VCol>
          <VCol cols="12">
            <VDataTable :items="depositList" :headers="headersDepositsList" class="elevation-1">
              <template #item.voucher="{ item }">
                {{ item.nro_voucher }}
                <VChip label>
                  {{ item.entity_financy }}
                </VChip>
              </template>

              <template #item.date_deposit="{ item }">
                {{ new Date(item.date_deposit).toLocaleDateString() }}
              </template>

              <template #item.actions="{ item }">
                <ButtonComponent icon="ri-edit-line" tooltip="Editar deposito" @click="editDepositFunc(item)" />

                <ButtonComponent icon="ri-delete-bin-6-line" tooltip="Eliminar deposito" color="error"
                  @click="openDeleteDepositConfirm(item.id)" />
              </template>
            </VDataTable>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- modal de confirmacion de eliminacion -->
    <ConfirmDialog v-model="showConfirm" title="Eliminar depósito"
      message="Esta acción no se puede deshacer. ¿Deseas continuar?" confirm-text="Sí, eliminar" cancel-text="No"
      @confirm="deleteDepositFunc" />

    <!-- modal de agregar/editar deposito -->
    <VDialog v-model="depositModal" max-width="600">
      <AddDeposit :mode="mode" :deposit="selectedDeposit" :viatic="viatic.id" @close="depositModal = false"
        @saved="ListDeposits" />
    </VDialog>
  </div>
</template>
