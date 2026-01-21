<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import api from '@/services/api'
import {
  headersBudgetlist,
  headersdepartmentlist,
  headersprovincelist,
  groupProvince,
  headersdistricts,
  groupDistrict,
} from '@/imports/headerstable'
import buttonComponent from '@/components/buttonComponent.vue'
import ButtonComponent from '@/components/buttonComponent.vue'
import AddProvince from './add.province.vue'
import AddDatacost from './add.datacost.vue'
import AddDistrict from './add.district.vue'

const confirm = useConfirm()



const addCostconfig = ref(false)

const dataCost = ref({
  id: null,
  departmentId: '',
  provinceId: '',
  districtID: '',
  conceptId: '',
  amount: '',
  active: true,
})



// variables de estado del modal de costo
const showCostModal = ref(false)
const selectedCost = ref(null)
const modeCostModal = ref('create') // 'create' o 'edit'


// variables de estado del modal de provincia
const showProvinceModal = ref(false)
const selectedProvince = ref(null)
const modeProvinceModal = ref('create') // 'create' o 'edit'

// variables de estado del modal de distritos
const showDistrictModal = ref(false)
const selectedDistrict = ref(null)
const modeDistrictModal = ref('create') // 'create' o 'edit'





const Listcosts = ref([])
const departments = ref([])
const provinces = ref([])
const districts = ref([])



// funciones de listado de datos
const loadDepartments = async () => {
  try {
    const { data } = await api.get('/locations/departments')

    departments.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar los departamentos')
  }
}

const loadProvinces = async () => {
  try {
    const { data } = await api.get('/locations/provinces')

    provinces.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar las provincias')
  }
}



const loadDistricts = async provinceId => {

  try {
    const { data } = await api.get(`/locations/districts/`)

    districts.value = data.data
  } catch (err) {
    districts.value = []
    console.error('Error cargando distritos:', err)
  }
}







const listViaticrates = async () => {
  try {
    const { data } = await api.get('/rates')

    console.log('data rates', data)
    Listcosts.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los costos')
  }
}




// activadores y desacttivadores de estado
const desactivateDepartment = async (id, active) => {
  try {
    await api.put(`/locations/departments/desactivate/${id}`, { active: !active })

    alert(`Departamento ${!active ? 'activado' : 'desactivado'} con exito`)
    await loadDepartments()
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el estado del departamento')
  }
}

const desactivateProvince = async (id, active) => {
  try {
    await api.put(`/locations/provinces/desactivate/${id}`, { active: !active })

    alert(`Provincia ${!active ? 'activada' : 'desactivada'} con exito`)
    await loadProvinces()
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el estado de la provincia')
  }
}

const desactivateDistrict = async (id, active) => {
  try {
    await api.put(`/locations/districts/desactivate/${id}`, { active: !active })

    alert(`Distrito ${!active ? 'activado' : 'desactivado'} con exito`)
    await loadDistricts()
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el estado del distrito')
  }
}

const desactivateCost = async (id, active) => {
  try {
    await api.put(`/rates/desactivate/${id}`, { active: !active })

    alert(`Costo ${!active ? 'activado' : 'desactivado'} con exito`)
    await listViaticrates()
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el estado del costo')
  }
}


// funciones de estado de modales props
const editProvinceFunc = async (item) => {
  // lógica para editar provincia
  showProvinceModal.value = true
  modeProvinceModal.value = 'edit'
  selectedProvince.value = item
}

const addProvinceFunc = () => {
  showProvinceModal.value = true
  modeProvinceModal.value = 'create'
  selectedProvince.value = null
}

const editDistrictFunc = async (item) => {
  // lógica para editar distrito
  showDistrictModal.value = true
  modeDistrictModal.value = 'edit'
  selectedDistrict.value = item
}

const addDistrictFunc = () => {
  showDistrictModal.value = true
  modeDistrictModal.value = 'create'
  selectedDistrict.value = null
}

const addDatacostFunc = () => {
  showCostModal.value = true
  modeCostModal.value = 'create'
  selectedCost.value = null
}

const editDatacostFunc = async (item) => {
  // lógica para editar costo
  showCostModal.value = true
  modeCostModal.value = 'edit'
  selectedCost.value = item
}

// funciones de eliminacion de tablas
const deleteProvinceFunc = async (id) => {
  // lógica para eliminar provincia
  const confirmed = await confirm('¿Estás seguro de que deseas eliminar esta provincia? Esta acción no se puede deshacer.')

  if (!confirmed) return

  try {
    await api.delete(`/locations/provinces/${id}`)

    alert('Provincia eliminada con éxito')
    await loadProvinces()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar la provincia')
  }
}

const deleteDistrictFunc = async (id) => {
  // lógica para eliminar distrito
  const confirmed = await confirm('¿Estás seguro de que deseas eliminar este distrito? Esta acción no se puede deshacer.')

  if (!confirmed) return

  try {
    await api.delete(`/locations/districts/${id}`)

    alert('Distrito eliminado con éxito')
    await loadDistricts()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar el distrito')
  }
}

const deleteDatacostFunc = async (id) => {
  // lógica para eliminar costo
  const confirmed = await confirm('¿Estás seguro de que deseas eliminar este costo? Esta acción no se puede deshacer.')

  if (!confirmed) return

  try {
    await api.delete(`/rates/${id}`)

    alert('Costo eliminado con éxito')
    await listViaticrates()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar el costo')
  }
}





