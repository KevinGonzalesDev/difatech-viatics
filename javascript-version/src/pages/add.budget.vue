<script setup>
import { ref, watch, onMounted, inject } from 'vue'
import api from '@/services/api'
import { headerCostBudget } from '@/imports/headerstable'


const props = defineProps({
  viatic: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits(['close', 'saved'])
const isEdit = ref(props.mode === 'edit')

const snackbar = inject('snackbar')
const selectedViatic = ref([])
const budgetCosts = ref([])

const isInitializing = ref(true)

const budgetForm = ref({
  viaticId: props.viatic.id || null,
  districtId: props.viatic.district_id || null,
  days: 0,
  baseTotal: 0,
  totalAmount: 0,
  aditional: 0,
  dateCreated: new Date(),
  items: [],
})

const baseTotalCalc = ref(0)   // dinámico
const baseTotalLocked = ref(0)

// calcular los dias 
const calculateDaysFromBackend = (start, end) => {
  if (!start || !end) return 0

  const startDate = new Date(start)
  const endDate = new Date(end)

  // Normalizamos a medianoche (ignorar horas)
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)

  const diffTime = endDate - startDate
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return diffDays + 1 // incluye inicio y fin
}

// calcular los costos segun el distrito

const loadBudgetbyDistrict = async districtId => {
  try {

    if (isEdit.value) {
      // cargar los items del presupuesto existente
      const { data } = await api.get(`/budget/listBudgetItems/${props.viatic.budget_id}`)

      budgetCosts.value = data.data.map(c => ({
        ...c,
        amount: Number(c.amount),
        frequency: c.frequency,
        subtotal: 0,
      }))

      return
    } else {
      const { data } = await api.get(`/budget/listCostByDistrict/${districtId}`)

      budgetCosts.value = data.data.map(c => ({
        ...c,
        amount: Number(c.amount),
        frequency: getDefaultUnits(c.frequency_type, c.frequency, budgetForm.value.days),
        subtotal: 0,
      }))
    }

  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los costos por distrito')
  }
}


const addBudgetViatic = async () => {
  // lógica para agregar provincia
  try {
    const payload = { ...budgetForm.value, items: budgetCosts.value }

    if (isEdit.value) {
      // Editar provincia
      await api.put(`/budget/`, payload)
      snackbar.value = { show: true, message: 'Presupuesto actualizado exitosamente', color: 'success' }
    } else {
      // Crear provincia
      await api.post('/budget/', payload)
      snackbar.value = { show: true, message: 'Presupuesto creado exitosamente', color: 'success' }
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, message: 'No se pudo guardar el presupuesto', color: 'error' }
  }
}





const getDefaultUnits = (frequencyType, frequency, days) => {
  switch (frequencyType) {
    case 'DIARIA':
      return days
    case 'FRECUENCIA':
      return frequency
  }
}





// calculador de dias basado en fechas
watch(
  () => [selectedViatic.value.start_mov, selectedViatic.value.end_mov],
  ([start, end]) => {

    if (!start || !end) return
    budgetForm.value.days = calculateDaysFromBackend(start, end)
  },
  { immediate: true },
)


watch(
  () => [budgetForm.value.aditional, baseTotalCalc.value],
  ([aditional, calc, locked]) => {
    const base = calc

    budgetForm.value.baseTotal = base
    budgetForm.value.totalAmount =
      Number(base) + Number(aditional || 0)
  },
  { immediate: true },
)



watch(
  () => budgetCosts.value,
  (costs) => {

    let total = 0
    costs.forEach(c => {
      c.subtotal = c.frequency * c.amount
      total += c.subtotal
    })

    baseTotalCalc.value = total
    budgetForm.value.baseTotal = total
  },
  { deep: true, immediate: true },
)





onMounted(() => {
  selectedViatic.value = props.viatic
  loadBudgetbyDistrict(selectedViatic.value.district_id)


  if (isEdit.value) {

    budgetForm.value.days = props.viatic.days || 0
    budgetForm.value.aditional = props.viatic.aditional || 0



    budgetForm.value.baseTotal = baseTotalLocked.value
    budgetForm.value.totalAmount = props.viatic.budget_total
  }

  isInitializing.value = false
})
</script>

<template>
  <div>
    <VCard max-width="1000">
      <VCardTitle>Agregar Presupuesto</VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12">
            <VSpacer />
            <VChip>
              {{ budgetForm.baseTotal.toFixed(2) }} (Total base)
            </VChip>
          </VCol>
          <VCol cols="12" sm="6">
            <!-- {{ budgetCosts }} -->
            <VDataTable :items="budgetCosts" :headers="headerCostBudget" density="compact" hide-default-footer>
              <!-- Unidades -->
              <template #item.frequency="{ item }">
                <VTextField v-model.number="item.frequency" type="number" min="0" density="compact"
                  variant="outlined" />
              </template>

              <!-- Subtotal -->
              <template #item.subtotal="{ item }">
                {{ (item.frequency * item.amount).toFixed(2) }}
              </template>
            </VDataTable>
          </VCol>
          <VCol cols="12" sm="6">
            <!-- {{ viatic }} -->
            <VRow dense>
              <VCol cols="12">
                <VCard outlined>
                  <VCardTitle>{{ selectedViatic.proyect_name }}</VCardTitle>
                  <VCardText>
                    <VRow dense>
                      <VCol cols="12" class="d-flex justify-space-between">
                        <VChip variant="outlined" label>
                          {{ selectedViatic.name }} {{ selectedViatic.lastname }}
                        </VChip>
                        <VChip variant="outlined" label color="primary">
                          {{ selectedViatic.type }}
                        </VChip>
                      </VCol>
                      <VCol cols="12"><strong>Cliente:</strong> {{ selectedViatic.client_name }}</VCol>
                      <VCol cols="12">
                        <strong>Ubicación:</strong>
                        <VChip label>
                          {{ selectedViatic.location_name }}
                        </VChip>
                        <VChip label>
                          {{ selectedViatic.district_name }}
                        </VChip>
                      </VCol>
                      <VCol cols="12" class="d-flex justify-space-between">
                        <VChip label>
                          Inicio: {{ new Date(selectedViatic.start_mov).toLocaleDateString() }}
                        </VChip>
                        <VChip label>
                          Fin: {{ new Date(selectedViatic.end_mov).toLocaleDateString() }}
                        </VChip>
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol cols="12">
                <VCard outlined>
                  <VCardTitle>Asignar presupuesto</VCardTitle>
                  <VCardText>
                    <VRow>
                      <VCol cols="12" sm="6">
                        <VTextField v-model="budgetForm.days" label="Dias" type="number" readonly />
                      </VCol>
                      <VCol cols="12" sm="6">
                        <VTextField v-model="budgetForm.aditional" label="Adicional" type="number" />
                      </VCol>
                      <VCol cols="12">
                        <VTextField v-model="budgetForm.totalAmount" label="Total" type="number" readonly />
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="emit('close')">Cancelar</VBtn>
        <VBtn color="primary" @click="addBudgetViatic">Guardar</VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
