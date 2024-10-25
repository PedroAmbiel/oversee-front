<template>
  <Toast />
  <AutenticadoBarraSuperior />

  <div class="flex">
    <AutenticadoBarraLateral />

    <div class="m-auto mt-24 mb-20">

      <Button label="Cadastrar novo cliente" @click="visible = true" class="!bg-white hover:!bg-gray-400 !border-none hover:-translate-y-1 !transition-transform "></Button>

      <DataTable @row-select="selecionarCliente()"
      v-model:selection="clienteSelecionado" :value="clientes" selectionMode="single" 
      tableStyle="min-width: 50rem; background-color: #e7e7e7" class="custom-table mt-10" selection="!bg-green-500" dataKey="id">
        <template #empty> Nenhum cliente cadastrado. </template> 
        <Column field="nome" header="Nome" class="w-[250px]"></Column>
        <Column field="cpf" header="CPF" class="w-[250px]">
          <template #body="{ data }">
            {{ formatCpf(data.cpf) }}
          </template>
        </Column>
        <Column field="rg" header="RG" class="w-[250px]">
          <template #body="{ data }">
            {{ formatRG(data.rg) }}
          </template>
        </Column>
        <Column field="dataCadastro" header="Data Cadastro" dataType="date" class="w-[250px]">
          <template #body="{ data }">
            {{ formatDate(data.dataCadastro) }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>

  <Dialog v-model:visible="visible" modal header="Registrar Cliente" :style="{ width: '25rem' }">
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <form @submit.prevent="cadastrarCliente()">
      <!-- Nome Completo -->
      <div class="mb-4">
        <label for="nomeCompleto" class="block text-gray-700 font-bold mb-2">Nome Completo</label>
        <InputText v-model="nomeCompleto" id="nomeCompleto" placeholder="Digite o nome completo" class="w-full p-inputtext-sm" :required="true"/>
      </div>
      
      <!-- Data de Nascimento -->
      <div class="mb-4">
        <label for="dataNascimento" class="block text-gray-700 font-bold mb-2">Data de Nascimento</label>
        <DatePicker v-model="dataNascimento" id="dataNascimento" dateFormat="dd/mm/yy"
        :max-date="new Date()" showIcon class="w-full " :required="true" 
        input-class="!w-full" />
      </div>
      
      <!-- RG -->
      <div class="mb-4">
        <label for="rg" class="block text-gray-700 font-bold mb-2">RG</label>
        <InputMask v-model="rg" id="rg" placeholder="Digite o RG" class="w-full p-inputtext-sm" :required="true" mask="99.999.999-99"/>
      </div>
      
      <!-- CPF -->
      <div class="mb-4">
        <label for="cpf" class="block text-gray-700 font-bold mb-2">CPF</label>
        <InputMask v-model="cpf" id="cpf" placeholder="Digite o CPF" class="w-full p-inputtext-sm" :required="true" mask="999.999.999-99"/>
      </div>
      
      <!-- Submit Button -->
      <div class="mt-6">
        <Button label="Cadastrar" type="submit" class="w-full p-button-sm !bg-black !text-white"/>
      </div>
    </form>
  </div>
  </Dialog>

</template>

<script setup>
const toast = useToast()
const prestador = userStore()
const router = useRouter()
//const clientes: Clientes[] = ref(null);

const clienteSelecionado = defineModel()
const visible = ref(false)
const clientes = ref([])


//Form Cliente
  const nomeCompleto = ref('')
  const dataNascimento = ref(null)
  const rg = ref('')
  const cpf = ref('')




const columns = [
    { field: 'nome', header: 'Nome' },
    { field: 'cpf', header: 'CPF' },
    { field: 'dataCadastro', header: 'Data Cadastro' },
  ]

  onMounted(() => {
    buscarClientes()
  })

  function selecionarCliente(){
    router.push('cliente-informacoes?idCliente='+clienteSelecionado.value.id)
  }


  async function buscarClientes(){
    await useFetch('http://localhost:8080/api/cliente/buscartodos', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          clientes.value = response._data;
          console.log(clientes.value[0])
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 500){
          toast.add({severity: 'error', summary: 'Erro interno: ' + response._data, life: 3000})
        }
    }
  })
  }

  async function cadastrarCliente(){
    await useFetch('http://localhost:8080/api/cliente/novo', {
    method: 'POST',
    body: {
      dataNascimento : dataNascimento.value,
      nome: nomeCompleto.value,
      rg: rg.value.replace(/[^\d]/g, ''),
      cpf: cpf.value.replace(/[^\d]/g, ''),
      fkPrestador: userStore().idPrestador,
      dataCadastro: new Date,
      cancelado: false,
    },
    onResponse({ request, response, options }) {
        if(response.status == 200){
          console.log(response.body)
          nomeCompleto.value = '';
          dataNascimento.value = null;
          rg.value = '';
          cpf.value = '';

          buscarClientes()
          // console.log(clientes.value[0])
          visible.value = false
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 400){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
        if(response.status == 500){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
        if(response.status == 404){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
    }
  })
  }





//Format

const formatDate = (value) => {
var data = new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
    //Deixar com UTC, pois transforma a data do banco em 2024-10-14 em 'Tue, 14 Oct 2024 00:00:00 UTC', 
    //quando aplica o GMT brasil faz -3 na hora e transfomr em dia 13/10
});

return data
};

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


definePageMeta({
  middleware: 'auth'
})
</script>

<style>
.custom-table .p-datatable-thead > tr > th {
  background-color: #4f524f;  /* Change header background */
  color: white;               /* Change header text color */
}

/* Style the body rows */
.custom-table .p-datatable-tbody > tr {

  background-color: #ffffff;  /* Row background color */
  color: #333;                /* Row text color */
}


/* Customize hover effect */
.custom-table .p-datatable-tbody > tr:hover {
  background-color: #050303;  /* Row hover color */
}

</style>