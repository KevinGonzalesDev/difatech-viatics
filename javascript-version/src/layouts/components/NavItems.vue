<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue';
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue';
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue';
</script>

<template>
  <!-- <VerticalNavGroup :item="{
    title: 'Dashboards',
    badgeContent: '5',
    badgeClass: 'bg-error',
    icon: 'ri-home-smile-line',
  }">
    <VerticalNavLink :item="{
      title: 'Analytics',
      to: '/dashboard',
    }" />
    <VerticalNavLink :item="{
      title: 'CRM',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/crm',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }" />
    <VerticalNavLink :item="{
      title: 'ECommerce',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/ecommerce',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }" />
    <VerticalNavLink :item="{
      title: 'Academy',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/academy',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }" />
    <VerticalNavLink :item="{
      title: 'Logistics',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/dashboards/logistics',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }" />
  </VerticalNavGroup>

  <VerticalNavGroup :item="{
    title: 'Vistas principales',
    icon: 'ri-file-copy-line',
    badgeContent: 'Pro',
    badgeClass: 'bg-light-primary text-primary',
  }">
    <VerticalNavLink :item="{
      title: 'Landing',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/front-pages/landing-page',
      target: '_blank',
    }" />
    <VerticalNavLink :item="{
      title: 'Pricing',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/front-pages/pricing',
      target: '_blank',
    }" />
    <VerticalNavLink :item="{
      title: 'Payment',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/front-pages/payment',
      target: '_blank',
    }" />
    <VerticalNavLink :item="{
      title: 'Checkout',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/front-pages/checkout',
      target: '_blank',
    }" />
    <VerticalNavLink :item="{
      title: 'Help Center',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/front-pages/help-center',
      target: '_blank',
    }" />
  </VerticalNavGroup> -->

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle :item="{
    heading: 'Vistas principales',
  }" />

  <VerticalNavLink :item="{
    title: 'Account Settings',
    icon: 'ri-user-settings-line',
    to: '/account-settings',
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
    to: '/list-viaticos',
  }" />


  <VerticalNavLink :item="{
    title: 'Registrar',
    icon: 'ri-user-add-line',
    to: '/register',
  }" />



  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle :item="{
    heading: 'App administration',
  }" />
  <VerticalNavLink :item="{
    title: 'Costos',
    icon: 'ri-currency-line',
    to: '/list-costs',
  }" />
  <VerticalNavLink :item="{
    title: 'Clientes y proyectos',
    icon: 'ri-folder-chart-2-line',
    to: '/proyects',
  }" />
  <VerticalNavLink :item="{
    title: 'Cards',
    icon: 'ri-bar-chart-box-line',
    to: '/cards',
  }" />
</template>
