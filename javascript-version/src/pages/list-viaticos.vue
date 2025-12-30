<script setup>
import AddUser from './add-user.vue'
import { ref, onMounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'

const confirm = useConfirm()

const items = ref([])
const selectedEmployee = ref(null)
const newUser = ref(false)

const headersEmployees = [
  { title: '', key: 'avatar', sortable: false },
  { title: 'Fecha', key: 'dni' },
  { title: 'Cliente', key: 'full_name' },
  { title: 'planta', key: 'area' },
  { title: 'tipo', key: 'position' },
  { title: 'inicio', key: 'email' },
  { title: 'fin', key: 'actions', sortable: false },
  { title: 'estado', key: 'actions', sortable: false },
]

// 👉 donde se guarda la lista


const listEmployees = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/employee')
    const json = await res.json()

    console.log('Backend:', json)

    // adaptamos data del backend a la tabla
    items.value = json.data.map(emp => ({
      avatar: emp.avatar_img
        ? `http://localhost:3000${emp.avatar_img}`
        : null,
      id: emp.id,
      dni: emp.dni,
      full_name: `${emp.first_name} ${emp.last_name}`,
      area: emp.area,
      position: emp.position,
      email: emp.email,
    }))
  } catch (err) {
    console.error(err)
  }
}

const getemployeeById = async id => {
  try {
    const res = await fetch(`http://localhost:3000/api/employee/${id}`)
    const json = await res.json()

    console.log('Empleado:', json)

    selectedEmployee.value = json.data
    console.log('selectedEmployee', selectedEmployee.value)
    newUser.value = true

    return json.data
  } catch (err) {
    console.error(err)

    return null
  }
}

const deleteEmployeeApi = async id => {
  const res = await fetch(`http://localhost:3000/api/employee/${id}`, {
    method: 'DELETE',
  })

  // ❌ si no es ok, lee texto (HTML, error, lo que sea)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text)
  }

  // ✅ Si hay contenido, recién parsea
  if (res.status !== 204) {
    const json = await res.json()
    if (json?.ok === false) {
      throw new Error(json.error)
    }

    return json

  }

  return true
}

const deleteEmployee = async employee => {

  const ok = await confirm({
    title: 'Eliminar empleado',
    message: `¿Eliminar a ${employee.full_name}? Esta acción no se puede deshacer`,
  })

  if (!ok) return

  try {
    await deleteEmployeeApi(employee.id)

    console.log('Empleado eliminado 🚀')
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
          <h1 class="text-h4 font-weight-bold mb-0">Mis viaticos</h1>
        </VCol>
        <VCol cols="12">
          <VDataTable :headers="headersEmployees" :items="items" item-key="id" class="elevation-1">
            <template #item.avatar="{ item }">
              <VAvatar size="36">
                <VImg v-if="item.avatar" :src="item.avatar" cover />
                <VIcon v-else icon="ri-user-line" />
              </VAvatar>
            </template>
            <template #item.actions="{ item }">
              <VBtn icon @click="getemployeeById(item.id)" class="mr-2">
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
