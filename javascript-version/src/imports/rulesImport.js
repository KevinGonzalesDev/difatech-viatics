
export const required = v => !!v || 'Este campo es obligatorio'
export const requiredObject = v =>
    (v && typeof v === 'object') || 'Debe seleccionar una opción'
