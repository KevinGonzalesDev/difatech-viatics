<script setup>
import { provide, ref } from 'vue'
import ConfirmDialog from '@/components/modalComponent.vue'
import AppSnackbar from '@/components/Appsnackbar.vue'

const confirmDialog = ref(null)
const snackbarRef = ref(null)

// ✅ Snackbar global
provide('snackbar', {
  open: (message, type = 'success') => {
    snackbarRef.value?.open(message, type)
  },
})

// ✅ Confirm dialog global
provide('confirm', (options) => {
  return confirmDialog.value.open(options)
})
</script>

<template>
  <VApp>
    <RouterView />

    <!-- Global components -->
    <ConfirmDialog ref="confirmDialog" />
    <AppSnackbar ref="snackbarRef" />
  </VApp>
</template>
