<script setup>
defineProps({
  headers: Array,
  items: Array,
  loading: Boolean,
  tabletitle: String,
  itemKey: {
    type: String,
    default: 'id'
  },
})
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12">
        <h2 class="text-h5 font-weight-medium mb-4">
          {{ tabletitle }}
        </h2>
      </VCol>
      <VCol cols="12">
        <VDataTable :headers="headers" :items="items" :loading="loading" :item-key="itemKey"
          class="elevation-1 custom-table">
          <!-- Slot dinámico para cualquier columna -->
          <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
            <slot :name="slotName" v-bind="slotProps" />
          </template>

          <!-- Estado vacío -->
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
  </div>
</template>

<style scoped>
.custom-table {
  border-radius: 12px;
}
</style>
