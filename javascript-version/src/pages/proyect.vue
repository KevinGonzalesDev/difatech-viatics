<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'
import { headersProyects, headersClients, headersUbications, groupUbications } from '@/imports/headerstable'
import ButtonComponent from '@/components/buttonComponent.vue'

import AddClient from './add.client.vue'
import AddUbication from './add.ubication.vue'
import AddProyect from './add.proyect.vue'



// variables de estado de modal de cliente
const showClientModal = ref(false)
const selectedClient = ref(null)
const modeClientModal = ref('create') // 'create' o 'edit'

// variables de estado de modal de ubicaciones
const showUbicationModal = ref(false)
const selectedUbication = ref(null)
const modeUbicationModal = ref('create') // 'create' o 'edit'

// variables de estado de modal de proyecto
const showProyectModal = ref(false)
const selectedProyect = ref(null)
const modeProyectModal = ref('create') // 'create' o 'edit'


// variables de listas de datos
const clients = ref([])
const ubications = ref([])
const proyects = ref([])



// funciones de listado iniciales
const listClients = async () => {
  try {
    const { data } = await api.get('proyects/clients')

    clients.value = data.data
  } catch (error) {
    console.error('Error fetching clients:', error)
  }
}

const loadUbications = async () => {
  try {
    const { data } = await api.get('/proyects/ubications')

    ubications.value = data.data
  } catch (error) {
    console.error('Error fetching ubicaciones:', error)
  }
}

const listProyects = async () => {
  try {
    const { data } = await api.get('/proyects')

    proyects.value = data.data
  } catch (err) {
    console.error(err)
  }
}



// funciones de acciones de modals

const addClientFunc = () => {
  showClientModal.value = true
  selectedClient.value = null
  modeClientModal.value = 'create'
}

const editClientFunc = (client) => {
  selectedClient.value = client
  showClientModal.value = true
  modeClientModal.value = 'edit'
}

const addUbicationFunc = () => {
  showUbicationModal.value = true
  selectedUbication.value = null
  modeUbicationModal.value = 'create'
}

const editUbicationFunc = (ubication) => {
  selectedUbication.value = ubication
  showUbicationModal.value = true
  modeUbicationModal.value = 'edit'
}

const addProyectFunc = () => {
  showProyectModal.value = true
  selectedProyect.value = null
  modeProyectModal.value = 'create'
}

const editProyectFunc = (proyect) => {
  selectedProyect.value = proyect
  showProyectModal.value = true
  modeProyectModal.value = 'edit'
}


// activadores y desactivadores de estados
const desactivateClient = async (id, active) => {
  try {
    await api.put(`/proyects/clients/desactivate/${id}`, { active: !active })

    alert(`Cliente ${!active ? 'activado' : 'desactivado'} con exito`)
    await listClients()
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el estado del cliente')
  }
}

const desactivateUbication = async (id, active) => {
  try {
    await api.put(`/proyects/ubications/desactivate/${id}`, { active: !active })

    alert(`Ubicación ${!active ? 'activada' : 'desactivada'} con exito`)
    await loadUbications()
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el estado de la ubicación')
  }
}

const desactivateProyect = async (id, active) => {
  try {
    await api.put(`/proyects/desactivate/${id}`, { active: !active })

    alert(`Proyecto ${!active ? 'activado' : 'desactivado'} con exito`)
    await listProyects()
  } catch (err) {
    console.error(err)
    alert('No se pudo actualizar el estado del proyecto')
  }
}


// funciones para eliminar
const deleteClientFunc = async (id) => {
  // lógica para eliminar Cliente
  const confirmed = await confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer.')

  if (!confirmed) return

  try {
    await api.delete(`/proyects/clients/${id}`)

    alert('Cliente eliminado con éxito')
    await listClients()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar el cliente')
  }
}

const deleteUbication = async (id) => {
  // lógica para eliminar Ubicación
  const confirmed = await confirm('¿Estás seguro de que deseas eliminar esta ubicación? Esta acción no se puede deshacer.')

  if (!confirmed) return

  try {
    await api.delete(`/proyects/ubications/${id}`)

    alert('Ubicación eliminada con éxito')
    await loadUbications()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar la ubicación')
  }
}

