import { inject } from 'vue'

export function useConfirm() {
    const confirm = inject('confirm')

    if (!confirm) {
        throw new Error('ConfirmDialog no está registrado en App.vue')
    }

    return confirm
}
