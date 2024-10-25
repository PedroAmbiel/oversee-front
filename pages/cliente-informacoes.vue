<template>
    <Toast />
    <AutenticadoBarraSuperior />
  <div class="flex">
    <AutenticadoBarraLateral />
    <div class="grid grid-cols-4 grid-rows-3 gap-4 w-5/6  mx-auto mt-24 mb-20">
      <!-- First column -->
      <div class="col-start-2 col-end-4 row-start-1 row-end-1 ">
        <Card class="!bg-gray-700 text-white h-full relative" >
          <template #title><div class="text-center">Dados Pessoais <i class="pi pi-pencil absolute right-10 top-5 text-xl cursor-pointer" @click="abrirDialogAtualizar"/></div> </template>
          <template #content>
            <hr class="mb-3">
            <div class="flex flex-col text-center"><span class="text-[12px]">NOME: </span><span class="text-3xl">{{ cliente.nome }}</span></div>
            <div class="flex flex-row gap-x-4 justify-center mt-10">
              
              <hr class="border-l-2 h-12">
              <div class="flex flex-col"><span class="text-[12px] ">CPF: </span><span class="text-lg">{{ formatCpf(cliente.cpf) }}</span></div>
              <hr class="border-l-2 h-12">
              <div class="flex flex-col"><span class="text-[12px] ">RG: </span><span class="text-lg">{{ formatRG(cliente.rg) }}</span></div>
              <hr class="border-l-2 h-12">
              <div class="flex flex-col"><span class="text-[12px] ">Data Nascimento: </span><span class="text-lg">{{dataNascimentoVisualizar[2] + `/` + dataNascimentoVisualizar[1] + `/` + dataNascimentoVisualizar[0] }}</span></div>
              <hr class="border-l-2 h-12">
            </div>

            <div class="mt-4 flex justify-end"><Button @click="suspenderCliente(cliente.id)" class="!bg-red-600 !border-none" label="Excluir"></Button></div>
          </template>
        </Card>
      </div>
      
      <div class="row-start-2 row-end-2 col-start-1 col-end-3 w-full">
        <Card  class="!bg-gray-700 !text-white h-full">
          <template #title>Próximas Consultas</template>

          <template #content>
            <hr class="mb-3">
            <p v-if="agendamentos.length <= 0">Aqui será exibido o conteúdo das próximas consultas.</p>
            <DataTable :value="agendamentos" tableStyle="min-width: 50rem" paginator :rows="5" v-if="agendamentos.length > 0" @row-click="router.push('/calendario')">
              <Column field="titulo" header="Titulo Agendamento" sortable style="width: 25%"></Column>
              <Column field="dataInicio" header="Inicio" sortable style="width: 25%">
                <template #body="slotProps">
                  {{ formatDateHour(slotProps.data.dataInicio) }}
                </template>
              </Column>
              <Column field="dataFim" header="Fim" sortable style="width: 25%">
                <template #body="slotProps">
                  {{ formatDateHour(slotProps.data.dataFim) }}
                </template></Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <div class="row-start-2 row-end-2 col-start-3 col-end-5 ">
      <Card class="w-full !bg-gray-700 text-white h-full">
          <template #title>Dados Financeiros</template>
          <template #content>
            <hr class="mb-3">
            <p v-if="!documentos">Aqui serão exibidas as informações financeiras do cliente.</p>
            <DataTable v-if="documentos" :value="documentos.filter(item => item.tipoDocumento == 'NOTA_FISCAL')" 
              selectionMode="single" paginator :rows="10"
              pt:tablecontainer:class="!rounded-lg !text-center">

              <template #empty> Nenhum documento cadastrado </template>
              <template #loading> Carregando documentos. Aguarde. </template>

              <Column field="nomeArquivo" header="Documento" filterField="nomeArquivo">
              </Column>

              <Column field="nomeCliente" header="Cliente" filterField="nomeCliente">
              </Column>
              <Column field="tipoDocumento" header="Tipo" filterField="tipoDocumento">
              </Column>
              <Column header="Data Cadastro">
                <template #body="slotProps">
                  {{ formatDateHour(slotProps.data.dataCadastro) }}
                </template>
              </Column>
              <Column field="" header="Visualizar" class="!text-center"
              :pt="{
                columnheadercontent: '!justify-center'
              }">
                <template #body="slotProps" >
                  <div class="flex justify-center">
                    <Button @click="onRowSelection(slotProps.data)" class="!bg-white hover:!bg-gray-300 !border-none"><i class="pi pi-eye"></i></Button>
                  </div>
                </template>
              </Column>
              <Column field="" header="Baixar" class="!text-center"
              :pt="{
                columnheadercontent: '!justify-center'
              }">
                <template #body="slotProps" >
                  <div class="flex justify-center">
                    <Button class="!bg-white hover:!bg-green-600 !border-none" @click="saveByteArray(slotProps.data.documento, slotProps.data.extensaoDocumento, slotProps.data.nomeArquivo)"><i class="pi pi-cloud-download" /></Button>
                  </div>
                </template>
              </Column>
              <Column field="" header="Excluir" class="!text-center"
              :pt="{
                columnheadercontent: '!justify-center'
              }">
                <template #body="slotProps" >
                  <div class="flex justify-center">
                    <Button @click="suspenderDocumento(slotProps.data.id)" class="!bg-white hover:!bg-red-500 !border-none"><i class="pi pi-times"></i></Button>
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
      </Card>
   </div>

      <!-- Second column -->
      <div class="row-start-3 row-end-3 col-start-1 col-end-5 flex">
        <Card class="w-full !bg-gray-700 text-white">
          <template #title>Documentos</template>
          <template #content>
            <hr class="mb-3">
            <DataTable v-if="documentos" :value="documentos.filter(item => item.tipoDocumento != 'NOTA_FISCAL')" 
              selectionMode="single" paginator :rows="5"
              pt:tablecontainer:class="!rounded-lg !text-center">

              <template #empty> Nenhum documento cadastrado </template>
              <template #loading> Carregando documentos. Aguarde. </template>

              <Column field="nomeArquivo" header="Documento" filterField="nomeArquivo">
              </Column>

              <Column field="nomeCliente" header="Cliente" filterField="nomeCliente">
              </Column>
              <Column field="tipoDocumento" header="Tipo" filterField="tipoDocumento">
              </Column>
              <Column header="Data Cadastro">
                <template #body="slotProps">
                  {{ formatDateHour(slotProps.data.dataCadastro) }}
                </template>
              </Column>
              <Column field="" header="Visualizar" class="!text-center"
              :pt="{
                columnheadercontent: '!justify-center'
              }">
                <template #body="slotProps" >
                  <div class="flex justify-center">
                    <Button @click="onRowSelection(slotProps.data)" class="!bg-white hover:!bg-gray-300 !border-none"><i class="pi pi-eye"></i></Button>
                  </div>
                </template>
              </Column>
              <Column field="" header="Baixar" class="!text-center"
              :pt="{
                columnheadercontent: '!justify-center'
              }">
                <template #body="slotProps" >
                  <div class="flex justify-center">
                    <Button class="!bg-white hover:!bg-green-600 !border-none" @click="saveByteArray(slotProps.data.documento, slotProps.data.extensaoDocumento, slotProps.data.nomeArquivo)"><i class="pi pi-cloud-download" /></Button>
                  </div>
                </template>
              </Column>
              <Column field="" header="Excluir" class="!text-center"
              :pt="{
                columnheadercontent: '!justify-center'
              }">
                <template #body="slotProps" >
                  <div class="flex justify-center">
                    <Button @click="suspenderDocumento(slotProps.data.id)" class="!bg-white hover:!bg-red-500 !border-none"><i class="pi pi-times"></i></Button>
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>

      </div>
    </div>
  </div>


  <!-- DIALOG DE VISUALIZAÇÃO DE DOCUMENTOS -->
  <Dialog v-model:visible="dialogVisualizar" header="Visualizar Documento" modal>
      <div class="bg-white p-5 rounded-xl">
      <!-- Preview for image files -->
      <div v-if="documentoVisualizarSelecionado" class="mt-4 p-4 border w-[1000px]  rounded-lg shadow">
        <div v-if="documentoVisualizarSelecionado.extensaoDocumento.includes('image')">
            <img :src="`data:`+documentoVisualizarSelecionado.extensaoDocumento+`;base64,`+documentoVisualizar" alt="Image Preview" class="w-full max-w-lg mx-auto" />
          </div>

          <!-- Preview for text files -->
          <div v-else-if="documentoVisualizarSelecionado.extensaoDocumento.includes('text')">
            <pre class="whitespace-pre-wrap bg-gray-100 p-4 h-[1000px]">{{ `data:`+documentoVisualizarSelecionado.extensaoDocumento+`;base64,`+documentoVisualizar }}</pre>
          </div>

          <!-- Preview for PDF files -->
          <div v-else-if="documentoVisualizarSelecionado.extensaoDocumento === 'application/pdf'">
            <iframe :src="`data:`+documentoVisualizarSelecionado.extensaoDocumento+`;base64,`+documentoVisualizar" class="w-full h-[500px]" frameborder="0"></iframe>
          </div>

          <!-- Message for unsupported file types -->
          <div v-else>
            <p class="text-red-500">Pré-visualização não disponível para esse tipo de arquivo.</p>
          </div>
        </div>
      </div>
    </Dialog>


    <Dialog v-model:visible="dialogCliente" modal header="Atualizar Cliente" :style="{ width: '25rem' }">
    <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <form @submit.prevent="atualizarCliente()">
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
        <InputMask v-model="rg" id="rg" placeholder="Digite o RG" class="w-full p-inputtext-sm " :required="true" mask="99.999.999-99" disabled/>
      </div>
      
      <!-- CPF -->
      <div class="mb-4">
        <label for="cpf" class="block text-gray-700 font-bold mb-2">CPF</label>
        <InputMask v-model="cpf" id="cpf" placeholder="Digite o CPF" class="w-full p-inputtext-sm" :required="true" mask="999.999.999-99" disabled/>
      </div>
      
      <!-- Submit Button -->
      <div class="mt-6">
        <Button label="Atualizar" type="submit" class="w-full p-button-sm !bg-black !text-white"/>
      </div>
    </form>
  </div>
  </Dialog>

