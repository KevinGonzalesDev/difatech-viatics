<script setup>
import { onMounted, ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import api from '@/services/api'
import AddViatic from './add-viatic.vue'
import { headerviaticsUser } from '@/imports/headerstable'
import ButtonComponent from '@/components/buttonComponent.vue'
import ConfirmDialog from '@/components/modalConfirmation.vue'
import { useSnackbar } from '@/composables/useSnackbar'



const viaticModal = ref(false)
const selectedViatic = ref(null)
const mode = ref('create')

// estados de confirmacion
const showConfirm = ref(false)
const viaticIdToDelete = ref(null)
const snackbar = useSnackbar()


const viaticList = ref([])
const user = ref()

const openNewViaticModal = () => {
  mode.value = 'create'
  selectedViatic.value = null
  viaticModal.value = true
}

const openEditViaticModal = async viatic => {
  // Lógica para editar el viático
  mode.value = 'edit'
  selectedViatic.value = viatic
  viaticModal.value = true
}

const openDeleteViaticConfirm = (viaticId) => {
  viaticIdToDelete.value = viaticId
  showConfirm.value = true
}

const closeViaticModal = () => {
  viaticModal.value = false
  selectedViatic.value = null
}


const ListViaticsbyId = async () => {
  try {
    const { data } = await api.get('/viatics/listviaticbyid/' + user.value.id)

    viaticList.value = data.data
  } catch (err) {
    console.error(err)
    snackbar.open('No se pudo cargar los viáticos', 'error')
  }
}

const deleteViatic = async () => {
  try {
    await api.delete('/viatics/deleteviatic/' + viaticIdToDelete.value)
    snackbar.open('Viático eliminado correctamente', 'success')
    ListViaticsbyId()
  } catch (err) {
    console.error(err)
    snackbar.open('No se pudo eliminar el viático', 'error')
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
  ListViaticsbyId()
})
</script>

<template>
  <div>
    <VDialog v-model="viaticModal" max-width="800" persistent>
      <AddViatic :mode="mode" :viatic="selectedViatic" @close="closeViaticModal" @saved="ListViaticsbyId" />
    </VDialog>

    <ConfirmDialog v-model="showConfirm" title="Eliminar solicitud de viático"
      message="Esta acción no se puede deshacer. ¿Deseas continuar?" confirm-text="Sí, eliminar" cancel-text="No"
      @confirm="deleteViatic" />

    <h1>Listado de Viáticos</h1>
    <!-- Aquí va el contenido del listado de viáticos -->
    <VRow class="mb-4">
      <VCol cols="12" class="d-flex justify-end">
        <VBtn color="primary" @click="openNewViaticModal">Solicitar viatico</VBtn>
      </VCol>
      <VCol cols="12">
        <!-- {{ viaticList }} viáticos encontrados -->
        <VDataTable :items="viaticList" :headers="headerviaticsUser">
          <template #item.employee_name="{ item }">
            {{ item.name }} {{ item.lastname }}
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

          <template #item.actions="{ item }">
            <ButtonComponent v-if="item.status === 'SOLICITED'" tooltip="Editar solicitud" icon="ri-edit-line"
              @click="openEditViaticModal(item)" />
            <ButtonComponent v-if="item.status != 'SOLICITED'" icon="ri-wallet-line" tooltip="Ver mis depositos" />
            <ButtonComponent v-if="item.status === 'SOLICITED'" icon="ri-delete-bin-line" tooltip="Eliminar viatico"
              @click="openDeleteViaticConfirm(item.id)" />
          </template>
        </VDataTable>
      </VCol>
    </VRow>
  </div>
</template>
