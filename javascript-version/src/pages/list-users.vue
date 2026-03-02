<script setup>
import AddUser from './add-user.vue'
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useConfirm } from '@/composables/useConfirm'
import { useSnackbar } from '@/composables/useSnackbar.js'
import { headersEmployees } from '@/imports/headerstable.js'
import BaseDatatable from '@/components/BaseDatatable.vue'
import ButtonComponent from '@/components/buttonComponent.vue'
import AccountSettings from './account-settings.vue'

const confirm = useConfirm()

const search = ref('')
const items = ref([])
const selectedEmployee = ref(null)
const newUser = ref(false)



// 👉 donde se guarda la lista

const listEmployees = async () => {
  try {
    const { data } = await api.get('/employee')

    items.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los empleados')
  }
}


const getemployeeById = async id => {
  try {
    const { data } = await api.get(`/employee/${id}`)

    selectedEmployee.value = data.data
    newUser.value = true
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los empleados')
  }
}

const deleteEmployeeApi = async id => {
  try {
    const res = await api.delete(`/employee/${id}`)

    // axios ya parsea JSON
    // si es 204, res.data será undefined
    return res.data ?? true

  } catch (err) {
    // 🔥 axios siempre cae aquí en 4xx / 5xx
    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Error al eliminar empleado'

    throw new Error(message)
  }
}




const deleteEmployee = async employee => {

  const ok = await confirm({
    title: 'Eliminar empleado',
    message: `¿Eliminar a ${employee.first_name}? Esta acción no se puede deshacer`,
  })

  if (!ok) return

  try {
    await deleteEmployeeApi(employee.id)
    listEmployees() // 🔁 refresca tabla

  } catch (error) {
    console.error(error)
    alert('Error al eliminar')
  }
}


const onSaved = () => {
  newUser.value = false
  selectedEmployee.value = null
  listEmployees()
}

const accessForm = () => {
  selectedEmployee.value = null
  newUser.value = !newUser.value

}

const onCancel = () => {
  newUser.value = false
  selectedEmployee.value = null
}



onMounted(() => {
  listEmployees()
})
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12" class="d-flex justify-end">
        <VBtn :color="newUser ? 'error' : 'primary'" @click="accessForm">
          <VIcon :icon="newUser ? 'ri-close-circle-line' : 'ri-user-add-line'" class="me-2" />
          {{ newUser ? 'Cancelar' : 'Agregar Usuario' }}
        </VBtn>
      </VCol>
    </VRow>

    <template v-if="!newUser">
      <VRow>
        <VCol cols="12">
          <h1 class="text-h4 font-weight-bold mb-0">Lista de Usuarios</h1>
        </VCol>
        <VCol cols="12">
          <BaseDatatable v-model:search="search" :headers="headersEmployees" :items="items">
            <template #item.avatar="{ item }">
              <VAvatar size="36">
                <VImg v-if="item.avatar_img" :src="'http://localhost:3000' + item.avatar_img" cover />
                <VIcon v-else icon="ri-user-line" />
              </VAvatar>
            </template>

            <template #item.full_name="{ item }">
              <div class="d-flex align-center">
                <span>{{ item.first_name }} {{ item.last_name }}</span>
              </div>
            </template>

            <template #item.actions="{ item }">
              <ButtonComponent tooltip="Editar usuario" icon="ri-pencil-line" @click="getemployeeById(item.id)" />
              <ButtonComponent tooltip="Eliminar usuario" icon="ri-delete-bin-6-line" color="error"
                @click="deleteEmployee(item)" />
            </template>
          </BaseDatatable>
        </VCol>
      </VRow>
    </template>
    <template v-else>
      <VFadeTransition mode="out-in">
        <AccountSettings :employee="selectedEmployee" @saved="onSaved" @cancel="onCancel" />
      </VFadeTransition>
    </template>
  </div>
</template>
