<script setup>
const props = defineProps({
  viatic: {
    type: Number,
    default: null,
  },
  item: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'create',
  },
})

const emit = defineEmits(['saved', 'close'])
import { ref, computed, onMounted, watch } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import api from '@/services/api'
import { useSnackbar } from '@/composables/useSnackbar'


const isEdit = computed(() => props.mode === 'edit')
const snackbar = useSnackbar()

const Formdeclare = ref({
  viaticId: props.viatic,
  declareId: null,
  documentType: 'LIQUIDACION',
  optionObject: null,
  optionId: null,
  documentNumber: '',
  travelFrom: '',
  travelTo: '',
  expenseDate: new Date(),
  amount: '',
  category: '',
  paymentMethod: 'EFECTIVO',
})

const typesDocument = ['LIQUIDACION', 'MOVILIDAD', 'DECLARACION_JURADA']
const paymentMethods = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA']
const listOptions = ref([])

const getOpcionswithType = async type => {
  try {
    Formdeclare.value.description = ''

    const { data } = await api.get(`/decviatics/configurations/liquidation/type/${type}`)

    listOptions.value = data.data
    snackbar.open('Opciones cargadas', 'success')
  } catch (error) {
    console.error('Error fetching options:', error)
    snackbar.open('No se pudieron cargar las opciones', 'error')
  }
}

const addDepositViatic = async () => {
  // lógica para agregar provincia
  try {
    const payload = { ...Formdeclare.value }

    if (isEdit.value) {
      // Editar provincia
      await api.put(`/decviatics/expenses/`, payload)
      snackbar.value = { show: true, message: 'Gasto actualizado exitosamente', color: 'success' }
    } else {
      // Crear provincia
      await api.post('/decviatics/expenses/', payload)
      console.log('Gasto creado:', payload)
      snackbar.value = { show: true, message: 'Gasto creado exitosamente', color: 'success' }
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, message: 'No se pudo guardar el gasto', color: 'error' }
  }
}



const isMovilidad = computed(() => {
  return Formdeclare.value.documentType !== 'LIQUIDACION' &&
    Formdeclare.value.optionObject?.category === 'MOVILIDAD'
})

const handleDocumentTypeChange = async (newType) => {
  Formdeclare.value.optionObject = null
  await getOpcionswithType(newType)
}

watch(isMovilidad, newVal => {
  if (!newVal) {
    Formdeclare.value.travelFrom = ''
    Formdeclare.value.travelTo = ''
  }
})

watch(() => Formdeclare.value.documentType, newType => {
  getOpcionswithType(newType)
})



const optionId = computed(() => Formdeclare.value.optionObject?.id ?? null)



onMounted(async () => {
  await getOpcionswithType(Formdeclare.value.documentType)



  if (isEdit.value) {
    Object.assign(Formdeclare.value, {
      declareId: props.item.id,
      viaticId: props.viatic,
      documentType: props.item.document_type,
      documentNumber: props.item.document_number,
      travelFrom: props.item.travel_from,
      travelTo: props.item.travel_to,
      expenseDate: props.item.expense_date ? new Date(props.item.expense_date) : new Date(),
      amount: props.item.amount,
      category: props.item.category,
      paymentMethod: props.item.payment_method,
      optionObject: props.item.optionobject,
    })

  }
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>
        {{ isEdit ? 'EDITAR GASTO' : 'AGREGAR GASTO' }}
      </VCardTitle>
      <VCardText>

        <VRow>
          <VCol cols="12" sm="6">
            <VAutocomplete v-model="Formdeclare.documentType" :items="typesDocument" label="TIPO"
              @update:model-value="handleDocumentTypeChange" outlined dense />
          </VCol>
          <VCol cols="12" sm="12">
            <VAutocomplete v-model="Formdeclare.optionObject" :items="listOptions" label="Opciones" outlined dense
              item-value="id" item-title="label" return-object>
              <template v-slot:item="{ props, item }">
                <VListItem v-bind="props">
                  <VListItemSubtitle class="text-caption">
                    {{ item.raw.category }}
                  </VListItemSubtitle>
                </VListItem>
              </template>

              <template #selection="{ item }">
                {{ item.raw.label }}
                <VChip size="x-small" color="primary">
                  {{ item.raw.category }}
                </VChip>
              </template>
            </VAutocomplete>
          </VCol>
          <VCol v-if="Formdeclare.documentType === 'LIQUIDACION'" cols="12" sm="6">
            <VTextField v-model="Formdeclare.documentNumber" label="Número de Documento" outlined dense />
          </VCol>

          <VCol v-if="isMovilidad" cols="12" sm="6">
            <VTextField v-model="Formdeclare.travelFrom" label="Desde" outlined dense />
          </VCol>

          <VCol v-if="isMovilidad" cols="12" sm="6">
            <VTextField v-model="Formdeclare.travelTo" label="Hasta" outlined dense />
          </VCol>

          <VCol cols="12" sm="6">
            <VDateInput v-model="Formdeclare.expenseDate" label="Fecha de Gasto" prepend-icon="" variant="outlined" />
          </VCol>
          <VCol cols="12" sm="6">
            <VTextField v-model="Formdeclare.amount" label="Monto" type="number" outlined dense />
          </VCol>
          <VCol cols="12" sm="6">
            <VSelect v-model="Formdeclare.paymentMethod" label="Método de Pago" :items="paymentMethods" outlined
              dense />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="emit('close')">Cancelar</VBtn>
        <VBtn color="primary" @click="addDepositViatic">
          {{ isEdit ? 'Guardar gasto' : 'Agregar gasto' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
