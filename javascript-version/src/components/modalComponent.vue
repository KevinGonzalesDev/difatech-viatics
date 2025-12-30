<template>
  <v-dialog v-model="isOpen" max-width="420">
    <v-card>
      <v-card-title class="text-h6">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="cancel">
          No
        </v-btn>

        <v-btn color="red" variant="flat" @click="confirm">
          Sí
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const title = ref('')
const message = ref('')
let resolver = null

function open(options) {
  title.value = options.title ?? 'Confirmar'
  message.value = options.message ?? '¿Estás seguro?'
  isOpen.value = true

  return new Promise(resolve => {
    resolver = resolve
  })
}

function confirm() {
  isOpen.value = false
  resolver(true)
}

function cancel() {
  isOpen.value = false
  resolver(false)
}

defineExpose({ open })
</script>
