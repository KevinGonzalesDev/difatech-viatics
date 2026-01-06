<script setup>
import api from '@/services/api'

const props = defineProps({
  employee: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['saved', 'cancel'])
import avatar1 from '@images/avatars/avatar-1.png'




const accountDataLocal = ref({
  id: null,
  first_name: '',
  last_name: '',
  dni: '',
  position: '',
  firm_position: '',
  area: '',
  phone: '',
  email: '',
  password: '',
  active: true,
  avatar_img: avatar1, // preview
  avatarFile: null,   // archivo real
})





const refInputEl = ref()
const isPasswordVisible = ref(false)

// const isAccountDeactivated = ref(false)



const changeAvatar = e => {
  const file = e.target.files[0]
  if (!file) return

  accountDataLocal.value.avatarFile = file

  const reader = new FileReader()
  reader.onload = () => {
    accountDataLocal.value.avatar_img = reader.result
  }
  reader.readAsDataURL(file)
}

// reset avatar image
const resetAvatar = () => {
  accountDataLocal.value.avatar_img = avatar1
}

const positions = [
  'TECNICO DE INSTRUMENTACIÓN Y CONTROL',
  'TECNICO DE INSTRUMENTACIÓN Y CONTROL JUNIOR',
  'INGENIERO DE INSTRUMENTACIÓN Y CONTROL',
  'JEFE DE OPERACIONES Y COMERCIAL',
  'SUPERVISOR SSOMA',
  'INGENIERO COMERCIAL',
  'PROGRAMADOR DE APLICACIONES IOT',
  'INGENIERO DE APLICACIONES IOT',
  'PRACTICANTE DE INSTRUMENTACION Y CONTROL',
  'ASISTENTE LOGISTICO',
  'ASISTENTE ADMINISTRATIVO',
]

const selectarea = [
  'OPERACIONES',
  'SSOMA',
  'COMERCIAL',
  'LOGISTICA',
  'ADMINISTRACION',
]

const guardarEmpleado = async () => {
  try {
    const isEdit = !!accountDataLocal.value.id

    const url = isEdit
      ? `/employee/${accountDataLocal.value.id}`
      : '/employee/account'

    const form = new FormData()

    Object.entries(accountDataLocal.value).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== '' &&
        key !== 'avatar_img' &&
        key !== 'avatarFile'
      ) {
        form.append(key, value)
      }
    })

    if (accountDataLocal.value.avatarFile) {
      form.append('avatar', accountDataLocal.value.avatarFile)
    }

    const res = isEdit
      ? await api.put(url, form)
      : await api.post(url, form)

    emit('saved')

    return res.data

  } catch (err) {
    console.error(err)

    const message =
      err.response?.data?.error ||
      err.response?.data?.message ||
      'Error al guardar empleado'

    alert(message)
  }
}



watch(
  () => props.employee,
  emp => {
    if (!emp) return

    accountDataLocal.value = {
      ...accountDataLocal.value,
      ...emp,
      avatar_img: emp.avatar_img
        ? `http://localhost:3000${emp.avatar_img}`
        : avatar1,
      avatarFile: null,
    }
  },
  { immediate: true }
)
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Detalles de la cuenta">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar rounded="lg" size="100" class="me-6" :image="accountDataLocal.avatar_img" />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-5">
            <div class="d-flex flex-wrap gap-2">
              <VBtn color="primary" @click="refInputEl?.click()">
                <VIcon icon="ri-upload-cloud-line" class="d-sm-none" />
                <span class="d-none d-sm-block">Subir foto</span>
              </VBtn>

              <input ref="refInputEl" type="file" name="avatar" accept=".jpeg,.png,.jpg" hidden @change="changeAvatar">

              <VBtn type="reset" color="error" variant="outlined" @click="resetAvatar">
                <span class="d-none d-sm-block">Reset</span>
                <VIcon icon="ri-refresh-line" class="d-sm-none" />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Avatar JPG or PNG. tamano maximo de 800K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText>
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol md="6" cols="12">
                <VTextField v-model="accountDataLocal.first_name" placeholder="Sideral" label="Nombres" />
              </VCol>

              <VCol md="6" cols="12">
                <VTextField v-model="accountDataLocal.last_name" placeholder="Sideral" label="Apellidos" />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol md="6" cols="12">
                <VTextField v-model="accountDataLocal.dni" placeholder="8 Digitos" label="DNI" />
              </VCol>

              <VCol cols="12" md="6">
                <VSelect v-model="accountDataLocal.position" label="Puesto"
                  placeholder="Seleccione su puesto de trabajo" :items="positions" />
              </VCol>


              <VCol md="6" cols="12">
                <VTextField v-model="accountDataLocal.firm_position" placeholder="8 Digitos" label="Firma del puesto" />
              </VCol>

              <VCol md="6" cols="12">
                <VSelect v-model="accountDataLocal.area" label="Area" placeholder="Seleccione su area de trabajo"
                  :items="selectarea" />
              </VCol>
              <!-- 👉 Phone -->
              <VCol cols="12" md="6">
                <VTextField v-model="accountDataLocal.phone" label="Numero de telefono" placeholder="+51 987 654 321" />
              </VCol>
              <!-- 👉 Email -->
              <VCol cols="12" md="6">
                <VTextField v-model="accountDataLocal.email" label="E-mail" placeholder="jose@gmail.com" type="email" />
              </VCol>

              <VCol cols="12" md="6">
                <VTextField v-model="accountDataLocal.password" label="Nueva contrasena (opcional)"
                  placeholder="dejar vacio para mantener la actual" :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="password" :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />
              </VCol>

              <VCol cols="12" md="6">
                <VCheckbox v-model="accountDataLocal.active" label="La cuenta estara activa?" />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn @click="guardarEmpleado">Guardar</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
