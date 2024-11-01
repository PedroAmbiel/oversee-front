<template>
  <Toast />
  <AutenticadoBarraSuperior />
  <div class="flex bg-black">
    <AutenticadoBarraLateral />
    <div class="min-h-screen w-screen p-10 mx-36">
    <!-- Button to add a document -->
      <div class="flex justify-end mb-4">
        <Button 
          icon="pi pi-plus" 
          label="Adicionar Documento" 
          class="p-button-outlined p-button-secondary"
          @click="abrirDialogNovoDocumento()"
        />
      </div>
      <div class="mx-auto w-auto">
        <DataTable :value="documentos" tableStyle="min-width: 50rem" 
        selectionMode="single" paginator :rows="10" filterDisplay="row"
        :globalFilterFields="['nomeArquivo', 'tipoDocumento', 'nomeCliente']"
        v-model:filters="filters"
        pt:tablecontainer:class="!rounded-lg !text-center">

          <template #empty> Nenhum documento cadastrado </template>
          <template #loading> Carregando documentos. Aguarde. </template>

          <Column field="nomeArquivo" header="Documento" filterField="nomeArquivo" class="max-w-[450px]">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Nome do arquivo" />
            </template>
          </Column>

          <Column field="nomeCliente" header="Cliente" filterField="nomeCliente">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Nome do cliente" />
            </template>
          </Column>
          <Column field="tipoDocumento" header="Tipo" filterField="tipoDocumento">
            <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" type="text" @input="filterCallback()" placeholder="Tipo do documento" />
            </template>
          </Column>
          <Column header="Data Cadastro">
            <template #body="slotProps">
              {{ formatDateHour(slotProps.data.dataCadastro) }}
            </template>
          </Column>
          <Column header="Valor" >
            <template #body="slotProps" >
              <span v-if="slotProps.data.valorDocumento">R$ </span>{{ slotProps.data.valorDocumento }}
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
      </div>
    </div>
  </div>

  <Dialog v-model:visible="dialogVisible" header="Novo Documento" modal>
      <form @submit.prevent="novoDocumento()">
        <div class="bg-white p-5 rounded-xl">

          <div class="mb-2 flex flex-col">
            <label class="text-black">Cliente: *</label>
            <Select v-model="clienteSelecionado" :options="clientes" :optionLabel="`nome`" placeholder="Selecione o cliente" class="!w-full md:w-56" >
              <template #option="slotProps">
                <div>{{ slotProps.option.nome }} - {{ formatCpf(slotProps.option.cpf) }}</div>
              </template>  
            </Select>
          </div>

          <div class="mb-2 flex flex-col">
            <label class="text-black">Tipo de Documento: *</label>
            <Select v-model="tipoDocumento" :options="tipos" placeholder="Selecione o tipo de documento" class="!w-full md:w-56" >
            </Select>
          </div>

          <div class="mb-2 flex flex-col" v-if="tipoDocumento == 'NOTA_FISCAL'">
            <label class="text-black">Valor: *</label>
            <InputNumber v-model="valorDocumento" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5"  placeholder="Informe o valor da nota fiscal" class="!w-full md:w-56" />
          </div>
          
          <div class="p-4">
            <label for="file-upload" class="custom-file-upload">
                Selecionar 
            </label>
            <label class="text-black ml-10">{{ nomeDocumentoSelecionado }}</label>
            <input id="file-upload" type="file" @change="onFileSelect" accept=".png, .pdf, .jpg, .jpeg"/>
              <!-- <input type="file" @change="onFileSelect" class="bg-black file-input w-full" />  -->
          </div>
          <div><span class="text-red-600 font-bold text-[12px]">*ATENÇÃO: O arquivo será salvo com o nome salvo em seu computador*</span></div>

          <div v-if="documentoSelecionado" class="mt-4 p-4 border w-[1000px]  rounded-lg shadow">
      <!-- Preview for image files -->
          <div v-if="tipoDocumentoSelecionado.includes('image')">
            <img :src="documentoSelecionado" alt="Image Preview" class="w-full max-w-lg mx-auto" />
          </div>

          <!-- Preview for text files -->
          <div v-else-if="tipoDocumentoSelecionado.includes('text')">
            <pre class="whitespace-pre-wrap bg-gray-100 p-4 h-[1000px]">{{ documentoSelecionado }}</pre>
          </div>

          <!-- Preview for PDF files -->
          <div v-else-if="tipoDocumentoSelecionado === 'application/pdf'">
            <iframe :src="documentoSelecionado" class="w-full h-[500px]" frameborder="0"></iframe>
          </div>

          <!-- Message for unsupported file types -->
          <div v-else>
            <p class="text-red-500">Pré-visualização não disponível para esse tipo de arquivo.</p>
          </div>
          </div>
          <div class="flex space-x-2 mt-6 justify-evenly">
            <Button type="submit" class="!bg-black !text-white">Salvar</Button>
          </div>
        </div>
      </form>
    </Dialog>


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

</template>

<script setup>
import { format, formatDate } from 'date-fns';
import { TipoDocumento } from '~/interfaces/Cliente';
import { FilterMatchMode } from '@primevue/core/api';
import InputText from 'primevue/inputtext';

const toast = useToast()
const prestador = userStore()



//FORM
  //Documento
