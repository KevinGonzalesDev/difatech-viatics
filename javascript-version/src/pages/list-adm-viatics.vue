<script setup>
import { onMounted, ref, inject } from 'vue'
import api from '@/services/api'
import { headersoliAdmviatics } from '@/imports/headerstable'
import ButtonComponent from '@/components/buttonComponent.vue'
import ConfirmDialog from '@/components/modalConfirmation.vue'


const snackbar = inject('snackbar')
const allviaticList = ref([])
const user = ref()

const showConfirm = ref(false)
const showDenied = ref(false)

const selectedViatic = ref(null)

// variables de estado de authorization viatic
const AuthViaticModal = ref(false)
const AuthSelectedViatic = ref(null)
const AuthMode = ref('create')



const ListAllViatics = async () => {
  try {
    const { data } = await api.get('/viatics/listallviatics')

    allviaticList.value = data.data
  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los viáticos administrativos')
  }
}


const openConfirmViatic = (item) => {
  selectedViatic.value = item
  showConfirm.value = true
}

const openDeniedViatic = (item) => {
  selectedViatic.value = item
  showDenied.value = true
}


const authorizeViatic = async () => {
  try {
    const payload = {
      approvalDate: new Date(),
      approvedBy: user.value.id,
      viaticId: selectedViatic.value.id,
    }

    await api.put('/viatics/aprobeviatic/', payload)
    snackbar.value = { show: true, text: 'Viático autorizado correctamente', color: 'success' }
    ListAllViatics()
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, text: 'No se pudo autorizar el viático', color: 'error' }
  }
}

const denyViatic = async () => {
  try {
    const payload = {
      viaticId: selectedViatic.value.id,
    }

    await api.put('/viatics/rejectviatic/', payload)
    snackbar.value = { show: true, text: 'Viático rechazado correctamente', color: 'success' }
    ListAllViatics()
  } catch (err) {
    console.error(err)
    snackbar.value = { show: true, text: 'No se pudo rechazar el viático', color: 'error' }
  }
}


onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  ListAllViatics()
})
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <h1 class="text-h4 font-weight-bold mb-0">
          Lista de Viáticos Administrativos
        </h1>
      </VCol>
      <VCol cols="12">
        <!-- {{ allviaticList }} -->
        <VDataTable :items="allviaticList" :headers="headersoliAdmviatics">
          <template #item.employee_name="{ item }">
            {{ item.name }} {{ item.lastname }}
          </template>

          <template #item.project_name="{ item }">
            <VRow v-if="item.project_name" dense>
              <VCol cols="12" class="font-weight-bold">
                {{ item.project_name }}
              </VCol>
              <VCol cols="12" class="font-weight-bold">
                <VChip color="blue-grey" label dark size="small">
                  {{ item.project_code }}
                </VChip>
              </VCol>
            </VRow>
            <VChip v-else color="grey" label dark>
              SIN PROYECTO
            </VChip>
          </template>

          <template #item.startdate="{ item }">
            {{ new Date(item.start_mov).toLocaleDateString() }}
          </template>

          <template #item.enddate="{ item }">
            {{ new Date(item.end_mov).toLocaleDateString() }}
          </template>

          <template #item.status="{ item }">
            <VChip v-if="item.status === 'SOLICITED'" color="primary" label dark>
              SOLICITADO
            </VChip>
            <VChip v-if="item.status === 'APROB_ADMIN'" color="success" label="" dark>
              APROBADO
            </VChip>
            <VChip v-if="item.status === 'REFUSED'" color="error" label="" dark>
              RECHAZADO
            </VChip>
            <VChip v-if="item.status === 'APROB_TESO'" color="info" label="" dark>
              PRESUPUESTADO
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <VCard variant="outlined" v-if="item.status != 'APROB_TESO'" class="d-flex justify-center">

              <ButtonComponent icon="ri-check-line" tooltip="Aprobar viatico" color="success"
                @click="openConfirmViatic(item)" />

              <ButtonComponent icon="ri-close-circle-line" tooltip="Rechazar viatico" color="error"
                @click="openDeniedViatic(item)" />
            </VCard>


          </template>

          <template #no-data>
            <VCard elevation="0" class="d-flex flex-column align-center justify-center ma-6" min-height="200">
              <VIcon size="48" color="grey-lighten-1" class="mb-2">
                ri-inbox-line
              </VIcon>

              <span class="text-grey-darken-1 text-body-1">
                No hay registros para mostrar
              </span>

              <span class="text-grey text-caption mt-1">
                Intenta ajustar los filtros o crea un nuevo registro
              </span>
            </VCard>
          </template>
        </VDataTable>
      </VCol>
    </VRow>

    <ConfirmDialog v-model="showConfirm" title="Aprobar viático"
      message="Esta acción no se puede deshacer. ¿Deseas continuar?" confirm-text="Sí, aprobar" cancel-text="No"
      @confirm="authorizeViatic" />

    <ConfirmDialog v-model="showDenied" title="Rechazar viático"
      message="Esta acción no se puede deshacer. ¿Deseas continuar?" confirm-text="Sí, rechazar" cancel-text="No"
      @confirm="denyViatic" />

  </div>
</template>
