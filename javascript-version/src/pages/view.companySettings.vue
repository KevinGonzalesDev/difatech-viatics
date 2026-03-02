<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import AddCompany from './add.company.vue'
import AddBankAccountAdm from './add.bankAccountAdm.vue'
import ButtonComponent from '@/components/buttonComponent.vue'



const Liscompanies = ref([])
const search = ref('')
const page = ref(1)
const itemsPerPage = ref(4)

// variables de estado para el modal de empresa
const showCompanyModal = ref(false)
const selectedCompany = ref(null)
const modeCompanyModal = ref('create') // 'create' o 'edit'

// variables de estado para el modal de cuentas
const showAccountModal = ref(false)
const selectedCompanyForAccount = ref(null)
const selectedAccount = ref(null)
const modeAccountModal = ref('create') // 'create' o 'edit'

const addDataCompanyFunc = () => {
  showCompanyModal.value = true
  modeCompanyModal.value = 'create'
  selectedCompany.value = null
}

const editDataCompanyFunc = (company) => {
  showCompanyModal.value = true
  modeCompanyModal.value = 'edit'
  selectedCompany.value = company
}

const addAccountFunc = (companyId) => {
  showAccountModal.value = true
  modeAccountModal.value = 'create'
  selectedCompanyForAccount.value = companyId
}

const editAccountFunc = (account) => {
  showAccountModal.value = true
  modeAccountModal.value = 'edit'
  selectedAccount.value = account
}


const loadAllCompanies = async () => {
  try {
    const response = await api.get('/companies')

    Liscompanies.value = response.data.data
  } catch (error) {
    console.error('Error fetching companies:', error)
  }
}

onMounted(() => {
  loadAllCompanies()
})
</script>

<template>
  <div>
    <VRow>
      <VCol cols="12" class="d-flex justify-end">
        <VBtn color="primary" @click="addDataCompanyFunc">
          Agregar empresa
        </VBtn>
      </VCol>

      <VCol cols="12">
        <VDataIterator :items="Liscompanies" v-model:page="page" :items-per-page="itemsPerPage" :search="search">
          <template #default="{ items }">
            <VRow>
              <VCol v-for="company in items" :key="company.raw.id" cols="12" md="6">
                <VCard>
                  <!-- Header del distrito -->
                  <VCardTitle class="d-flex justify-space-between align-center">
                    <span class="text-h6">
                      {{ company.raw.short_name }} ({{ company.raw.ruc }})
                    </span>
                    <ButtonComponent icon="ri-edit-line" tooltip="Editar empresa" color="primary"
                      @click="editDataCompanyFunc(company.raw)" />
                  </VCardTitle>
                  <VDivider />
                  <VCardText>
                    <VRow dense>
                      <VCol cols="12">
                        Detalles de la empresa
                      </VCol>
                      <VCol cols="12">
                        <VList density="compact">
                          <!-- {{ Detalles de la empresa }} -->
                          <VListItem>
                            <VListItemTitle>
                              RAZON SOCIAL
                            </VListItemTitle>
                            <VListItemSubtitle>
                              {{ company.raw.name }}
                            </VListItemSubtitle>
                            <VListItemTitle>
                              DIRECCIÓN
                            </VListItemTitle>
                            <VListItemSubtitle>
                              {{ company.raw.address }}
                            </VListItemSubtitle>
                            <VListItemTitle>
                              TELÉFONO
                            </VListItemTitle>
                            <VListItemSubtitle>
                              {{ company.raw.phone }}
                            </VListItemSubtitle>
                            <VListItemTitle>
                              CORREO
                            </VListItemTitle>
                            <VListItemSubtitle>
                              {{ company.raw.email }}
                            </VListItemSubtitle>
                          </VListItem>

                        </VList>
                        <VDivider />
                      </VCol>
                      <VCol cols="12" class="d-flex justify-space-between align-center">
                        Cuentas bancarias
                        <ButtonComponent icon="ri-add-line" tooltip="Agregar cuenta" color="success"
                          @click="addAccountFunc(company.raw.id)" />
                      </VCol>
                      <VCol cols="12">
                        <VListItem v-for="account in company.raw.bankobject" :key="account.id">
                          <VListItemSubtitle>
                            <VChip size="small" label class="ml-2">
                              {{ account.bank_name }}
                            </VChip>
                            {{ account.account_number }}
                            <VChip size="small" label class="ml-2">
                              {{ account.currency }}
                            </VChip>
                          </VListItemSubtitle>

                          <template #append>
                            <ButtonComponent :icon="account.status ? 'ri-toggle-fill' : 'ri-toggle-line'"
                              :tooltip="account.status ? 'Desactivar cuenta' : 'Activar cuenta'"
                              @click="desactivateAccount(account.id, account.status)" />

                            <ButtonComponent icon="ri-pencil-line" tooltip="Editar cuenta" color="primary"
                              @click="editAccountFunc(account)" />

                            <!-- <ButtonComponent icon="ri-delete-bin-line" tooltip="Eliminar cuenta" color="error"
                              @click="deleteDataAccountFunc(account.id)" /> -->

                          </template>
                        </VListItem>
                      </VCol>
                    </VRow>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </template>

          <template #footer="{ pageCount }">
            <div class="d-flex justify-center mt-4">
              <VPagination v-model="page" :length="pageCount" size="small" rounded />
            </div>
          </template>
        </VDataIterator>
      </VCol>
    </VRow>

    <VDialog v-model="showCompanyModal" max-width="500px" persistent>
      <AddCompany :company="selectedCompany" :mode="modeCompanyModal" @saved="loadAllCompanies"
        @close="showCompanyModal = false" />
    </VDialog>

    <VDialog v-model="showAccountModal" max-width="500px" persistent>
      <AddBankAccountAdm :companyId="selectedCompanyForAccount" :account="selectedAccount" :mode="modeAccountModal"
        @saved="loadAllCompanies" @close="showAccountModal = false" />
    </VDialog>
  </div>
</template>
