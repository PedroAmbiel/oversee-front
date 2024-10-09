<template>
  <div class="flex flex-col font-sans">
    <!-- Header -->
    <header class="flex justify-between items-center bg-gray-300 p-4">
      <div class="flex items-center space-x-2">
        <Button icon="pi pi-bars" class="p-button-text"></Button>
        <span class="text-black">Welcome, Fulano</span>
      </div>
      <div class="flex items-center space-x-2 ml-auto">
  <InputText placeholder="Search..." />
  <Button icon="pi pi-search" class="p-button-text"></Button>
</div>
      <Button icon="pi pi-user" class="p-button-text"></Button>
    </header>

    <div class="flex">
      <!-- Oversee Section -->
      <div class="flex-1 text-center p-3">
        <img 
        src="../assets/images/eye2.png"
        class="w-auto h-32 mx-auto  " />
        <h1 class="text-8xl font-bold ">Oversee</h1>
        <img
          class="rounded-lg mt-6 w-3/4 mx-auto"
          src="../assets/images/Oversee.png"
          alt="Desk with Calendar"
        />
      </div>

      <!-- Sidebar -->
      <div class="bg-gray-900 text-white p-6 w-96">
        <h2 class="text-3xl mb-10">Category</h2>
        <div class="space-y-4">
          <Button icon="pi pi-user" label="Perfil do Cliente" class="w-full p-button-outlined text-left !py-6"></Button>
          <Button icon="pi pi-chart-bar" label="Relatórios" class="w-full p-button-outlined text-left !py-6"></Button>
          <Button icon="pi pi-calendar" label="Calendário" class="w-full p-button-outlined text-left !py-6"></Button>
          <Button icon="pi pi-file" label="Documentos" class="w-full p-button-outlined text-left !py-6"></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* Import Tailwind's CSS in your project configuration (tailwind.config.js) or in your main CSS file */
</style>
