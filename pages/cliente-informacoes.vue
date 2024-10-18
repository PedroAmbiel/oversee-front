<template>
    <Toast />
    <AutenticadoBarraSuperior />
  <div class="flex">
    <AutenticadoBarraLateral />
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-7xl w-full p-4 m-auto mt-24 mb-20">
      <!-- First column -->
      <div class="col-span-1 flex flex-col space-y-4">
        <Card class="!bg-gray-700 text-white">
          <template #title>Dados Pessoais</template>
          <template #content>
            <hr class="mb-3">
            <div class="flex flex-col gap-y-4">
              <div class="flex flex-col"><span class="text-[12px]">NOME: </span><span class="text-lg">{{ cliente.nome }}</span></div>
              <div class="flex flex-col"><span class="text-[12px] ">CPF: </span><span class="text-lg">{{ formatCpf(cliente.cpf) }}</span></div>
              <div class="flex flex-col"><span class="text-[12px] ">RG: </span><span class="text-lg">{{ formatRG(cliente.rg) }}</span></div>
            </div>
          </template>
          
        </Card>
        <Card  class="!bg-gray-700 !text-white">
          <template #title>Próximas Consultas</template>

          <template #content>
            <hr class="mb-3">
            <p>Aqui vai o conteúdo das próximas consultas.</p>
          </template>
        </Card>
      </div>

      <!-- Second column -->
      <div class="col-span-1 lg:col-span-2 flex space-x-4">
        <Card class="w-full !bg-gray-700 text-white">
          <template #title>Documentos</template>
          <template #content>
            <hr class="mb-3">
          </template>
        </Card>
        <Card class="w-full !bg-gray-700 text-white">
          <template #title>Dados financeiros</template>
          <template #content>
            <hr class="mb-3">
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { setInterval } from '#imports';
import { Cliente } from '~/interfaces/Cliente';
  const toast = useToast();
  const route = useRoute();
  const router = useRouter();
  const prestador = userStore();

  const cliente = ref(new Cliente());

  async function buscarCliente(){
    await useFetch('http://localhost:8080/api/cliente/buscar', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador, idCliente: route.query.idCliente},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          cliente.value = response._data;
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 404){
          toast.add({severity: 'error', summary: 'Cliente não encontrado: ' + response._data, life: 3000})

          setTimeout(() => {
            router.push('/clientes')
          }, 3000);
        }
    }
  })
  }

  const formatCpf = (value) =>{
    var src = /^(\d{3})(\d{3})(\d{3})(\d{2})$/
    var dst = '$1.$2.$3-$4'
    return value.replace(src, dst)
  }

  const formatRG = (value) =>{
    var src = /^(\d{2})(\d{3})(\d{3})(\d{2})$/
    var dst = '$1.$2.$3-$4'
    return value.replace(src, dst)
  }

  onMounted(() => {
    if(route.query.idCliente){
      buscarCliente();
    }else{
      router.push("/clientes")
    }
  })

  definePageMeta({
    middleware: 'auth'
  })
</script>

<style>

</style>