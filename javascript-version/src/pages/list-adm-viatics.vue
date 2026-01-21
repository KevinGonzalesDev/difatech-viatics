<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'
import { headersoliAdmviatics } from '@/imports/headerstable'
import ButtonComponent from '@/components/buttonComponent.vue'
import AuthViatic from './auth.viatic.vue'

const allviaticList = ref([])
const user = ref()


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


const authSelectedViatic = async viatic => {
  // Lógica para autorizar el viático
  AuthMode.value = 'auth'
  AuthSelectedViatic.value = viatic
  AuthViaticModal.value = true
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
        <VDataTable :items="allviaticList" :headers="headersoliAdmviatics">
          <template #item.employee_name="{ item }">
            {{ item.name }} {{ item.lastname }}
          </template>

          <template #item.project_name="{ item }">
            <div v-if="item.project_name">
              {{ item.project_name }}
            </div>
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
          </template>

          <template #item.actions="{ item }">
            <ButtonComponent icon="ri-file-settings-fill" tooltip="Configurar Solicitud de viatico" color="primary"
              @click="authSelectedViatic(item)" />

          </template>
        </VDataTable>
      </VCol>
    </VRow>

    <VDialog v-model="AuthViaticModal" max-width="600">
      <AuthViatic :mode="AuthMode" :viatic="AuthSelectedViatic" @approved="ListAllViatics"
        @close="AuthViaticModal = false" />
    </VDialog>
  </div>
</template>
