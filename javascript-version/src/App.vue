<script setup>
import { provide, ref } from 'vue'
import ConfirmDialog from '@/components/modalComponent.vue'
import AppSnackbar from '@/components/Appsnackbar.vue'

const confirmDialog = ref(null)
const snackbar = ref(null)

provide('snackbar', snackbar)

provide('confirm', (options) => {
  return confirmDialog.value.open(options)
})
</script>

<template>
  <VApp>
    <RouterView />
    <ConfirmDialog ref="confirmDialog" />
    <AppSnackbar ref="snackbar" />
  </VApp>
</template>
