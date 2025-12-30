<script setup>
import AddUser from './add-user.vue'
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useConfirm } from '@/composables/useConfirm'

const confirm = useConfirm()

const items = ref([])
const selectedEmployee = ref(null)
const newUser = ref(false)

const headersEmployees = [
  { title: '', key: 'avatar', sortable: false },
  { title: 'DNI', key: 'dni' },
  { title: 'Nombres', key: 'full_name' },
  { title: 'Área', key: 'area' },
  { title: 'Puesto', key: 'position' },
  { title: 'Correo', key: 'email' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

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
          <VDataTable :headers="headersEmployees" :items="items" item-key="id" class="elevation-1">
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
              <VBtn class="mr-2" icon @click="getemployeeById(item.id)">
                <VIcon icon="ri-pencil-line" />
              </VBtn>

              <VBtn icon color="error" @click="deleteEmployee(item)">
                <VIcon icon="ri-delete-bin-6-line" />
              </VBtn>
            </template>
          </VDataTable>
        </VCol>
      </VRow>
    </template>
    <template v-else>
      <VFadeTransition mode="out-in">
        <AddUser :employee="selectedEmployee" @saved="onSaved" @cancel="onCancel" />
      </VFadeTransition>
    </template>
  </div>
</template>
