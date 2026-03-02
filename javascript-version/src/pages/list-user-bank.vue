<script setup>
const props = defineProps({
  employee: {
    type: Object,
    default: null,
  },
})

import { ref, onMounted, watch } from 'vue';
import BaseDatatable from '@/components/BaseDatatable.vue';
import ButtonComponent from '@/components/buttonComponent.vue'
import { useConfirm } from '@/composables/useConfirm'
import AddUserBank from './add.user-bank.vue';
import { headersUsersAccounts } from '@/imports/headerstable.js';
import api from '@/services/api';

const employeeBankAccounts = ref([])
const confirm = useConfirm()

// ESTADOS DE MODAL DE FORMULARIO DE CUENTAS
const showAddBankAccountModal = ref(false)
const selectedBankAccount = ref(null)
const modeBankAccount = ref('create')

const addBankAccountFunc = () => {
  modeBankAccount.value = 'create'
  selectedBankAccount.value = null
  showAddBankAccountModal.value = true
}

const editBankAccountFunc = (account) => {
  modeBankAccount.value = 'edit'
  selectedBankAccount.value = account
  showAddBankAccountModal.value = true
}

const deleteBankAccountFunc = async (id) => {
  // lógica para eliminar cuenta bancaria
  const confirmed = await confirm('¿Estás seguro de que deseas eliminar esta cuenta bancaria? Esta acción no se puede deshacer.')

  if (!confirmed) return

  try {
    await api.delete(`/bank/${id}`)

    alert('Cuenta bancaria eliminada con éxito')
    await loadBankAccounts()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar la cuenta bancaria')
  }
}



const desactivateBankAccountFunc = async (id, active) => {
  try {
    await api.put(`/bank/desactivate/${id}`, { active: !active })

    alert(`Cuenta bancaria ${!active ? 'activada' : 'desactivada'} con exito`)
    await loadBankAccounts()
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el estado de la cuenta bancaria')
  }
}

const loadBankAccounts = async () => {
  try {
    const { data } = await api.get(`/bank/Empleado/${props.employee.id}`)

    employeeBankAccounts.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar las cuentas bancarias')
  }
}

onMounted(() => {
  if (props.employee) {
    loadBankAccounts()
  }
})
</script>

<template>
  <div>
    <VRow dense>
      <VCol cols="12" class="d-flex justify-end">
        <VBtn @click="addBankAccountFunc">
          Agregar cuenta
        </VBtn>
      </VCol>
      <VCol cols="12">
        <BaseDatatable :items="employeeBankAccounts" :headers="headersUsersAccounts" title="Cuentas del usuario">
          <template #item.actions="{ item }">
            <ButtonComponent tooltip="Editar cuenta" icon="ri-pencil-line" @click="editBankAccountFunc(item)" />
            <ButtonComponent tooltip="Eliminar cuenta" icon="ri-delete-bin-line"
              @click="deleteBankAccountFunc(item.id)" />

            <ButtonComponent :icon="item.status ? 'ri-toggle-fill' : 'ri-toggle-line'"
              :tooltip="item.status ? 'Desactivar cuenta' : 'Activar cuenta'"
              @click="desactivateBankAccountFunc(item.id, item.status)" />

          </template>
        </BaseDatatable>
      </VCol>
    </VRow>

    <VDialog v-model="showAddBankAccountModal" max-width="600">
      <AddUserBank :employee="employee" :account="selectedBankAccount" :mode="modeBankAccount"
        @close="showAddBankAccountModal = false" @saved="loadBankAccounts" />
    </VDialog>
  </div>
</template>
