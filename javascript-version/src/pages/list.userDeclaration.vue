<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { headersDeclarationsUser } from '@/imports/headerstable'

const userDeclarationsList = ref([])
</script>

<template>
  <div>
    <VRow dense>
      <VCol cols="12" md="6">
        <h2>Declaraciones de Usuario</h2>
        <p>Aquí se mostrarán las declaraciones realizadas por los usuarios.</p>
      </VCol>
      <VCol cols="12">
        <VDataTable :headers="headersDeclarationsUser" :items="userDeclarationsList" class="elevation-1">
          <template #item.actions="{ item }">
            <VBtn icon @click="editUserDeclarationFunc(item)">
              <VIcon>mdi-pencil</VIcon>
            </VBtn>
          </template>
        </VDataTable>
      </VCol>
    </VRow>
  </div>
</template>
