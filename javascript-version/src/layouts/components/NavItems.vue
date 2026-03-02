<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';

const user = JSON.parse(localStorage.getItem('user'))

const hasRole = (allowedRoles) => {
  if (!user?.roles) return false

  return allowedRoles.some(role =>
    user.roles.includes(role),
  )
}
</script>

<template>
  <!-- 👉 Apps & Pages -->
  <div>
    <VerticalNavSectionTitle :item="{
      heading: 'Vistas principales',
    }" />

    <VerticalNavLink v-if="hasRole(['admin'])"
      :item="{ title: 'Lista de Usuarios', icon: 'ri-group-3-fill', to: '/list-users' }" />

    <VerticalNavLink v-if="hasRole(['admin'])"
      :item="{ title: 'Asignacion de roles', icon: 'ri-account-box-line', to: '/list-roles' }" />

    <VerticalNavLink v-if="hasRole(['admin', 'tesoreria', 'employee', 'accounting'])"
      :item="{ title: 'Mis viaticos', icon: 'ri-list-view', to: '/list-viaticos-user' }" />

    <VerticalNavLink v-if="hasRole(['admin', 'tesoreria', 'employee', 'accounting'])"
      :item="{ title: 'Declaraciones de Usuario', icon: 'ri-file-list-line', to: '/list-declaration-user' }" />

    <VerticalNavLink v-if="hasRole(['admin'])"
      :item="{ title: 'Viáticos administrativos', icon: 'ri-list-view', to: '/list-viaticos-adm' }" />

    <VerticalNavLink v-if="hasRole(['admin', 'tesoreria', 'accounting'])"
      :item="{ title: 'Viaticos aprobados', icon: 'ri-list-view', to: '/list-viaticos-aproved' }" />

    <!-- 👉 User Interface -->
    <VerticalNavSectionTitle v-if="hasRole(['admin', 'tesoreria'])" :item="{ heading: 'Administración del sistema' }" />

    <!-- <VerticalNavLink v-if="hasRole(['admin', 'tesoreria'])"
      :item="{ title: 'Configuración de la documentación', icon: 'ri-settings-3-line', to: '/configuration' }" /> -->

    <VerticalNavLink v-if="hasRole(['admin', 'tesoreria'])"
      :item="{ title: 'Costos', icon: 'ri-currency-line', to: '/list-costs' }" />

    <VerticalNavLink v-if="hasRole(['admin'])"
      :item="{ title: 'Clientes y proyectos', icon: 'ri-folder-chart-2-line', to: '/proyect' }" />

    <VerticalNavSectionTitle v-if="hasRole(['admin'])" :item="{ heading: 'Configuración de la empresa' }" />

    <VerticalNavLink v-if="hasRole(['admin'])"
      :item="{ title: 'Información de la empresa', icon: 'ri-community-line', to: '/company-info' }" />
  </div>
</template>