</template>

<script setup>
import { format } from 'date-fns';
import { Cliente } from '~/interfaces/Cliente';
const toast = useToast();
const route = useRoute();
const router = useRouter();
const prestador = userStore();

const cliente = ref(new Cliente());

const agendamentos = ref([])


const nomeCompleto = ref('')
const dataNascimento = ref(null)
const rg = ref('')
const cpf = ref('')

const dataNascimentoVisualizar = ref('')

const dialogCliente = ref(false)


const documentoVisualizarSelecionado = ref(null)
const documentoVisualizar = ref(null)

const dialogVisualizar = ref(false)
const documentos = ref(null)


function saveByteArray(byte, type, nome) {
    var blob = new Blob([new Uint8Array(byte)], {type: type});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = nome;
    link.download = fileName;
    link.click();
    link.remove();
}

function byteArrayToBase64(byteArray) {
    let binaryString = '';
    const chunkSize = 5000; // Use a safe chunk size to avoid stack overflow
    for (let i = 0; i < byteArray.length; i += chunkSize) {
        const chunk = byteArray.subarray(i, i + chunkSize);
        binaryString += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binaryString);
}

function onRowSelection(documentoSelecionado){
  documentoVisualizarSelecionado.value = documentoSelecionado
  documentoVisualizar.value = byteArrayToBase64(new Uint8Array(documentoVisualizarSelecionado.value.documento));
  dialogVisualizar.value = true
}



