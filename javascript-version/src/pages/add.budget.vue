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

const selectedViatic = ref(props.selectedViatic)
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>Agregar Presupuesto</VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12" sm="6">
            <VCard outlined>
              <VCardTitle>Viático ID: {{ selectedViatic?.id }}</VCardTitle>
              <VCardText>
                <p><strong>Empleado:</strong> {{ selectedViatic?.name }} {{ selectedViatic?.lastname }}</p>
                <p><strong>Tipo de Viático:</strong> {{ selectedViatic?.type }}</p>
                <p><strong>Cliente:</strong> {{ selectedViatic?.client_name }}</p>
                <p><strong>Proyecto:</strong> {{ selectedViatic?.proyect_name }}</p>
                <p><strong>Estado:</strong> {{ selectedViatic?.status }}</p>
              </VCardText>
            </VCard>
          </VCol>
          <VCol cols="12" sm="6">
            <VCard outlined>
              <VCardTitle>Asignar presupuesto</VCardTitle>
              <VCardText>
                <p>Aquí puedes agregar más detalles relacionados con el presupuesto.</p>
                <VAutocomplete label="Concepto"></VAutocomplete>
                <VAutocomplete label="Destino"></VAutocomplete>
                <VTextField label="Dias" type="number"></VTextField>
                <VTextField label="Monto por Dia" type="number"></VTextField>
                <VTextField label="Total" type="number" readonly></VTextField>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn text @click="addBudgetModal = false">Cancelar</VBtn>
        <VBtn color="primary" @click="addBudgetModal = false">Guardar</VBtn>
      </VCardActions>
    </VCard>
  </div>
</template>
