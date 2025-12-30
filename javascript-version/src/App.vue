<script setup>
import { provide, ref } from 'vue'
import ConfirmDialog from '@/components/modalComponent.vue'

const confirmDialog = ref(null)


provide('confirm', (options) => {
  return confirmDialog.value.open(options)
})
</script>

<template>
  <VApp>
    <RouterView />
    <ConfirmDialog ref="confirmDialog" />
  </VApp>
</template>
