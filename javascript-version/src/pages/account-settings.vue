<script setup>
import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue'
import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue'
import AccountSettingsSecurity from '@/views/pages/account-settings/AccountSettingsSecurity.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  {
    title: 'Account',
    icon: 'ri-group-line',
    tab: 'account',
  },
  {
    title: 'Security',
    icon: 'ri-lock-line',
    tab: 'security',
  },
  {
    title: 'Notifications',
    icon: 'ri-notification-3-line',
    tab: 'notification',
  },
]

import { ref } from 'vue'

// const search = ref('')
const headers = [
  {
    align: 'start',
    key: 'dni',
    sortable: false,
    title: 'DNI',
  },
  { key: 'name', title: 'Nombres' },
  { key: 'area', title: 'Area' },
  { key: 'puesto', title: 'Puesto' },
  { key: 'rol', title: 'Rol' },
  { key: 'correo', title: 'Correo' },
  { key: 'actions', title: 'Actions' },
]
const items = [
  {
    dni: 73497200,
    name: 'Kevin Piero Gonzales Marin',
    area: 'Sistemas y Tecnologia',
    puesto: 'Desarrollador',
    rol: 'Admin',
    correo: 'kevinpiero00@gmail.com',
  },
  {
    dni: 73497200,
    name: 'Kevin Piero Gonzales Marin',
    area: 'Sistemas y Tecnologia',
    puesto: 'Desarrollador',
    rol: 'Admin',
    correo: 'kevinpiero00@gmail.com',
  },
]
</script>

<template>
  <div>


    <VTabs v-model="activeTab" show-arrows class="v-tabs-pill">
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition" :touch="false">
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="notification">
        <AccountSettingsNotification />
      </VWindowItem>
    </VWindow>
  </div>
</template>
