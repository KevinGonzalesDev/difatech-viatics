<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import api from '@/services/api'

const confirm = useConfirm()



const addCostconfig = ref(false)
const selectedEmployee = ref(null)
const selectedRoles = ref([])
const listallRoles = ref([])

const dataCost = ref({
  id: null,
  district_id: '',
  concept_id: '',
  amount: '',
  valid_from: '',
  valid_to: '',
  active: '',
})

const headersCosts = [
  { title: 'distrito', key: 'district' },
  { title: 'concepto', key: 'concept' },
  { title: 'monto', key: 'amount' },
  { title: 'estado', key: 'active' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

// 👉 donde se guarda la lista


const Listcosts = ref([])

const Loadcosts = async () => {
  try {
    const { data } = await api.get('/roles')

    Listcosts.value = data.data
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

    Listcosts.value = false
    Loadcosts() // refrescar tabla
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
  Loadcosts()
})
</script>

<template>
  <div>
    <template v-if="addCostconfig">
      <VRow class="mb-4">
        <VCol cols="12" md="8" class="d-flex justify-start">
          Anadir nuevo costo
        </VCol>
        <VCol cols="12" md="4" class="d-flex justify-end">
          <VBtn color="primary" @click="addCostconfig = false">
            Cancelar
          </VBtn>
        </VCol>
        <VCol cols="12">
          <VCard>
            <VCardTitle>
              <span class="text-h5">Agregar nuevo costo</span>
            </VCardTitle>

            <VCardText>
              <VForm>
                <!-- Form fields for adding cost would go here -->
              </VForm>
            </VCardText>

            <VCardActions class="justify-end">
              <VBtn variant="text" @click="addCostconfig = false">
                Cancelar
              </VBtn>

              <VBtn color="primary" @click="saveCost">
                Guardar costo
              </VBtn>
            </VCardActions>
          </VCard>
        </VCol>
      </VRow>
    </template>
    <template v-else>
      <VRow>
        <VCol cols="12" class="d-flex justify-end mb-4">
          <VBtn color="primary" @click="addCostconfig = true">
            Nuevo costo
          </VBtn>
        </VCol>
        <VCol cols="12">
          <h1 class="text-h4 font-weight-bold mb-0">
            Lista de precios
          </h1>
        </VCol>
        <VCol cols="12">
          <VDataTable :headers="headersCosts" :items="employees" item-key="id" class="elevation-1">
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
    </template>
  </div>
</template>
