<script setup>
import { ref } from 'vue'

const concepts = ref([
  { id: 1, description: 'Concepto 1' },
  { id: 2, description: 'Concepto 2' },
  { id: 3, description: 'Concepto 3' },
])
</script>

<template>
  <div>
    <VCard>
      <VCardTitle>Lista de Conceptos</VCardTitle>
      <VCardText>
        <VList>
          <VListItem v-for="concept in concepts" :key="concept.id">
            <VListItemContent>
              <VListItemTitle>{{ concept.description }}</VListItemTitle>
            </VListItemContent>
          </VListItem>
        </VList>
      </VCardText>
    </VCard>
  </div>
</template>