const deleteProyectFunc = async (id) => {
  // lógica para eliminar Proyecto
  const confirmed = await confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')

  if (!confirmed) return

  try {
    await api.delete(`/proyects/${id}`)

    alert('Proyecto eliminado con éxito')
    await listProyects()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar el proyecto')
  }
}












onMounted(() => {
  listClients()
  loadUbications()
  listProyects()
})
</script>

<template>
  <div>
    <VRow class="mb-4">
      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between">
            <span class="text-h4">Gestión de Clientes y Proyectos</span>
            <ButtonComponent icon="ri-add-circle-line" @click="addProyectFunc" />
          </VCardTitle>
          <VCardText>
            <VDataTable :headers="headersProyects" :items="proyects">
              <template v-slot:item.active="{ item }">
                <VChip :color="item.active ? 'primary' : 'grey'">
                  {{ item.active ? 'Activo' : 'Inactivo' }}
                </VChip>
              </template>
              <template v-slot:item.actions="{ item }">
                <ButtonComponent icon="ri-pencil-line" tooltip="Editar proyecto" @click="editProyectFunc(item)" />
                <ButtonComponent :icon="item.active ? 'ri-toggle-fill' : 'ri-toggle-line'"
                  @click="desactivateProyect(item.id, item.active)" />
                <ButtonComponent icon="ri-delete-bin-6-line" @click="deleteProyectFunc(item.id)" />
              </template>
            </VDataTable>
          </VCardText>
        </VCard>
      </VCol>
      <!-- seccion de cliente -->
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle class="d-flex justify-space-between">
            <span class="text-h5">Listado de clientes</span>
            <ButtonComponent icon="ri-add-circle-line" @click="addClientFunc" />
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VDataTable :headers="headersClients" :items="clients" class="elevation-1">
                  <template #item.active="{ item }">
                    <VChip :color="item.active ? 'primary' : 'grey'">
                      {{ item.active ? 'Activo' : 'Inactivo' }}
                    </VChip>
                  </template>

                  <template #item.actions="{ item }">
                    <ButtonComponent icon="ri-pencil-line" @click="editClientFunc(item)" />
                    <ButtonComponent :icon="item.active ? 'ri-toggle-fill' : 'ri-toggle-line'"
                      @click="desactivateClient(item.id, item.active)" />
                    <ButtonComponent icon="ri-delete-bin-6-line" @click="deleteClientFunc(item.id)" />
                  </template>
                </VDataTable>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      <!-- seccion de ubicaciones -->
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="d-flex justify-space-between">
            <span class="text-h5">Listado de sedes</span>
            <ButtonComponent icon="ri-add-circle-line" @click="addUbicationFunc" />
          </VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VDataTable :group-by="groupUbications" :headers="headersUbications" :items="ubications"
                  class="elevation-1">
                  <template #item.active="{ item }">
                    <VChip :color="item.active ? 'primary' : 'grey'">
                      {{ item.active ? 'Activo' : 'Inactivo' }}
                    </VChip>
                  </template>

                  <template #item.actions="{ item }">
                    <ButtonComponent icon="ri-pencil-line" @click="editUbicationFunc(item)" />
                    <ButtonComponent :icon="item.active ? 'ri-toggle-fill' : 'ri-toggle-line'"
                      @click="desactivateUbication(item.id, item.active)" />
                    <ButtonComponent icon="ri-delete-bin-6-line" @click="deleteUbication(item.id)" />
                  </template>
                </VDataTable>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- modal de cliente -->
    <VDialog v-model="showClientModal" max-width="500">
      <AddClient :mode="modeClientModal" :client="selectedClient" @close="showClientModal = false"
        @saved="listClients" />
    </VDialog>

    <!-- modal de ubicacion -->
    <VDialog v-model="showUbicationModal" max-width="500">
      <AddUbication :mode="modeUbicationModal" :ubication="selectedUbication" @close="showUbicationModal = false"
        @saved="loadUbications" />
    </VDialog>

    <!-- modal de proyecto -->
    <VDialog v-model="showProyectModal" max-width="800">
      <AddProyect :mode="modeProyectModal" :proyect="selectedProyect" @close="showProyectModal = false"
        @saved="listProyects" />
    </VDialog>
  </div>
</template>
