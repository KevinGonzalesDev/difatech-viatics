<script setup>
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

const emit = defineEmits(['saved', 'close'])
import { ref, onMounted, computed, shallowRef, watch } from 'vue'
import api from '@/services/api'
import { VDateInput } from 'vuetify/labs/VDateInput'

const isEdit = computed(() => props.mode === 'edit')
const model = shallowRef(null)
const user = ref()
const userList = ref([])
const clientsList = ref([])
const listUbications = ref([])
const isEmployee = ref(false)




const newViatic = ref({
  type: 'VISITA',
  userId: user.value?.id || '',
  clientId: '',
  project: '',
  locationId: '',
  startDate: new Date(),
  endDate: new Date(),
  soliReason: '',
  presentationDate: new Date(),
})




const onClientChange = () => {
  if (isEdit.value) {
    newViatic.value.locationId = null
  }
}

const listEmployees = async () => {
  try {
    const { data } = await api.get('/employee')

    userList.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los empleados')
  }
}

const listClients = async () => {
  try {
    const { data } = await api.get('/proyects/clients')

    clientsList.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los clientes')
  }
}

const listUbicationwID = async (id) => {
  try {
    const { data } = await api.get(`proyects/ubications/${id}`)

    // Procesar los datos de ubicación si es necesario
    listUbications.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar las ubicaciones')
  }
}


const saveViatic = async () => {
  try {
    const payload = { ...newViatic.value }

    if (isEdit.value) {
      await api.put(`/viatics/editsoliviatic/`, payload)
      alert('Viático actualizado')
    } else {
      await api.post('/viatics/addviatics', payload)
      alert('Viático creado')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    alert('Error al guardar viático')
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    user.value = JSON.parse(storedUser)
    newViatic.value.userId = user.value.id
  }

  if (user.value.roles.includes('employee')) {
    isEmployee.value = true
  }
  listEmployees()
  listClients()
})

watch(
  () => newViatic.value.clientId,
  async clientId => {
    // limpiar cascada
    if (!clientId) return

    if (!isEdit.value) {
      listUbications.value = []
      newViatic.value.locationId = ''
    }

    await listUbicationwID(clientId)
  },
)

watch(
  () => props.viatic,
  viatic => {
    if (!viatic) return

    newViatic.value = {
      viaticId: Number(viatic.id),
      type: viatic.type,
      userId: Number(viatic.user_id),
      clientId: Number(viatic.client_id),
      locationId: Number(viatic.location_id),
      startDate: new Date(viatic.start_mov),
      endDate: new Date(viatic.end_mov),
      soliReason: viatic.soli_reason,
      presentationDate: new Date(viatic.presentation_date),
    }
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <VCard max-width="800">
      <VCardTitle>{{ isEdit ? 'Editar solicitud' : 'Nueva solicitud' }}</VCardTitle>
      <VDivider />
      <VCardText>
        <VRow>
          <VCol cols="12" sm="12" class="d-flex justify-center">
            <VRadioGroup label="Tipo de viaje" v-model="newViatic.type" inline>
              <VRadio label="Visita tecnica" value="VISITA" />
              <VRadio label="Operaciones" value="OPERACIONES" />
            </VRadioGroup>
          </VCol>
          <VCol cols="12" sm="6">
            <VAutocomplete v-model="newViatic.userId" :items="userList" item-value="id" item-title="first_name"
              label="Empleado" :disabled="isEmployee">
              <template v-slot:item="{ props, item }">
                <VListItem v-bind="props" :prepend-avatar="'http://localhost:3000' + item.raw.avatar_img"
                  :subtitle="item.raw.last_name" :title="item.raw.first_name" />
              </template>
            </VAutocomplete>
          </VCol>
          <VCol cols="12" sm="6">
            <VAutocomplete v-model="newViatic.clientId" :items="clientsList" item-title="name" item-value="id"
              label="Cliente" @update:model-value="onClientChange" />
          </VCol>
          <VCol cols="12" sm="6">
            <!-- {{ listUbications }} -->
            <VAutocomplete v-model="newViatic.locationId" :items="listUbications" item-title="location_name"
              item-value="id" label="Ubicaciones">
              <template v-slot:item="{ props, item }">
                <VListItem v-bind="props" :subtitle="item.raw.district_name" :title="item.raw.location_name" />
              </template>
            </VAutocomplete>

          </VCol>
          <VCol cols="12" sm="6">
            <VTextField v-model="newViatic.soliReason" label="Motivo de solicitud" />
          </VCol>
          <VCol cols="12" sm="6">
            <VDateInput v-model="newViatic.startDate" variant="outlined" label="Fecha inicio" />
          </VCol>
          <VCol cols="12" sm="6">
            <VDateInput v-model="newViatic.endDate" variant="outlined" label="Fecha fin" />
          </VCol>

        </VRow>
      </VCardText>
      <VCardActions>
        <!-- Acciones del formulario -->
        <VSpacer />
        <VBtn color="primary" @click="saveViatic">
          {{ isEdit ? 'Guardar Cambios' : 'Agregar Viático' }}
        </VBtn>
        <VBtn text @click="$emit('close')">
          Cancelar
        </VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
