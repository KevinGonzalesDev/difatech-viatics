<script setup>
import { onMounted, ref } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import api from '@/services/api'
import AddViatic from './add-viatic.vue'
import { headerviaticsUser } from '@/imports/headerstable'
import ButtonComponent from '@/components/buttonComponent.vue'


const viaticModal = ref(false)
const selectedViatic = ref(null)
const mode = ref('create')

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
    alert('No se pudo cargar los viáticos')
  }
}

const deleteViatic = async viaticId => {
  try {
    await api.delete('/viatics/deleteviatic/' + viaticId)
    alert('Viático eliminado correctamente')
    ListViaticsbyId()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar el viático')
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
    <VDialog v-model="viaticModal" max-width="800">
      <AddViatic :mode="mode" :viatic="selectedViatic" @close="closeViaticModal" @saved="ListViaticsbyId" />
    </VDialog>

    <h1>Listado de Viáticos</h1>
    <!-- Aquí va el contenido del listado de viáticos -->
    <VRow class="mb-4">
      <VCol cols="12" class="d-flex justify-end">
        <VBtn color="primary" @click="openNewViaticModal">Solicitar viatico</VBtn>
      </VCol>
      <VCol cols="12">
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
          </template>

          <template #item.actions="{ item }">
            <ButtonComponent v-if="item.status === 'SOLICITED'" tooltip="Editar solicitud" icon="ri-edit-line"
              @click="openEditViaticModal(item)" />
            <ButtonComponent v-if="item.status != 'SOLICITED'" icon="ri-wallet-line" tooltip="Ver mis depositos" />
            <ButtonComponent v-if="item.status === 'SOLICITED'" icon="ri-delete-bin-line" tooltip="Eliminar viatico"
              @click="deleteViatic(item.id)" />
          </template>
        </VDataTable>
      </VCol>
    </VRow>
  </div>
</template>
