<script setup>
const props = defineProps({
  employee: {
    type: Object,
    default: null,
  },
})

import AccountSettingsAccount from '@/views/pages/account-settings/AccountSettingsAccount.vue'
import AccountSettingsNotification from '@/views/pages/account-settings/AccountSettingsNotification.vue'
import AccountSettingsSecurity from '@/views/pages/account-settings/AccountSettingsSecurity.vue'
import AddUser from './add-user.vue'
import ListUserBank from './list-user-bank.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  {
    title: 'Información',
    icon: 'ri-group-line',
    tab: 'account',
  },
  {
    title: 'Cuentas',
    icon: 'ri-lock-line',
    tab: 'security',
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
        <AddUser :employee="employee" />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <ListUserBank :employee="employee" />
      </VWindowItem>
    </VWindow>
  </div>
</template>
