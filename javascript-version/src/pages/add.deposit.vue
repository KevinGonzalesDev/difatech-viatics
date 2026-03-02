<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import api from '@/services/api'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useSnackbar } from '@/composables/useSnackbar.js'
import { required, requiredObject } from '@/imports/rulesImport.js'

const props = defineProps({
  deposit: {
    type: Object,
    default: () => ({}),
  },

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
const snackbar = inject('snackbar')
const isEdit = ref(props.mode === 'edit')
const user = JSON.parse(localStorage.getItem('user')) || {}

const entityList = ref(['BANCO DE LA NACION', 'BANBIF', 'MIBANCO', 'PAYPAL', 'INTERBANK', 'BBVA', 'BCP'])
const typeDepositList = ref(['ADELANTO', 'ADICIONAL'])
const originAccountList = ref([''])
const destinationAccountList = ref([''])

const depositForm = ref({
  depositId: null,
  viaticId: props.viatic.id || null,
  amount: 0,
  entityFinancy: '',
  nmrVoucher: '',
  originAccount: null,
  destinationAccount: null,
  typeDeposit: '',
  depositDate: new Date(),
  observations: 'Sin observaciones',
  codeDeposit: '',
  createdAt: new Date(),
  createdBy: user.id || null,
})

// formateador de nombre para codigo
const getInitials = (fullName) => {
  const parts = fullName.split(' ').filter(Boolean)
  const firstName = parts[0]
  const lastNames = parts.slice(2) // omite segundo nombre

  return [firstName, ...lastNames]
    .map(p => p[0].toUpperCase())
    .join('')
}

// formateador de fecha para codigo
const formatDateCode = (date) => {
  const d = new Date(date)

  const year = d.getFullYear().toString().slice(-2)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}${month}${day}`
}



// generador de codigo
const generateDepositPrefix = () => {
  const user = JSON.parse(localStorage.getItem('user'))

  const initials = getInitials(user.name)
  const dateCode = formatDateCode(depositForm.value.depositDate)

  return `ER-${initials}${dateCode}`
}

const generateDepositCode = async () => {
  const user = JSON.parse(localStorage.getItem('user'))

  const initials = getInitials(user.name)
  const dateCode = formatDateCode(depositForm.value.depositDate)

  const prefix = `ER-${initials}${dateCode}`

  const dateISO = new Date(depositForm.value.depositDate)
    .toISOString()
    .split('T')[0]

  const { data } = await api.get('/deposits/count', {
    params: {
      viaticId: props.viatic.viatic_id,
      date: dateISO,
    },
  })

  const order = parseInt(data.data, 10) + 1


  depositForm.value.codeDeposit = `${prefix}-${order}`
}

const addDepositViatic = async () => {
  // lógica para agregar provincia
  try {
    const payload = { ...depositForm.value }

    if (isEdit.value) {
      // Editar provincia
      await api.put(`/deposits/`, payload)
      snackbar.value = { show: true, message: 'Depósito actualizado exitosamente', color: 'success' }
    } else {
      // Crear provincia
      await api.post('/deposits/', payload)
      snackbar.value = { show: true, message: 'Depósito creado exitosamente', color: 'success' }
    }
    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, message: 'No se pudo guardar el depósito', color: 'error' }
  }
}

const loadOriginAndDestinationAccounts = async () => {
  try {
    const [originRes, destinationRes] = await Promise.all([
      api.get('/bank/Empresa/1'),
      api.get('/bank/Empleado/' + props.viatic.user_id),
    ])

    originAccountList.value = originRes.data.data
    destinationAccountList.value = destinationRes.data.data
  } catch (err) {
    console.error(err)
    alert('No se pudieron cargar las cuentas')
  }
}

watch(
  () => depositForm.value.depositDate,
  (date) => {
    if (isEdit.value) return
    if (!date) return
    generateDepositCode()
  },
  { immediate: true },
)

onMounted(() => {
  loadOriginAndDestinationAccounts()
  if (isEdit.value) {
    // cargar datos existentes si es modo edición
    depositForm.value.depositId = props.deposit.id || null
    depositForm.value.viaticId = props.deposit.viatic_id || null
    depositForm.value.amount = props.deposit.amount || 0
    depositForm.value.nmrVoucher = props.deposit.nro_voucher || ''
    depositForm.value.typeDeposit = props.deposit.type || ''
    depositForm.value.depositDate = props.deposit.date_deposit || new Date()
    depositForm.value.observations = props.deposit.observation || ''
    depositForm.value.viaticId = props.deposit.viatic_id || null
    depositForm.value.codeDeposit = props.deposit.code || ''
    depositForm.value.createdBy = props.deposit.created_by || user.id || null
    depositForm.value.createdAt = props.deposit.created_at || new Date()
    depositForm.value.originAccount = props.deposit.origin_account || null
    depositForm.value.destinationAccount = props.deposit.destiny_account || null
  }
})
</script>

<template>
  <div>
    <VCard>
      <VCardTitle class="d-flex justify-space-between">
        {{ isEdit ? 'Editar Depósito' : 'Agregar Depósito' }}
        <VChip label>
          {{ depositForm.codeDeposit }}
        </VChip>
      </VCardTitle>
      <VCardText>
        <VRow>
          {{ depositForm }} --- IGNORE ---
          <VCol cols="12" md="6">
            <VAutocomplete v-model="depositForm.originAccount" item-title="account_number" item-id="id"
              :items="originAccountList" label="Cuenta Origen" type="text" return-object />
            <VExpandTransition>
              <VCard v-if="depositForm.originAccount" class="mt-3 pa-3" variant="tonal">
                <div class="text-subtitle-1 font-weight-bold">
                  {{ depositForm.originAccount.bank_name }} -
                  {{ depositForm.originAccount.currency }}
                </div>

                <div class="text-body-2 mt-1">
                  Cuenta: {{ depositForm.originAccount.account_number }}
                </div>

                <div class="text-body-2">
                  CCI: {{ depositForm.originAccount.cci }}
                </div>
              </VCard>
            </VExpandTransition>
          </VCol>
          <VCol cols="12" md="6">
            <VAutocomplete v-model="depositForm.destinationAccount" item-title="account_number" item-id="id"
              :items="destinationAccountList" label="Cuenta Destino" type="text" return-object />
            <VExpandTransition>
              <VCard v-if="depositForm.destinationAccount" class="mt-3 pa-3" variant="tonal">
                <div class="text-subtitle-1 font-weight-bold">
                  {{ depositForm.destinationAccount.bank_name }} -
                  {{ depositForm.destinationAccount.currency }}
                </div>

                <div class="text-body-2 mt-1">
                  Cuenta: {{ depositForm.destinationAccount.account_number }}
                </div>

                <div class="text-body-2">
                  CCI: {{ depositForm.destinationAccount.cci }}
                </div>
              </VCard>
            </VExpandTransition>
          </VCol>
          <VCol cols="12" md="6">
            <VTextField v-model="depositForm.amount" label="Monto" type="number" />
          </VCol>
          <VCol cols="12" md="6">
            <VTextField v-model="depositForm.nmrVoucher" label="N° Voucher" type="number" />
          </VCol>
          <VCol cols="12" md="6">
            <VAutocomplete v-model="depositForm.typeDeposit" :items="typeDepositList" label="Tipo de deposito"
              type="text" />
          </VCol>
          <VCol cols="12" md="6">
            <VDateInput v-model="depositForm.depositDate" label="Fecha de deposito" />
          </VCol>
          <VCol cols="12" md="12">
            <VTextField v-model="depositForm.observations" label="Observaciones" type="text" />
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="emit('close')">
          Cancelar
        </VBtn>
        <VBtn color="primary" @click="addDepositViatic">
          Guardar
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
