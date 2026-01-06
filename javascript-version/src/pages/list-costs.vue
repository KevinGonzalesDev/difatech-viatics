<script setup>
import { ref, onMounted } from 'vue'
import { useConfirm } from '@/composables/useConfirm'
import api from '@/services/api'

const confirm = useConfirm()



const addCostconfig = ref(false)
const selectedEmployee = ref(null)
const selectedRoles = ref([])

const dataCost = ref({
  id: null,
  departmentId: '',
  provinceId: '',
  districtID: '',
  conceptId: '',
  amount: '',
  validFrom: '',
  validTo: '',
  active: true,
})

const headersCosts = [
  { title: 'distrito', key: 'district_name' },
  { title: 'concepto', key: 'concept_description' },
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

const districts = ref([])
const concepts = ref([])
const provinces = ref([])
const departments = ref([])


const loadDepartments = async () => {
  try {
    const { data } = await api.get('/locations/departments')

    departments.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar los departamentos')
  }
}

const loadProvinces = async departmentId => {
  try {
    const { data } = await api.get(`/locations/provinces/department/${departmentId}`)

    provinces.value = data.data || []
  } catch (err) {
    provinces.value = []
    console.error(err)
  }
}

const loadDistricts = async provinceId => {
  if (!provinceId) {
    districts.value = []

    return
  }

  try {
    const { data } = await api.get(`/locations/provinces/districts/${provinceId}`)

    districts.value = data.data || []
  } catch (err) {
    districts.value = []
    console.error('Error cargando distritos:', err)
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

const saveViaticRate = async () => {
  try {
    await api.post('/rates', dataCost.value)

    alert('Costo guardado con exito')
    addCostconfig.value = false
    Loadcosts()
  } catch (err) {
    console.error(err)
    alert('No se pudo guardar el costo')
  }
}

const editCostWId = async (id) => {
  try {
    const { data } = await api.put(`/rates/${id}`)

    const rate = data.data

    dataCost.value = {
      id: rate.id,
      departmentId: rate.department_id,
      provinceId: rate.province_id,
      districtID: rate.district_id,
      conceptId: rate.concept_id,
      amount: rate.amount,
      validFrom: rate.valid_from,
      validTo: rate.valid_to,
      active: rate.active,
    }

    addCostconfig.value = true
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar el costo')
  }
}

const listViaticrates = async () => {
  try {
    const { data } = await api.get('/rates')

    Listcosts.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los costos')
  }
}

watch(
  () => dataCost.value.departmentId,
  async departmentId => {
    // limpiar cascada
    provinces.value = []
    districts.value = []

    dataCost.value.provinceId = null
    dataCost.value.districtID = null

    if (!departmentId) return

    await loadProvinces(departmentId)
  },
)

watch(
  () => dataCost.value.provinceId,
  async provinceId => {
    districts.value = []
    dataCost.value.districtID = null

    if (!provinceId) return

    await loadDistricts(provinceId)
  },
)



onMounted(() => {
  listViaticrates()
  Loadcosts()
  loadDepartments()
  loadConcepts()

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
                <VRow>
                  <VCol cols="12" md="3">
                    <VAutocomplete v-model="dataCost.departmentId" label="Departamentos"
                      placeholder="Seleccione departamento" :items="departments" item-title="name" item-value="id"
                      clearable />
                  </VCol>

                  <VCol cols="12" md="3">
                    <VAutocomplete v-model="dataCost.provinceId" label="Provincia" placeholder="Seleccione provincia"
                      :items="provinces" item-title="name" item-value="id" :disabled="!dataCost.departmentId"
                      clearable />
                  </VCol>

                  <VCol cols="12" md="3">
                    <VAutocomplete v-model="dataCost.districtID" label="Distrito" placeholder="Seleccione distrito"
                      :items="districts" item-title="name" item-value="id" :disabled="!dataCost.provinceId" />
                  </VCol>

                  <VCol cols="12" md="3">
                    <VAutocomplete v-model="dataCost.conceptId" label="Concepto" placeholder="Concepto"
                      :items="concepts" item-title="description" item-value="id" />
                  </VCol>

                  <VCol cols="12" md="3">
                    <VTextField v-model="dataCost.amount" label="Monto" placeholder="Monto" type="number" />
                  </VCol>
                </VRow>
              </VForm>
            </VCardText>

            <VCardActions class="justify-end">
              <VBtn variant="text" @click="addCostconfig = false">
                Cancelar
              </VBtn>

              <VBtn color="primary" @click="saveViaticRate">
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
        {{ Listcosts }}
        <VCol cols="12">
          <VDataTable :headers="headersCosts" :items="Listcosts" item-key="id" class="elevation-1">

            <template #item.actions="{ item }">
              <VBtn icon @click="editCostWId(item.id)">
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