async function buscarCliente(){
  await useFetch('http://localhost:8080/api/cliente/buscar', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador, idCliente: route.query.idCliente},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          cliente.value = response._data;
          console.log(cliente.value);
          
          dataNascimentoVisualizar.value = cliente.value.dataNascimento.split('-')
          
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

async function buscarDocumentos(){
  console.log(cliente.value.nome)
  await useFetch('http://localhost:8080/api/documentos/buscarporcliente', {
    method: 'GET',
    query: {idCliente: cliente.value.id},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          documentos.value = response._data;
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 500){
          toast.add({severity: 'error', summary: 'Erro interno: ' + response._data, life: 3000})
        }
    }
  })
}

async function suspenderDocumento(idDocumento){
  await useFetch('http://localhost:8080/api/documentos/suspender', {
    method: 'PUT',
    query: {idDocumento: idDocumento},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          buscarDocumentos()
          toast.add({severity:'success', summary: 'Documento excluído!', life: 3000})
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 404){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
    }
  })
}

async function buscarAgendamentos(){
  console.log(cliente.value.nome)
  await useFetch('http://localhost:8080/api/agendamento/buscarporcliente', {
    method: 'GET',
    query: {idCliente: cliente.value.id, idPrestador: prestador.idPrestador},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          agendamentos.value = response._data;
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 500){
          toast.add({severity: 'error', summary: 'Erro interno: ' + response._data, life: 3000})
        }
    }
  })
}

async function suspenderCliente(idCliente){
  await useFetch('http://localhost:8080/api/cliente/cancelar', {
    method: 'PUT',
    query: {idCliente: idCliente},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          router.push("/clientes")
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 400){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
    }
  })
}

async function atualizarCliente(){
  console.log(cliente.value.id);
  console.log(dataNascimento.value);
  console.log(nomeCompleto.value);
  
  await useFetch('http://localhost:8080/api/cliente/atualizar', {
    method: 'PUT',
    body: {
      id: cliente.value.id,
      dataNascimento: new Date(Date.UTC(dataNascimento.value.getFullYear(), dataNascimento.value.getMonth(), dataNascimento.value.getDate(), 10, 10)),
      nome: nomeCompleto.value,
    },
    onResponse({ request, response, options }) {
        if(response.status == 200){
          nomeCompleto.value = ''
          cpf.value = ''
          rg.value = ''
          dataNascimento.value = null
          dialogCliente.value = false
          buscarCliente()
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 400){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
    }
  })
}

function abrirDialogAtualizar(){
  nomeCompleto.value = cliente.value.nome
  cpf.value = cliente.value.cpf
  rg.value = cliente.value.rg
  dataNascimento.value = cliente.value.dataNascimento

  dialogCliente.value = true
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

function formatDateHour(date){
  return format(date, 'dd/MM/yyyy HH:mm')
}

const dateFormat = (data) => {
  return data.getDate() + '/' +data.getMonth() + '/' + data.getFullYear()
}

onMounted(async () => {
  if(route.query.idCliente){
    await buscarCliente();
    buscarDocumentos();
    buscarAgendamentos();
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