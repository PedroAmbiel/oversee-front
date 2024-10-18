<template>
  <div>
    <header class="relative flex justify-center bg-gray-300 p-4 z-50">
      <NuxtLink to="/perfil-prestador" v-tooltip="'Perfil'" class="absolute cursor-pointer left-10" ><i class="pi pi-user text-2xl text-black" /></NuxtLink> 
      <div class="flex items-center space-x-2" v-if="rout.name?.toString() == `painel`">
        <span class="text-black text-2xl">Bem vindo, <span class="underline">{{ nomePrestador }}</span></span>
      </div>
      <div class="text-center" v-if="useRoute().name != `painel` && useRoute().name != `cliente-informacoes`">
        <span class="text-black text-4xl">{{ rout.name!.toString().toUpperCase() }}</span>
      </div>
      <div class="text-center" v-if="useRoute().name == `cliente-informacoes`">
        <span class="text-black text-4xl">INFORMAÇÕES DO CLIENTE</span>
      </div>
      <NuxtLink v-if="rout.name?.toString() == 'painel'" v-tooltip="'Sair'" to="/desconectar" class="absolute right-10" > <i class="pi pi-sign-out text-black text-2xl" /></NuxtLink>
    </header>
  </div>
</template>

<script lang="ts" setup>
  const nomePrestador = userStore().nome || '';
  const rout = useRoute();
</script>

<style>

</style>