<script setup>
const props = defineProps({
  viatic: {
    type: Object,
    default: () => ({}),
  },
  mode: {
    type: String,
    default: 'approved',
  },
})

const emit = defineEmits(['approved', 'close'])

import { onMounted, ref, inject } from 'vue'
import api from '@/services/api'

const snackbar = inject('snackbar')

const selectedViatic = ref(props.viatic)
const proyectsList = ref([])
const user = ref(JSON.parse(localStorage.getItem('user')))
const aproveSwitch = ref('APROBADO')
const selectedMode = ref(props.mode)

const aprovedViatic = ref({
  viaticId: selectedViatic.value.id,
  projectId: '',
  approvedBy: user.value.id, // Aquí debería ir el ID del usuario que aprueba
  approvalDate: new Date(),
})

const loadproyects = async clientId => {
  try {
    const { data } = await api.get(`proyects/client/${clientId}`)

    proyectsList.value = data.data

  } catch (err) {
    console.error(err)
    alert('No se pudo cargar los proyectos del cliente')
  }
}

const AuthSelectedViatic = async () => {
  try {
    // datos comunes
    aprovedViatic.value.viaticId = selectedViatic.value.id
    aprovedViatic.value.approvedBy = user.value.id

    // 👉 APROBAR
    if (aproveSwitch.value === 'APROBADO') {
      if (!aprovedViatic.value.projectId) {
        snackbar.value.open(
          'Debes seleccionar un proyecto para aprobar el viático',
          'warning',
        )

        return
      }

      await api.put('/viatics/aprobeviatic', aprovedViatic.value)
      snackbar.value.open('Viático aprobado correctamente', 'success')
    }

    // 👉 RECHAZAR
    else if (aproveSwitch.value === 'RECHAZADO') {
      aprovedViatic.value.projectId = null

      await api.put('/viatics/rejectviatic', aprovedViatic.value)
      snackbar.value.open('Viático rechazado correctamente', 'success')
    }

    emit('approved')
    emit('close')
  } catch (err) {
    console.error(err)
    snackbar.value.open('No se pudo procesar el viático', 'error')
  }
}

onMounted(() => {
  loadproyects(selectedViatic.value.client_id)
})

watch(
  () => props.viatic,
  viatic => {
    if (!viatic) return

    aprovedViatic.value = {
      viaticId: Number(viatic.id),
      projectId: Number(viatic.proyect_id),
      approvedBy: user.value.id,
      approvalDate: new Date(),
    }
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <VCard min-width="800">
      <VCardTitle class="text-h5">Detalles de la solicitud</VCardTitle>
      <VCardText class="pt-2">
        <VRow dense>
          <VCol cols="12" md="7">
            <VCard variant="outlined">
              <VCardTitle>Información del Viático</VCardTitle>
              <VCardText>
                <!-- {{ viatic }} -->
                <VRow dense>
                  <VCol cols="12" class="d-flex justify-space-between">
                    <VChip variant="outlined" label>
                      {{ selectedViatic.name }} {{ selectedViatic.lastname }}
                    </VChip>
                    <VChip variant="outlined" color="primary">
                      {{ selectedViatic.type }}
                    </VChip>
                  </VCol>
                  <VCol cols="12"><strong>Cliente:</strong> {{ selectedViatic.client_name }}</VCol>
                  <VCol cols="12"><strong>Ubicación:</strong> {{ selectedViatic.location_name }}</VCol>
                  <VCol cols="12" class="d-flex justify-space-between">
                    <VChip label>
                      Inicio: {{ new Date(selectedViatic.start_mov).toLocaleDateString() }}
                    </VChip>
                    <VChip label>
                      Fin: {{ new Date(selectedViatic.end_mov).toLocaleDateString() }}
                    </VChip>
                  </VCol>
                  <VCol cols="12">
                    <strong>Motivo:</strong> {{ selectedViatic.soli_reason }}
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="12" md="5">
            <VCard>
              <VCardTitle>Asignar Proyecto</VCardTitle>
              <VCardText>
                <VRow>
                  <VCol cols="12">
                    <!-- {{ aprovedViatic }} -->
                    <VSwitch :label="aproveSwitch" v-model="aproveSwitch" false-value="RECHAZADO" true-value="APROBADO"
                      hide-details>
                    </VSwitch>
                  </VCol>
                  <VCol cols="12">
                    <VAutocomplete v-if="aproveSwitch === 'APROBADO'" v-model="aprovedViatic.projectId"
                      :items="proyectsList" item-title="name" item-value="id" label="Selecciona un proyecto">
                      <template v-slot:item="{ props, item }">
                        <VListItem v-bind="props" :subtitle="item.raw.cost_center_code" :title="item.raw.name" />
                      </template>
                    </VAutocomplete>
                  </VCol>
                </VRow>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn color="primary" @click="AuthSelectedViatic">Actualizar estado</VBtn>
        <VBtn color="primary" @click="emit('close')">Cerrar</VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