onMounted(() => {
  listViaticrates()
  loadDepartments()
  loadProvinces()
  loadDistricts()


})
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" class="d-flex justify-end mb-4">
        <VBtn color="primary" @click="addDatacostFunc">
          Nuevo costo
        </VBtn>
      </VCol>
      <VCol cols="12">
        <h1 class="text-h4 font-weight-bold mb-0">
          Lista de presupuestos por destino
        </h1>
      </VCol>
      <VCol cols="12">
        <VDataTable :headers="headersBudgetlist" :items="Listcosts" item-key="id" class="elevation-1">
          <template #item.active="{ item }">
            <VChip color="primary">
              {{ item.active ? 'Activo' : 'Inactivo' }}
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <ButtonComponent :icon="item.active ? 'ri-toggle-fill' : 'ri-toggle-line'"
              :tooltip="item.active ? 'Desactivar costo' : 'Activar costo'"
              @click="desactivateCost(item.id, item.active)" />

            <ButtonComponent icon="ri-pencil-line" tooltip="Editar costo" color="primary"
              @click="editDatacostFunc(item)" />

            <ButtonComponent icon="ri-delete-bin-line" tooltip="Eliminar costo" color="error"
              @click="deleteDatacostFunc(item.id)" />

          </template>
        </VDataTable>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle>
            <span class="text-h5">Departamentos permitidos</span>
          </VCardTitle>
          <VCardText>
            <VDataTable density="compact" :headers="headersdepartmentlist" :items="departments" item-key="id"
              class="elevation-1">
              <template #item.active="{ item }">
                <VChip :color="item.active ? 'primary' : 'grey'">
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </VChip>
              </template>
              <template #item.actions="{ item }">
                <ButtonComponent :icon="item.active ? 'ri-toggle-fill' : 'ri-toggle-line'"
                  :tooltip="item.active ? 'Desactivar departamento' : 'Activar departamento'"
                  @click="desactivateDepartment(item.id, item.active)" />
              </template>
            </VDataTable>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle>
            <VRow dense>
              <VCol cols="12">
                <span class="text-h5">Provincias permitidas</span>
                <ButtonComponent icon="ri-add-circle-line" tooltip="Agregar provincia" color="success"
                  @click="addProvinceFunc" />
              </VCol>
            </VRow>
          </VCardTitle>
          <VCardText>
            <VDataTable :group-by="groupProvince" density="compact" :headers="headersprovincelist" :items="provinces"
              item-key="id" class="elevation-1">
              <template #item.active="{ item }">
                <VChip :color="item.active ? 'primary' : 'grey'">
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </VChip>
              </template>

              <template #item.actions="{ item }">
                <ButtonComponent :icon="item.active ? 'ri-toggle-fill' : 'ri-toggle-line'"
                  :tooltip="item.active ? 'Desactivar provincia' : 'Activar provincia'"
                  @click="desactivateProvince(item.id, item.active)" />

                <ButtonComponent icon="ri-pencil-line" tooltip="Editar provincia" color="primary"
                  @click="editProvinceFunc(item)" />

                <ButtonComponent icon="ri-delete-bin-line" tooltip="Eliminar provincia" color="error"
                  @click="deleteProvinceFunc(item.id)" />

              </template>
            </VDataTable>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle>
            <VRow dense>
              <VCol cols="12">
                <span class="text-h5">Distritos permitidos</span>
                <ButtonComponent icon="ri-add-circle-line" tooltip="Agregar distrito" color="success"
                  @click="addDistrictFunc" />
              </VCol>
            </VRow>
          </VCardTitle>
          <VCardText>
            <VDataTable :group-by="groupDistrict" density="compact" :headers="headersdistricts" :items="districts"
              item-key="id" class="elevation-1">
              <template #item.active="{ item }">
                <VChip :color="item.active ? 'primary' : 'grey'">
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </VChip>
              </template>
              <template #item.actions="{ item }">
                <ButtonComponent :icon="item.active ? 'ri-close-circle-line' : 'ri-checkbox-circle-line'"
                  :tooltip="item.active ? 'Desactivar distrito' : 'Activar distrito'"
                  :color="item.active ? 'error' : 'success'" @click="desactivateDistrict(item.id, item.active)" />

                <ButtonComponent icon="ri-pencil-line" tooltip="Editar distrito" color="primary"
                  @click="editDistrictFunc(item)" />

                <ButtonComponent icon="ri-delete-bin-line" tooltip="Eliminar distrito" color="error"
                  @click="deleteDistrictFunc(item.id)" />

              </template>
            </VDataTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- modal de provincia para creacion y edicion -->

    <VDialog v-model="showCostModal" max-width="800">
      <AddDatacost :mode="modeCostModal" :cost="selectedCost" @saved="listViaticrates" @close="showCostModal = false" />
    </VDialog>

    <VDialog v-model="showProvinceModal" max-width="600">
      <AddProvince :mode="modeProvinceModal" :province="selectedProvince" @saved="loadProvinces"
        @close="showProvinceModal = false" />
    </VDialog>

    <VDialog v-model="showDistrictModal" max-width="600">
      <AddDistrict :mode="modeDistrictModal" :district="selectedDistrict" @saved="loadDistricts"
        @close="showDistrictModal = false" />
    </VDialog>
  </div>
</template>
