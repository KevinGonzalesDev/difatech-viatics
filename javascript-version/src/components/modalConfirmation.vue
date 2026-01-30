<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: 'Confirmar acción',
  },
  message: {
    type: String,
    default: '¿Estás seguro de continuar?',
  },
  confirmText: {
    type: String,
    default: 'Sí',
  },
  cancelText: {
    type: String,
    default: 'No',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialog = ref(props.modelValue)

watch(
  () => props.modelValue,
  val => dialog.value = val,
)

const close = () => {
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
  close()
}
</script>

<template>
  <VDialog v-model="dialog" max-width="420" persistent>
    <VCard>
      <VCardTitle class="text-h6">
        {{ title }}
      </VCardTitle>

      <VCardText>
        {{ message }}
      </VCardText>

      <VCardActions class="justify-end">
        <VBtn variant="text" @click="close">
          {{ cancelText }}
        </VBtn>

        <VBtn color="primary" :loading="loading" @click="confirm">
          {{ confirmText }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>
