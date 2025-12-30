<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import api from '@/services/api'

const confirm = useConfirm()



const rolUser = ref(false)
const selectedEmployee = ref(null)
const selectedRoles = ref([])
const listallRoles = ref([])

const headersRoles = [
  { title: 'name', key: 'name' },
  { title: 'correo', key: 'email' },
  { title: 'Rol', key: 'roles' },
  { title: 'estado', key: 'active' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

// 👉 donde se guarda la lista


const employees = ref([])

const loadEmployees = async () => {
  try {
    const { data } = await api.get('/roles')

    employees.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los empleados')
  }
}

const allRoles = async () => {
  try {
    const { data } = await api.get('/roles/list-roles')

    listallRoles.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los roles')
  }
}

const saveRoles = async () => {
  try {
    const { data } = await api.put(`/roles/employees/${selectedEmployee.value.id}/roles`, {
      roles: selectedRoles.value,
    })

    rolUser.value = false
    loadEmployees() // refrescar tabla
  } catch (err) {
    console.error(err)
    alert('Error al guardar roles')
  }
}


const editrolUser = async employee => {
  selectedEmployee.value = employee
  selectedRoles.value = [...employee.role_ids]
  allRoles()
  rolUser.value = true
}


onMounted(() => {
  loadEmployees()
})
</script>

<template>
  <div>
    <VRow>
      <VDialog v-model="rolUser" max-width="600px">
        <template #activator="{ props }">
        </template>

        <VCard>
          <VCardTitle>
            <span class="text-h5">Editar roles del usuario</span>
          </VCardTitle>
          <VCardSubtitle>
            {{ selectedEmployee?.first_name }} {{ selectedEmployee?.last_name }}
          </VCardSubtitle>

          <VCardText>
            <div class="mb-4">
              <VChip v-if="!selectedEmployee.roles.length" color="grey">
                Sin roles asignados
              </VChip>
            </div>

            <VSelect v-model="selectedRoles" :items="listallRoles" item-title="name" item-value="id" multiple chips />
          </VCardText>

          <VCardActions class="justify-end">
            <VBtn variant="text" @click="rolUser = false">
              Cancelar
            </VBtn>

            <VBtn color="primary" @click="saveRoles">
              Guardar roles
            </VBtn>
          </VCardActions>
        </VCard>
      </VDialog>

      <VCol cols="12">
        <h1 class="text-h4 font-weight-bold mb-0">Lista de usuarios y roles</h1>
      </VCol>
      <VCol cols="12">
        <VDataTable :headers="headersRoles" :items="employees" item-key="id" class="elevation-1">
          <template #item.name="{ item }">
            <div class="d-flex align-center">
              <span>{{ item.first_name }} {{ item.last_name }}</span>
            </div>
          </template>

          <template #item.roles="{ item }">
            <VChip v-for="role in item.roles" :key="role" color="primary" class="me-2 mb-2">
              {{ role }}
            </VChip>

            <VChip v-if="!item.roles.length" color="grey">
              Sin roles asignados
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <VBtn icon @click="editrolUser(item)">
              <VIcon icon="ri-pencil-line" />
            </VBtn>
          </template>

          <template #item.active="{ item }">
            <VChip color="primary">
              {{ item.active ? 'Activo' : 'Inactivo' }}
            </VChip>
          </template>
        </VDataTable>
      </VCol>
    </VRow>
  </div>
</template>
