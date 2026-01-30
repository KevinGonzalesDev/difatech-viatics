<script setup>
const props = defineProps({
  cost: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits(['saved', 'close'])
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/services/api'

const isEdit = computed(() => props.mode === 'edit')


const districts = ref([])
const concepts = ref([])
const frequencyList = ref(['DIARIA', 'FRECUENCIA'])

const dataCostForm = ref({
  districtId: '',
  conceptId: '',
  frequencyType: 'DIARIA',
  frequency: 1,
  amount: '',
})




const addDatacost = async () => {
  // lógica para agregar costo
  try {
    const payload = { ...dataCostForm.value }

    if (isEdit.value) {
      // Editar costo

      await api.put('/rates/rates', payload)

      alert('costo actualizado')
    } else {
      // Crear costo
      await api.post('/rates/rates', payload)
      alert('costo creado')
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('No se pudo guardar el costo')
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

const isedit = computed(() => props.mode === 'edit')

watch(
  () => props.cost,
  cost => {
    if (!cost) return

    dataCostForm.value = {
      conceptId: cost.concept_id,
      frequencyType: cost.frequency_type,
      frequency: cost.frequency,
      amount: cost.amount,
      id: cost.id,
    }
  },
  { immediate: true },
)

onMounted(() => {
  loadConcepts()
  loadDistricts()
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        <span class="text-h5">{{ isEdit ? 'Editar Costo' : 'Agregar Costo' }}</span>
      </VCardTitle>
      <VCardText>
        <VForm>
          <VRow>
            <VCol cols="12">
              <!-- {{ cost }} -->
              <VAutocomplete v-if="!isEdit" v-model="dataCostForm.districtId" label="Distrito"
                placeholder="Seleccione distrito" :items="districts" item-title="name" item-value="id">
                <template v-slot:item="{ props, item }">
                  <VListItem v-bind="props" :subtitle="item.raw.province_name" :title="item.raw.name" />
                </template>
              </VAutocomplete>
            </VCol>

            <VCol cols="12">
              <VAutocomplete v-model="dataCostForm.conceptId" label="Concepto" placeholder="Concepto" :items="concepts"
                item-title="description" item-value="id" />
            </VCol>

            <VCol cols="12">
              <VSelect v-model="dataCostForm.frequencyType" label="Frecuencia" placeholder="Frecuencia"
                :items="frequencyList" />
            </VCol>

            <VCol v-if="dataCostForm.frequencyType != 'DIARIA'" cols="12">
              <VTextField v-model="dataCostForm.frequency" label="Frecuencia" placeholder="FRECUENCIA" type="number" />
            </VCol>

            <VCol cols="12">
              <VTextField v-model="dataCostForm.amount" label="Monto" placeholder="Monto" type="number" />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn variant="text" color="secondary" text @click="emit('close')">
          Cancelar
        </VBtn>

        <VBtn color="primary" @click="addDatacost">
          Guardar costo
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
