<template>
  <div class="flex flex-col font-sans h-screen overflow-hidden">
    <!-- Header -->
    <AutenticadoBarraSuperior />

    <div class="flex h-full ">
      <!-- Oversee Section -->
      <div class="flex-1 text-center content-center relative bg-white">
        <h1 class=" text-8xl font-bold inset-0 self-center z-10 text-black">Oversee</h1>
        <img
          class="rounded-tr-[200px] rounded-tl-[200px] mt-10 mx-auto w-2/3"
          src="../assets/images/Oversee.png"
          alt="Desk with Calendar"
        />
      </div>

      <!-- Sidebar -->
      <div class="flex flex-col items-center bg-gradient-to-br from-gray-600 to-gray-900 justify-between text-white p-6 w-1/4 h-auto text-center">
        <!-- <h2 class="text-3xl mb-10">Category</h2> -->
        
          <Button @click="goToCliente()" icon="pi pi-user" label="Perfil do Cliente" pt:label:class="ml-5 !text-2xl text-black text-center" pt:icon:class="text-2xl text-black" class="w-3/4 p-button-outlined text-left !py-6 !h-44 !bg-white !rounded-3xl hover:!bg-gray-300"></Button>
          <Button @click="goToRelatorio()" icon="pi pi-chart-bar" label="Relatórios" pt:label:class="ml-5 !text-2xl text-black" pt:icon:class="text-2xl text-black" class="w-3/4 p-button-outlined text-left !py-6 !h-44 !bg-white !rounded-3xl hover:!bg-gray-300"></Button>
          <Button @click="goToCalendario()" icon="pi pi-calendar" label="Calendário" pt:label:class="ml-5 !text-2xl text-black" pt:icon:class="text-2xl text-black" class="w-3/4 p-button-outlined text-left !py-6 !h-44 !bg-white !rounded-3xl hover:!bg-gray-300"></Button>
          <Button @click="goToDocumento()" icon="pi pi-file" label="Documentos" pt:label:class="ml-5 !text-2xl text-black" pt:icon:class="text-2xl text-black" class="w-3/4 p-button-outlined text-left !py-6 !h-44 !bg-white !rounded-3xl hover:!bg-gray-300"></Button>
        
      </div>
    </div>
  </div>
</template>

<script setup>

function goToCliente(){
  useRouter().push('/clientes')
}

function goToRelatorio(){
  useRouter().push('/clientes')
}

function goToCalendario(){
  useRouter().push('/clientes')
}

function goToDocumento(){
  useRouter().push('/clientes')
}

definePageMeta({
  middleware: 'auth'
})

</script>

<style scoped>
/* Import Tailwind's CSS in your project configuration (tailwind.config.js) or in your main CSS file */
</style>
