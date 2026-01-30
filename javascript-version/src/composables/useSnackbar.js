import { inject } from 'vue'

export const useSnackbar = () => {
    return inject('snackbar')
}
