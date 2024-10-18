<template>
  <div>
    <!-- Sidebar Menu -->
    <div
      class="fixed top-0 left-0 z-10 h-screen bg-black text-white transition-all duration-300 ease-in-out group border-r-white content-center"
      :class="{ 'w-64': menuAberto, 'w-28': !menuAberto }"
      @mouseover="menuAberto = true"
      @mouseout="menuAberto = false"
    >
      <ul>
        <li v-for="item in menuItems" :key="item.name" class="relative">
          <!-- Icon and Name -->
          <a
            :href="item.path"
            class="flex p-10 hover:bg-gray-500 transition-colors duration-300" :class="{'bg-gray-600' : route.name.split('/')[0] == item.path, 'bg-black' : menuAberto }"
          >
            <!-- Name of Icon (Appears to the left on hover) -->
            <span
              class="absolute transform -translate-x-full opacity-0 transition-all duration-300 group-hover:delay-150  text-xl" 
              :class="{'group-hover:opacity-100 group-hover:translate-x-0' : menuAberto}"
            >
              {{ item.name }}
            </span>

            <!-- Icon on the Right -->
            <i :class="item.icon, menuAberto ? `ml-auto` : `m-auto`" class="text-3xl"></i>
          </a>
        </li>
      </ul>

      <!-- Log Out Icon (Fixed at the bottom) -->
      <a 
        href="/desconectar"
        class="flex items-center p-10 hover:bg-gray-500 transition-colors duration-300 absolute w-full"
      >
        <!-- Name of Icon (Appears to the left on hover) -->
        <span
          class="absolute transform -translate-x-full opacity-0 transition-all duration-300 group-hover:delay-150 text-xl"
          :class="{'group-hover:opacity-100 group-hover:translate-x-0' : menuAberto}"
          >
          Sair
        </span>

        <!-- Icon on the Right -->
        <i :class="menuAberto ? `ml-auto` : `m-auto`" class="text-3xl transition-[margin] pi pi-sign-out"></i>
      </a>
    </div>
  </div>
</template>


<script setup >
  const route = useRoute();
  const router = useRouter();
  const menuAberto = ref(false); 
  const menuItems = [
    { name: "Painel", icon: "pi pi-home", path: "painel" },
    { name: "Clientes", icon: "pi pi-user", path: "clientes" },
    { name: "Relatórios", icon: "pi pi-chart-bar", path: "relatorios"  },
    { name: "Calendário", icon: "pi pi-calendar", path: "calendario"  },
    { name: "Documentos", icon: "pi pi-file", path: "documentos"  },
  ];


</script>

<style scoped>
/* Ensures the sidebar is on top of all content */
</style>
