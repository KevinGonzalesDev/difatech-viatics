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
import { ref, onMounted, computed, shallowRef, watch, inject } from 'vue'
import api from '@/services/api'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { useSnackbar } from '@/composables/useSnackbar.js'
import { required, requiredObject } from '@/imports/rulesImport.js'

const snackbar = useSnackbar()
const formRef = ref(null)
const isEdit = computed(() => props.mode === 'edit')

const user = ref()
const userList = ref([])
const proyectsList = ref([])
const isEmployee = ref(false)
const repeatViatic = ref(false)




const newViatic = ref({
  type: 'LIMA',
  codeViatic: '',
  userId: user.value?.id || '',
  clientId: '',
  projectId: '',
  project: null,
  startDate: new Date(),
  endDate: new Date(),
  soliReason: 'Trabajo asignado por la empresa',
  presentationDate: new Date(),
})



const listEmployees = async () => {
  try {
    const { data } = await api.get('/employee')

    userList.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los empleados')
  }
}


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


const generateViaticCode = async () => {
  const user = JSON.parse(localStorage.getItem('user'))

  const initials = getInitials(user.name)
  const dateCode = formatDateCode(newViatic.value.startDate)

  const prefix = `LV-${initials}${dateCode}`

  const userId = newViatic.value.userId



  const dateISO = new Date(newViatic.value.startDate)
    .toISOString()
    .split('T')[0]

  const { data } = await api.get('/viatics/count/', {
    params: {
      userId: userId,
      date: dateISO,
      excludeId: isEdit.value ? newViatic.value.viaticId : null,
    },
  })


  const order = parseInt(data.data, 10)
  if (order >= 1) {
    repeatViatic.value = true
  } else {
    repeatViatic.value = false
  }


  newViatic.value.codeViatic = `${prefix}`
}




const loadProyects = async () => {
  try {
    const { data } = await api.get(`proyects/`)

    proyectsList.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los proyectos del cliente')
  } finally {
    if (isEdit.value) {
      newViatic.value.project = proyectsList.value.find(
        p => p.id === Number(props.viatic.proyect_id),
      )
    }
  }
}


// validadores de formularios

const onSubmit = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid) return


  if (repeatViatic.value) {
    snackbar.open('El codigo de viatico esta duplicado', 'error')

    return
  }

  await saveViatic()
}

const resetForm = () => {
  formRef.value?.resetValidation()
}


const saveViatic = async () => {
  try {


    const payload = { ...newViatic.value }

    if (isEdit.value) {
      await api.put(`/viatics/editsoliviatic/`, payload)
      snackbar.open('Viático actualizado', 'success')
    } else {
      await api.post('/viatics/addviatics', payload)
      snackbar.open('Viático creado', 'success')
    }

    emit('saved')
    emit('close')
  } catch (err) {
    console.error(err)
    snackbar.open('Error al guardar viático', 'error')
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
  loadProyects()



})



watch(
  () => newViatic.value.project,
  project => {
    if (!project || typeof project !== 'object') return

    newViatic.value.projectId = project.id
    newViatic.value.clientId = project.client_id
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
      projectId: Number(viatic.proyect_id),

      startDate: new Date(viatic.start_mov),
      endDate: new Date(viatic.end_mov),
      soliReason: viatic.soli_reason,
      codeViatic: viatic.code,
      presentationDate: new Date(viatic.presentation_date),
    }
  },
  { immediate: true },
)

watch(
  () => [
    newViatic.value.startDate,
    newViatic.value.userId,
    isEdit.value,
  ],
  ([date, userId, isEditMode]) => {
    if (isEditMode) return
    if (!date || !userId) return

    generateViaticCode()
  },
  { immediate: false }, // 👈 CLAVE
)
</script>

<template>
  <div>
    <VForm ref="formRef" lazy-validation>
      <VCard max-width="800">
        <VCardTitle class="d-flex justify-space-between">
          {{ isEdit ? 'Editar solicitud' : 'Nueva solicitud' }}
          <VChip :color="repeatViatic ? 'error' : 'success'" label>
            {{ newViatic.codeViatic }}
          </VChip>
          <!-- {{ repeatViatic ? '(Código disponible)' : '(Código repetido)' }} -->
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VRow>
            <VCol cols="12" sm="12" class="d-flex justify-center">
              <VRadioGroup label="Tipo de viaje" v-model="newViatic.type" inline>
                <VRadio label="Lima" value="LIMA" />
                <VRadio label="Provincia" value="PROVINCIA" />
              </VRadioGroup>
            </VCol>
            <VCol cols="12" sm="6">
              <VAutocomplete v-model="newViatic.userId" :rules="[required]" :items="userList" item-value="id"
                item-title="first_name" label="Empleado" :disabled="isEmployee">
                <template v-slot:item="{ props, item }">
                  <VListItem v-bind="props" :prepend-avatar="'http://localhost:3000' + item.raw.avatar_img"
                    :subtitle="item.raw.last_name" :title="item.raw.first_name" />
                </template>
              </VAutocomplete>
            </VCol>
            <VCol cols="12" sm="6">
              <VTextField v-model="newViatic.soliReason" :rules="[required]" label="Motivo de solicitud" />
            </VCol>
            <VCol cols="12" sm="12"> <!-- {{ proyectsList }} -->
              <VAutocomplete v-model="newViatic.project" :rules="[requiredObject]" :items="proyectsList" item-value="id"
                label="Selecciona un proyecto" item-title="cost_center_code" return-object>
                <template v-slot:item="{ props, item }">
                  <VListItem v-bind="props">
                    <!-- <VListItemTitle>{{ item.raw.cost_center_code }}</VListItemTitle> -->
                    <VListItemSubtitle class="mb-1 text-high-emphasis opacity-100">
                      {{ item.raw.project_name }} - {{ item.raw.client_name }}
                    </VListItemSubtitle>
                    <VListItemSubtitle class="mb-1 text-high-emphasis opacity-100">
                      Ubicación: {{ item.raw.location_name }}
                    </VListItemSubtitle>
                  </VListItem>
                </template>

                <template #selection="{ item }">
                  <div class="d-flex flex-column">
                    <span class="text-body-1 font-weight-medium">
                      {{ item.raw.project_name }} - {{ item.raw.cost_center_code }}
                    </span>
                    <span class="text-caption">
                      {{ item.raw.client_name }} · {{ item.raw.location_name }}
                    </span>
                  </div>
                </template>
              </VAutocomplete>
            </VCol>

            <VCol cols="12" sm="6">
              <VDateInput v-model="newViatic.startDate" @update:model-value="generateViaticCode" variant="outlined"
                label="Fecha inicio" :rules="[required]" />
            </VCol>
            <VCol cols="12" sm="6">
              <VDateInput v-model="newViatic.endDate" :rules="[required]" variant="outlined" label="Fecha fin" />
            </VCol>
          </VRow>
        </VCardText>
        <VCardActions>
          <!-- Acciones del formulario -->
          <VSpacer />
          <VBtn color="primary" @click="onSubmit">
            {{ isEdit ? 'Guardar Cambios' : 'Agregar Viático' }}
          </VBtn>
          <VBtn text @click="$emit('close'); resetForm()">
            Cancelar
          </VBtn>
        </VCardActions>
      </VCard>
    </VForm>
  </div>
</template>
