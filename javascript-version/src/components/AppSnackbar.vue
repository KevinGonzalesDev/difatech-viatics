<script setup>
import { ref } from 'vue'

const show = ref(false)
const text = ref('')
const color = ref('success')

const open = (message, type = 'success') => {
  text.value = message
  color.value = type
  show.value = true
}

defineExpose({ open })
</script>

<template>
  <VSnackbar v-model="show" :color="color" timeout="3000" location="top right">
    {{ text }}
  </VSnackbar>
</template>
