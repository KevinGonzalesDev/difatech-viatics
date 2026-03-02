<script setup>
import { onMounted, ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import api from '@/services/api'
import AddViatic from './add-viatic.vue'
import { headerviaticsUser } from '@/imports/headerstable'
import ButtonComponent from '@/components/buttonComponent.vue'
import ConfirmDialog from '@/components/modalConfirmation.vue'
import BaseDatatable from '@/components/BaseDatatable.vue'
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
const search = ref('')
const saludo = ref('')

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

const getBudgetStatus = (item) => {
  const deposited = Number(item.deposit_amount || 0)
  const budget = Number(item.budget_total || 0)

  if (item.status !== 'APROB_TESO') return null

  if (deposited === 0) {
    return { text: 'PRESUPUESTADO', color: 'info' }
  }

  if (deposited < budget) {
    return { text: 'ABONADO', color: 'error' }
  }

  return { text: 'ABONADO', color: 'success' }
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
    saludo.value = `Hola, ${user.value.name}`
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
    <VRow>
      <VCol cols="12" class="d-flex justify-space-between align-center">
        {{ saludo }}
        <VBtn color="primary" @click="openNewViaticModal">Solicitar viatico</VBtn>
      </VCol>
      <VCol cols="12">
        <!-- {{ viaticList }} viáticos encontrados -->
        <BaseDatatable v-model:search="search" :items="viaticList" :headers="headerviaticsUser">

          <template #item.employee_name="{ item }">
            {{ item.user_name }} {{ item.user_lastname }}
          </template>

          <template #item.project_data="{ item }">
            <div class="text-title-small">
              <VChip size="small" color="primary" label>
                {{ item.project_name }}
              </VChip>
              -
              <VChip size="small" color="secondary" label>
                {{ item.client_name }}
              </VChip>
            </div>
            <VChip size="small" color="info" label>
              {{ item.location_name }}
            </VChip>
          </template>

          <template #item.date_details="{ item }">
            <VChip size="small" color="secondary" label>
              Inicio :{{ new Date(item.start_mov).toLocaleDateString() }}
            </VChip>
            <VChip size="small" color="secondary" label>
              Fin : {{ new Date(item.end_mov).toLocaleDateString() }}
            </VChip>
            <VChip v-if="item.start_prov_date" size="small" color="info" label>
              LLeg Prov :{{ new Date(item.start_prov_date).toLocaleDateString() }}
            </VChip>
            <VChip v-if="item.end_prov_date" size="small" color="info" label>
              Sal Prov :{{ new Date(item.end_prov_date).toLocaleDateString() }}
            </VChip>
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
            <VChip v-else-if="item.status === 'APROB_TESO'" :color="getBudgetStatus(item).color" label>
              {{ getBudgetStatus(item).text }}
            </VChip>
          </template>



          <template #item.actions="{ item }">
            <ButtonComponent v-if="item.status === 'SOLICITED'" tooltip="Editar solicitud" icon="ri-edit-line"
              @click="openEditViaticModal(item)" />
            <ButtonComponent v-if="item.status != 'SOLICITED'" icon="ri-wallet-line" tooltip="Ver mis depositos" />
            <ButtonComponent v-if="item.status === 'SOLICITED'" icon="ri-delete-bin-line" tooltip="Eliminar viatico"
              @click="openDeleteViaticConfirm(item.id)" />
          </template>
        </BaseDatatable>
      </VCol>
    </VRow>
  </div>
</template>
