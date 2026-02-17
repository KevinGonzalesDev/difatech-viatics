<script setup>
const props = defineProps({
  viatic: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['loaded', 'close'])

import { ref, onMounted } from 'vue'
import api from '@/services/api'
import ButtonComponent from '@/components/buttonComponent.vue'
import ConfirmDialog from '@/components/modalConfirmation.vue'
import BaseDatatable from '@/components/BaseDatatable.vue'
import { useSnackbar } from '@/composables/useSnackbar.js'
import { VDateInput } from 'vuetify/labs/VDateInput'
import {
  headersLiquidationsUser,
  headersMovilityUser,
  headersDDJJAlimUser,
  headersDDJJMovUser,
} from '@/imports/headerstable'
import AddDeclare from './add.declare.vue'

const snackbar = useSnackbar()
const viaticDetails = ref(null)
const viaticItemsLiquidation = ref([])
const viaticItemsMovility = ref([])
const viaticItemsAliDeclaration = ref([])
const viaticItemsMovDeclaration = ref([])

const showDeclareModal = ref(false)
const modeDeclareModal = ref('create') // 'create' o 'edit'
const selectedDeclareViatic = ref(null)
const selectedViatic = ref(null)

const declareIdToDelete = ref(null)
const showConfirm = ref(false)

const Dateformsatatus = ref(false)

const formDate = ref({
  fechaSalida: null,
  fechaLlegada: null,
})



const addDeclareFunc = () => {
  showDeclareModal.value = true
  modeDeclareModal.value = 'create'
  selectedViatic.value = props.viatic
}

const editDeclareFunc = (item) => {
  showDeclareModal.value = true
  modeDeclareModal.value = 'edit'
  selectedViatic.value = props.viatic
  selectedDeclareViatic.value = item
}

const loadViaticDetails = async () => {
  try {
    const { data } = await api.get(`/decviatics/detail/${props.viatic}`)

    viaticDetails.value = data.data

  } catch (error) {
    console.error('Error loading viatic details:', error)
  }
}

const loadViaticItems = async () => {
  try {
    const { data } = await api.get(`/decviatics/items/${props.viatic}`)

    viaticItemsLiquidation.value = data.data.filter(item => item.document_type === 'LIQUIDACION')
    viaticItemsMovility.value = data.data.filter(item => item.document_type === 'MOVILIDAD')
    viaticItemsAliDeclaration.value = data.data.filter(item => item.document_type === 'DECLARACION_JURADA' && item.optionobject.category === 'ALIMENTACION')
    viaticItemsMovDeclaration.value = data.data.filter(item => item.document_type === 'DECLARACION_JURADA' && item.optionobject.category === 'MOVILIDAD')

  } catch (error) {
    console.error('Error loading viatic items:', error)
  }
}

// functioons de eliminacion de declaracion

const openDeleteDeclareConfirm = (declareId) => {
  declareIdToDelete.value = declareId
  showConfirm.value = true
}

const editDateviaticFunc = async () => {
  try {
    const payload = {
      viaticId: Number(props.viatic),
      fechaSalida: formDate.value.fechaSalida,
      fechaLlegada: formDate.value.fechaLlegada,
    }

    console.log('payload enviado:', payload)

    await api.put(`/decviatics/editdates/`, payload)
    snackbar.open('fecha actualizada exitosamente', 'success')

    loadViaticDetails()
  } catch (error) {
    console.error('Error updating viatic dates:', error)
    snackbar.open('No se pudieron actualizar las fechas del viaje', 'error')
  }
}



const deleteDeclareFunc = async () => {
  try {
    await api.delete('/decviatics/expenses/' + declareIdToDelete.value)
    alert('Gasto eliminado correctamente')
    loadViaticItems()
  } catch (err) {
    console.error(err)
    alert('No se pudo eliminar el gasto')
  }
}


onMounted(() => {
  loadViaticDetails()
  loadViaticItems()
})
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" class="d-flex justify-start">
        <VBtn prepend-icon="ri-arrow-left-circle-fill" color="primary" @click="emit('close')">
          Volver
        </VBtn>
      </VCol>
      <VCol cols="12">
        <span class="text-h5 d-flex justify-center text-high-emphasis">
          Detalles de la Declaración
        </span>
      </VCol>
      <VCol cols="12" md="8">
        <VCard>
          <VCardTitle class="text-h5">
            Información del viaje
          </VCardTitle>
          <VCardText>
            <strong>N° DE VIAJE : </strong>
            {{ viaticDetails?.viatic_code }}
            <br>
            <strong>CODIGO DEL PROYECTO : </strong>{{ viaticDetails?.cost_center }} <br>
            <strong>NOMBRES Y APELLIDOS : </strong>{{ viaticDetails?.user_name }} {{
              viaticDetails?.user_lastname }} <br>
            <strong>CODIGO TRABAJADOR : </strong>{{ viaticDetails?.user_dni }} <br>
            <strong>AREA : </strong>{{ viaticDetails?.user_area }} <br>
            <strong>MOTIVO : </strong>{{ viaticDetails?.proyect_name }} <br>
            <strong>LUGAR : </strong> {{ viaticDetails?.location_name }}
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard>
          <VCardTitle class="text-h5 d-flex justify-space-between">
            Fechas del viaje
            <ButtonComponent icon="ri-edit-line" tooltip="Editar fechas del viaje" color="primary"
              @click="Dateformsatatus = !Dateformsatatus" />
          </VCardTitle>
          <VCardText>
            <strong>FECHA DE INICIO : </strong>
            {{ viaticDetails?.viatic_start ? new Date(viaticDetails.viatic_start).toLocaleDateString() : '' }}
            <br>
            <strong>FECHA DE FIN : </strong>
            {{ viaticDetails?.viatic_end ? new Date(viaticDetails.viatic_end).toLocaleDateString() : '' }} <br>
            <strong>FECHA LLEGADA PROVINCIA : </strong>
            <VDateInput v-if="Dateformsatatus" v-model="formDate.fechaLlegada" prepend-icon=""
              prepend-inner-icon="$calendar" variant="solo" />
            <span v-else>
              {{ viaticDetails?.fecha_llegada ? new Date(viaticDetails.fecha_llegada).toLocaleDateString() : '' }}
            </span>
            <br>
            <strong>FECHA SALIDA PROVINCIA : </strong>
            <VDateInput v-if="Dateformsatatus" v-model="formDate.fechaSalida" prepend-icon=""
              prepend-inner-icon="$calendar" variant="solo" />
            <span v-else>
              {{ viaticDetails?.fecha_salida ? new Date(viaticDetails.fecha_salida).toLocaleDateString() : '' }}
            </span>
            <br>
          </VCardText>
          <VCardActions class="d-flex justify-end">
            <ButtonComponent v-if="Dateformsatatus" icon="ri-save-fill" tooltip="Guardar fechas del viaje"
              color="primary" @click="editDateviaticFunc" />
          </VCardActions>
        </VCard>
      </VCol>
      <VCol cols="12" class="d-flex justify-end">
        <VBtn title="" @click="addDeclareFunc">
          Agregar gasto
        </VBtn>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <BaseDatatable tabletitle="LIQUIDACION" :headers="headersLiquidationsUser" :items="viaticItemsLiquidation">
              <template #item.option_name="{ item }">
                {{ item.optionobject ? item.optionobject.label : '' }}
              </template>
              <template #item.expense_date="{ item }">
                {{ item.expense_date ? new Date(item.expense_date).toLocaleDateString() : '' }}
              </template>

              <template #item.amount="{ item }">
                $ {{ item.amount }}
              </template>

              <template #item.actions="{ item }">
                <ButtonComponent icon="ri-edit-line" tooltip="Editar gasto" color="primary"
                  @click="editDeclareFunc(item)" />

                <ButtonComponent icon="ri-delete-bin-6-line" tooltip="Eliminar gasto" color="primary"
                  @click="openDeleteDeclareConfirm(item.id)" />
              </template>
            </BaseDatatable>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard>
          <VCardText>
            <BaseDatatable tabletitle="MOVILIDAD LIMA" :headers="headersMovilityUser" :items="viaticItemsMovility">
              <!-- Aquí puedes agregar los detalles adicionales de la declaración -->
              <template #item.option_name="{ item }">
                {{ item.optionobject ? item.optionobject.label : '' }}
              </template>

              <template #item.expense_date="{ item }">
                {{ item.expense_date ? new Date(item.expense_date).toLocaleDateString() : '' }}
              </template>

              <template #item.amount="{ item }">
                $ {{ item.amount }}
              </template>
              <template #item.actions="{ item }">
                <ButtonComponent icon="ri-edit-line" tooltip="Editar gasto" color="primary"
                  @click="editDeclareFunc(item)" />
                <ButtonComponent icon="ri-delete-bin-6-line" tooltip="Eliminar gasto" color="primary"
                  @click="openDeleteDeclareConfirm(item.id)" />
              </template>
            </BaseDatatable>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard>
          <VCardTitle class="d-flex justify-space-between">
            DECLARACION JURADA
          </VCardTitle>
          <VCardText>
            <BaseDatatable tabletitle="ALIMENTACION" :headers="headersDDJJAlimUser" :items="viaticItemsAliDeclaration">
              <!-- Aquí puedes agregar los detalles adicionales de la declaración -->
              <template #item.option_name="{ item }">
                {{ item.optionobject ? item.optionobject.label : '' }}
              </template>

              <template #item.expense_date="{ item }">
                {{ item.expense_date ? new Date(item.expense_date).toLocaleDateString() : '' }}
              </template>
              <template #item.amount="{ item }">
                $ {{ item.amount }}
              </template>
              <template #item.actions="{ item }">
                <ButtonComponent icon="ri-edit-line" tooltip="Editar gasto" color="primary"
                  @click="editDeclareFunc(item)" />
                <ButtonComponent icon="ri-delete-bin-6-line" tooltip="Eliminar gasto" color="primary"
                  @click="openDeleteDeclareConfirm(item.id)" />
              </template>
            </BaseDatatable>
            <BaseDatatable tabletitle="MOVILIDAD" :headers="headersDDJJMovUser" :items="viaticItemsMovDeclaration">
              <!-- Aquí puedes agregar los detalles adicionales de la declaración -->
              <template #item.expense_date="{ item }">
                {{ item.expense_date ? new Date(item.expense_date).toLocaleDateString() : '' }}
              </template>

              <template #item.amount="{ item }">
                $ {{ item.amount }}
              </template>
              <template #item.actions="{ item }">
                <ButtonComponent icon="ri-edit-line" tooltip="Editar gasto" color="primary"
                  @click="editDeclareFunc(item)" />

                <ButtonComponent icon="ri-delete-bin-6-line" tooltip="Eliminar gasto" color="primary"
                  @click="openDeleteDeclareConfirm(item.id)" />
              </template>
            </BaseDatatable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VDialog v-model="showDeclareModal" max-width="800px">
      <AddDeclare :mode="modeDeclareModal" :viatic="selectedViatic" :item="selectedDeclareViatic"
        @saved="loadViaticItems" @close="showDeclareModal = false" />
    </VDialog>

    <ConfirmDialog v-model="showConfirm" title="Eliminar depósito"
      message="Esta acción no se puede deshacer. ¿Deseas continuar?" confirm-text="Sí, eliminar" cancel-text="No"
      @confirm="deleteDeclareFunc" />
  </div>
</template>
