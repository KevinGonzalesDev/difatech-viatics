<script setup>
const props = defineProps({
  icon: { type: String, required: true },
  tooltip: { type: String, default: '' },
  color: { type: String, default: 'primary' },
  size: { type: String, default: 'small' },
  variant: { type: String, default: 'text' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])

const onClick = e => {
  if (!props.disabled) emit('click', e)
}
</script>

<template>
  <VTooltip v-if="tooltip" location="top">
    <template #activator="{ props: tooltipProps }">
      <VBtn v-bind="tooltipProps" :icon="icon" :color="color" :size="size" :variant="variant" :disabled="disabled"
        @click="onClick" />
    </template>
    <span>{{ tooltip }}</span>
  </VTooltip>

  <!-- Sin tooltip -->
  <VBtn v-else :icon="icon" :color="color" :size="size" :variant="variant" :disabled="disabled" @click="onClick" />
</template>
