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
  headersConceptsList,
} from '@/imports/headerstable'
import buttonComponent from '@/components/buttonComponent.vue'
import ButtonComponent from '@/components/buttonComponent.vue'
import AddProvince from './add.province.vue'
import AddDatacost from './add.datacost.vue'
import AddDistrict from './add.district.vue'
import AddConcepts from './add.concepts.vue'

const confirm = useConfirm()


const ShowconceptList = ref(false)
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

// variables de estado de modal de coceptos
const showConceptModal = ref(false)
const selectedConcept = ref(null)
const modeConceptModal = ref('create') // 'create' o 'edit'




const search = ref('')
const page = ref(1)
const itemsPerPage = ref(4)

const Listcosts = ref([])
const departments = ref([])
const provinces = ref([])
const districts = ref([])
const concepts = ref([])



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

const loadConcepts = async () => {
  try {
    const { data } = await api.get('/rates/concepts')

    concepts.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar los conceptos')
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


// funciones de estado de modales props provincia
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

// funciones de estado de modales props distrito
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

// funciones de estado de modales props costo
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

// funciones de estado de modales props concepto
const addConceptFunc = () => {
  showConceptModal.value = true
  modeConceptModal.value = 'create'
  selectedConcept.value = null
}

const editConceptFunc = async (item) => {
  // lógica para editar concepto
  showConceptModal.value = true
  modeConceptModal.value = 'edit'
  selectedConcept.value = item
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

const deleteConceptFunc = async (id) => {
  // lógica para eliminar concepto
  const confirmed = await confirm('¿Estás seguro de que deseas eliminar este concepto? Esta acción no se puede deshacer.')

  if (!confirmed) return

  try {
    await api.delete(`/rates/concepts/${id}`)

    alert('Concepto eliminado con éxito')
    await loadConcepts()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar el concepto')
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
    <VDialog v-model="ShowconceptList" max-width="600">
      <VCard>
        <VCardTitle class="d-flex justify-space-between">
          <span class="text-h5">Lista de Conceptos</span>

          <ButtonComponent icon="ri-add-circle-line" tooltip="Agregar concepto" color="success"
            @click="addConceptFunc" />

        </VCardTitle>
        <VCardText>
          <VDataTable :headers="headersConceptsList" :items="concepts">
            <template #item.actions="{ item }">
              <ButtonComponent icon="ri-pencil-line" tooltip="Editar concepto" color="primary"
                @click="editConceptFunc(item)" />

              <ButtonComponent icon="ri-delete-bin-line" tooltip="Eliminar concepto" color="error"
                @click="deleteConceptFunc(item.id)" />
            </template>
          </VDataTable>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn text @click="ShowconceptList = false">Cerrar</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VRow>
      <VCol cols="12" class="d-flex justify-end mb-4">
        <VBtn color="primary" @click="addDatacostFunc">
          Nuevo costo
        </VBtn>
        <VBtn color="success" class="ml-2" @click="ShowconceptList = true; loadConcepts()">
          Ver conceptos
        </VBtn>
      </VCol>

      <VCol cols="12">
        <VCard min-height="280">
          <VCardTitle>
            <span class="text-h5">Lista de Costos de Viáticos</span>
          </VCardTitle>
          <VCardText>
            <VRow dense>
              <VCol cols="12">
                <VTextField v-model="search" label="Buscar distrito o concepto" prepend-inner-icon="ri-search-line"
                  density="compact" clearable class="mb-4" />
              </VCol>
              <VCol cols="12">
                <VDataIterator :items="Listcosts" v-model:page="page" :items-per-page="itemsPerPage" :search="search">
                  <template #default="{ items }">
                    <VRow>
                      <VCol v-for="district in items" :key="district.raw.district_id" cols="12" md="6">
                        <VCard>
                          <!-- Header del distrito -->
                          <VCardTitle class="d-flex justify-space-between align-center">
                            <span class="text-h6">
                              {{ district.raw.district_name }}
                            </span>

                            <VBtn size="small" color="primary" prepend-icon="ri-add-line"
                              @click="addBudget(district.raw)">
                              Agregar
                            </VBtn>
                          </VCardTitle>

                          <VDivider />

                          <!-- Lista de presupuestos -->
                          <VList density="compact">
                            <!-- {{ Listcosts }} -->
                            <VListItem v-for="cost in district.raw.costs" :key="cost.id">
                              <VListItemTitle>
                                {{ cost.concept_name }}
                                <VChip size="small" label class="ml-2">
                                  {{ cost.frequency_type }}
                                </VChip>
                              </VListItemTitle>

                              <VListItemSubtitle>
                                S/ {{ cost.amount }}
                                <VChip v-if="cost.frequency_type != 'DIARIA'" size="small" label class="ml-2">
                                  Frecuencia :
                                  {{ cost.frequency }}
                                </VChip>
                              </VListItemSubtitle>

                              <template #append>
                                <ButtonComponent :icon="cost.active ? 'ri-toggle-fill' : 'ri-toggle-line'"
                                  :tooltip="cost.active ? 'Desactivar costo' : 'Activar costo'"
                                  @click="desactivateCost(cost.id, cost.active)" />

                                <ButtonComponent icon="ri-pencil-line" tooltip="Editar costo" color="primary"
                                  @click="editDatacostFunc(cost)" />

                                <ButtonComponent icon="ri-delete-bin-line" tooltip="Eliminar costo" color="error"
                                  @click="deleteDatacostFunc(cost.id)" />

                              </template>
                            </VListItem>
                          </VList>
                        </VCard>
                      </VCol>
                    </VRow>
                  </template>

                  <template #footer="{ pageCount }">
                    <div class="d-flex justify-center mt-4">
                      <VPagination v-model="page" :length="pageCount" size="small" rounded />
                    </div>
                  </template>
                </VDataIterator>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
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

    <VDialog v-model="showConceptModal" max-width="600">
      <AddConcepts :mode="modeConceptModal" :concept="selectedConcept" @saved="loadConcepts"
        @close="showConceptModal = false" />
    </VDialog>

  </div>
</template>