const documentoSelecionado = ref(null)
//const documentoSelecionadoByte = ref(null)
const nomeDocumentoSelecionado = ref(null)
const tipoDocumentoSelecionado = ref(null)
const arrayDocumento = ref()
const tipoDocumento = ref('')
const valorDocumento = ref(null)
  //Cliente
const clienteSelecionado = ref(null)
const suspender = ref(false)



//Visualizacao de Documento
const documentoVisualizarSelecionado = ref(null)
const documentoVisualizar = ref(null)

const dialogVisible = ref(false)
const dialogVisualizar = ref(false)

const clientes = ref()
const documentos = ref()


function saveByteArray(byte, type, nome) {
    var blob = new Blob([new Uint8Array(byte)], {type: type});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = nome;
    link.download = fileName;
    link.click();
    link.remove();
};

var tipos = []

function onFileSelect(event){
  const file = event.target.files[0];
      if (file) {
        tipoDocumentoSelecionado.value = file.type;
        nomeDocumentoSelecionado.value = file.name;
        const readerByte = new FileReader();
        const readerURL = new FileReader();

        // Check for different file types and read accordingly
        // if (file.type.includes('image')) {
        //   reader.readAsDataURL(file); // Read image as Data URL for preview
        // } else if (file.type.includes('text')) {
        //   reader.readAsText(file); // Read text file as text
        // } else if (file.type === 'application/pdf') {
        //   reader.readAsDataURL(file); // PDF preview (as Data URL)
        // } else {
        //   reader.readAsArrayBuffer(file); // Fallback for unsupported types
        // }

        //Leitor para criar o byteArray e enviar ao banco de dados
        readerByte.readAsArrayBuffer(file);

        readerByte.onload = (e) => {
          // Set the fileData for preview
          arrayDocumento.value = e.target.result;
          console.log(arrayDocumento.value)

        };

        readerByte.onerror = (e) => {
          console.error("Error reading file", e);
        };

        //Leitor para transformar o aquivo em base64 para leitura do img e iframe
        readerURL.readAsDataURL(file);

        readerURL.onload = (e) => {
          // Set the fileData for preview
          documentoSelecionado.value = e.target.result;
          console.log(documentoSelecionado.value)
        };

        readerURL.onerror = (e) => {
          console.error("Error reading file", e);
        };

        
  }
}


function abrirDialogNovoDocumento(){
  dialogVisible.value = true
  buscarClientes()
}

const formatCpf = (value) =>{
    var src = /^(\d{3})(\d{3})(\d{3})(\d{2})$/
    var dst = '$1.$2.$3-$4'
    return value.replace(src, dst)
}

async function novoDocumento(){
  if(clienteSelecionado.value == null){
    toast.add({severity: 'warn', summary: 'Selecione um cliente', life: 3000})
    return
  }
  if(tipoDocumento.value == ''){
    toast.add({severity: 'warn', summary: 'Informe o tipo de documento', life: 3000})
    return
  }

  if(tipoDocumento.value == 'NOTA_FISCAL' && valorDocumento.value == null){
    toast.add({severity: 'warn', summary: 'Informe o valor do documento', life: 3000})
    return
  } 
  //console.log(new Uint8Array(arrayDocumento.value))
  await useFetch('http://localhost:8080/api/documentos/novo', {
    method: 'POST',
    body:{
      documento: Array.from(new Uint8Array(arrayDocumento.value)),
      idCliente: clienteSelecionado.value.id,
      idPrestador: prestador.idPrestador,
      suspenso: suspender.value,
      tipoDocumento: tipoDocumento.value,
      nomeArquivo: nomeDocumentoSelecionado.value.split('.')[0],//Pegar o nome ate a extensão do arquivo
      extensaoDocumento: tipoDocumentoSelecionado.value,
      valorDocumento: valorDocumento.value
    },
    onResponse({ request, response, options }) {
        if(response.status == 200){
          documentoSelecionado.value = null
          nomeDocumentoSelecionado.value = null
          tipoDocumentoSelecionado.value = null
          arrayDocumento.value = null
          tipoDocumento.value = ''
          clienteSelecionado.value = null
          suspender.value = false
          valorDocumento.value = null
          
          dialogVisible.value = false
          buscarDocumentos()
          toast.add({severity:'success', summary: 'Documento cadastrado!', life: 3000})
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 400){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
    }
  })
}

async function buscarDocumentos(){
  await useFetch('http://localhost:8080/api/documentos/buscarporprestador', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador},
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

async function buscarClientes(){
  await useFetch('http://localhost:8080/api/cliente/buscartodos', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          clientes.value = response._data;
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 500){
          toast.add({severity: 'error', summary: 'Erro interno: ' + response._data, life: 3000})
        }
    }
  })
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

const filters = ref({
    nomeArquivo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    tipoDocumento: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nomeCliente: { value: null, matchMode: FilterMatchMode.CONTAINS },
});


function formatDateHour(date){
  return format(date, 'dd/MM/yyyy HH:mm')
}

onMounted(() => {
  buscarDocumentos()
  for (var tipo in TipoDocumento) {
    tipos.push(tipo)
  }
})

definePageMeta({
  middleware: 'auth'
})

</script>

<style>
.file-input {
  @apply border p-2 rounded-lg shadow;
}

input[type="file"]{
  display: none;
}

.custom-file-upload {
  border: 1px solid black;
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  background-color: black;
}
</style>