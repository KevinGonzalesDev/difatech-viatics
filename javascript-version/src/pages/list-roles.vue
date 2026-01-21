<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import { headersRoles } from '@/imports/headerstable'
import buttonComponent from '@/components/buttonComponent.vue'
import api from '@/services/api'
import ButtonComponent from '@/components/buttonComponent.vue'

const confirm = useConfirm()



const rolUser = ref(false)
const selectedEmployee = ref(null)
const selectedRoles = ref([])
const listallRoles = ref([])
const employees = ref([])



// 👉 donde se guarda la lista




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
            <ButtonComponent tooltip="Editar rol" icon="ri-pencil-line" @click="editrolUser(item)" />
          </template>

          <template #item.active="{ item }">
            <VChip color="primary">
              {{ item.active ? 'Activo' : 'Inactivo' }}
            </VChip>
          </template>
        </VDataTable>
      </VCol>
    </VRow>

    <VDialog v-model="rolUser" max-width="600px">
      <VCard>
        <VCardTitle>
          <span class="text-h5">Editar roles del usuario</span>
        </VCardTitle>
        <VCardSubtitle>
          {{ selectedEmployee.first_name }} {{ selectedEmployee.last_name }}
        </VCardSubtitle>

        <VCardText>
          <VRow dense>
            <VCol cols="12">
              <VChip v-if="!selectedEmployee.roles.length" color="grey">
                Sin roles asignados
              </VChip>
            </VCol>
            <VCol cols="12">
              <VSelect v-model="selectedRoles" :items="listallRoles" item-title="description" item-value="id" multiple
                chips />
            </VCol>
          </VRow>
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
  </div>
</template>
