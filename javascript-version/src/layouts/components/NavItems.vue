<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle :item="{
    heading: 'Vistas principales',
  }" />



  <VerticalNavLink :item="{
    title: 'Lista de Usuarios',
    icon: 'ri-group-3-fill',
    to: '/list-users',
  }" />

  <VerticalNavLink :item="{
    title: 'Asignacion de roles',
    icon: 'ri-account-box-line',
    to: '/list-roles',
  }" />

  <VerticalNavLink :item="{
    title: 'Mis viaticos',
    icon: 'ri-list-view',
    to: '/list-viaticos-user',
  }" />

  <VerticalNavLink :item="{
    title: 'Declaraciones de Usuario',
    icon: 'ri-file-list-line',
    to: '/list-declaration-user',
  }" />

  <VerticalNavLink :item="{
    title: 'Viáticos administrativos',
    icon: 'ri-list-view',
    to: '/list-viaticos-adm',
  }" />

  <VerticalNavLink :item="{
    title: 'Viaticos aprobados',
    icon: 'ri-list-view',
    to: '/list-viaticos-aproved',
  }" />

  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle :item="{
    heading: 'App administration',
  }" />

  <VerticalNavLink :item="{
    title: 'Configuración de liquidacion',
    icon: 'ri-settings-3-line',
    to: '/configuration',
  }" />

  <VerticalNavLink :item="{
    title: 'Costos',
    icon: 'ri-currency-line',
    to: '/list-costs',
  }" />
  <VerticalNavLink :item="{
    title: 'Clientes y proyectos',
    icon: 'ri-folder-chart-2-line',
    to: '/proyect',
  }" />
</template>
