<template>
  <Toast />
  <AutenticadoBarraSuperior />
  <div class="flex bg-black">
    <AutenticadoBarraLateral />
    <div class="container mx-auto mt-10 p-6">
    <!-- Date Range and Filter Section -->
    <div class="flex justify-evenly items-center mb-4">
      <!-- <div>
        <label>Período: </label>
        <DatePicker type="date" v-model="startDate" class="mr-2" placeholder="Início"/>
        <DatePicker type="date" v-model="endDate" placeholder="Fim"/>
      </div> -->

      <Button class="!font-bold !text-lg !bg-white" @click="changePreviousMonth()"> < </Button>
      <span class="text-2xl">{{ monthName(selectedMonth).name }}</span>
      <Button class="!font-bold !text-lg !bg-white" @click="changeNextMonth()"> > </Button>
      <span class="text-2xl">{{ selectedYear }}</span>
    </div>

    <!-- Calendar Grid -->
 
    <div class="grid grid-cols-7 p-10 rounded-lg" v-if="daysOfTheWeek">
      <div v-for="(day, daysIndex) in daysOfTheWeek" :key="daysIndex" class="text-center">
        <span class="text-2xl">{{ day.name }}</span>
        <div v-for="(date, index) in day.days" :key="index">

          <div class="border p-1 h-40 w-auto relative text-left overflow-y-auto bg-[#3d3d3d]" :class="new Date().getDate() == date.date ? `!bg-[#202020]` : `` " v-if="date != 0">
            <Button @click="openDialog(date)" class="!absolute right-2 !bg-white !border-black hover:!bg-gray-300"><span>{{ date.date }}</span></Button>
            <!-- Show appointments -->
            <div v-tooltip.top="appointment.titulo" v-for="appointment in date.appointments"  :key="appointment.id" :class="appointment.cancelado ? `!bg-red-500 line-through hover:!bg-red-600` : `!bg-white hover:!bg-gray-300`" class=" text-black p-1 first-of-type:mt-12 mt-1 rounded overflow-hidden hover:!cursor-pointer" @click="dialogDetalhes(appointment, date.date)">
              <span>{{ formatHours(appointment.dataInicio) }}</span> - <span>{{ appointment.titulo }}</span>
            </div>
          </div>
          <div class="border p-1 h-40 relative text-center bg-[#3d3d3d]" v-if="date == 0">  
          </div>
      </div>
      </div>
      
    </div>

    <!-- Dialog for Adding Appointment -->
    <Dialog v-model:visible="dialogVisible" header="Novo Agendamento" modal>
      <form @submit.prevent="cadastrarAgendamento()">
        <label class="m-10"> Dia selecionado: {{ formatDate(selectedDay) }}</label>
        <div class="bg-white p-5 rounded-xl">
          <div class="mb-2 flex flex-col">
            <label class="text-black">Título: *</label>
            <InputText v-model="tituloAgendamento" required />
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Cliente: *</label>
            <Select v-model="clienteSelecionado" :options="clientes" :optionLabel="`nome`" placeholder="Selecione o cliente" class="!w-full md:w-56" >
              <template #option="slotProps">
                <div>{{ slotProps.option.nome }} - {{ formatCpf(slotProps.option.cpf) }}</div>
              </template>  
            </Select>
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Horário Inicio: *</label>
            <DatePicker id="datepicker-timeonly" v-model="horarioInicio" timeOnly fluid/>
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Horario Fim: *</label>
            <DatePicker id="datepicker-timeonly" v-model="horarioFim" timeOnly fluid />
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Descrição:</label>
            <InputText v-model="descricao"/>
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Tipo de Agendamento: *</label>
            <Select v-model="tipoAgendamento" :options="tipos" placeholder="Selecione o cliente" class="!w-full md:w-56" >
            </Select>
          </div>
          <div class="flex space-x-2 mt-6 justify-evenly">
            <Button type="submit" class="!bg-black !text-white">Salvar</Button>
          </div>
        </div>
      </form>
    </Dialog>

    <Dialog v-model:visible="dialogDetalhesVisible" header="Detalhes Agendamento" modal>
        <label class="m-10"> Dia selecionado: {{ formatDate(selectedDay) }}</label>
        <div :class="detalhesAgendamento.cancelado ? `!bg-red-600` :`bg-white` " class=" p-5 rounded-xl">
          <div class="mb-2 flex flex-col">
            <label class="text-black font-bold">Título:</label>
            <label class="text-black">{{ detalhesAgendamento.titulo }}</label>
          </div>
          <hr class="border-black">
          <div class="mb-2 flex flex-col gap-x-3 text-black">
            <label class="text-black font-bold">Cliente:</label>
            <div class="p-2">
              <div class=" flex flex-row gap-x-3 text-black">
                <label class="text-black font-bold">Nome:</label>
                <label class="">{{ clienteDetalhe.nome }} </label>
              </div>
              <div class="mb-2 flex flex-row gap-x-3 text-black">
                <label class="text-black font-bold">CPF:</label>
                <label class="">{{ clienteDetalhe.cpf }} </label>
              </div>
            </div>
          </div>
          <hr class="border-black">
          <div class="flex gap-x-10" >
            <div class="mb-2 flex flex-col">
              <label class="text-black font-bold">Horário Inicio:</label>
              <label class="text-black">{{ formatHour(detalhesAgendamento.dataInicio) }}</label>
            </div>
            
            <div class="mb-2 flex flex-col">
              <label class="text-black font-bold">Horário Fim:</label>
              <label class="text-black">{{ formatHour(detalhesAgendamento.dataFim) }}</label>
            </div>
          </div>
          <hr class="border-black">
          <div class="mb-2 flex flex-col">
            <label class="text-black font-bold">Descrição:</label>
            <label class="text-black">{{ detalhesAgendamento.descricao }}</label>
          </div>
          <hr class="border-black">
          <div class="mb-2 flex flex-col">
            <label class="text-black font-bold">Tipo Agendamento:</label>
            <label class="text-black">{{ detalhesAgendamento.tipoAgendamento }}</label>
          </div>
          <Button v-if="!detalhesAgendamento.cancelado" label="Cancelar" class="mt-3 !bg-red-600 !border-none hover:!bg-red-700 hover:!scale-105 !transition-transform" @click="cancelarAgendamento()" />
        </div>
    </Dialog>
  </div>
  </div>
</template>

<script setup>
import { format, isValid } from 'date-fns';
import { TipoAgendamento } from '~/interfaces/Cliente';

const toast = useToast()
const prestador = userStore()

const today = new Date()
const selectedDay = ref(null)
const selectedMonth = ref(today.getMonth()+1)
const selectedYear = ref(today.getFullYear())

const dialogVisible = ref(false)
const dialogDetalhesVisible = ref(false)

const detalhesAgendamento = ref(null)
const clienteDetalhe = ref(null)


const agendamentosBuscados = ref([])

//FORM
const tituloAgendamento = ref('')
const clienteSelecionado = ref(null)
const horarioInicio = ref(new Date())
const horarioFim = ref(new Date())
const descricao = ref('')
const tipoAgendamento = ref('')
var tipos = []
var totalDiasNoMesAtual = 0

const clientes = ref([])


const daysOfTheWeek = ref([
  {name: 'Domingo', days: [], num: 0},
  {name: 'Segunda', days: [], num: 1},
  {name: 'Terça', days: [], num: 2},
  {name: 'Quarta', days: [], num: 3},
  {name: 'Quinta', days: [], num: 4},
  {name: 'Sexta', days: [], num: 5},
  {name: 'Sábado', days: [], num: 6},
])

// Example data for days in the month
const daysInMonth = ref([
  { date: '01', appointments: [] },
  { date: '02', appointments: [] },
  { date: '03', appointments: [] },
  { date: '04', appointments: [] },
  { date: '05', appointments: [] },
  { date: '06', appointments: [] },
  { date: '07', appointments: [] },
  { date: '08', appointments: [] },
  { date: '09', appointments: [] },
  { date: '10', appointments: [] },
  { date: '11', appointments: [] },
  { date: '12', appointments: [] },
  { date: '13', appointments: [] },
  { date: '14', appointments: [] },
  { date: '15', appointments: [] },
  { date: '16', appointments: [] },
  { date: '17', appointments: [] },
  { date: '18', appointments: [] },
  { date: '19', appointments: [] },
  { date: '20', appointments: [] },
  { date: '21', appointments: [] },
  { date: '22', appointments: [] },
  { date: '23', appointments: [] },
  { date: '24', appointments: [] },
  { date: '25', appointments: [] },
  { date: '26', appointments: [] },
  { date: '27', appointments: [] },
  { date: '28', appointments: [] },
  { date: '29', appointments: [] },
  { date: '30', appointments: [] },
  { date: '31', appointments: [] },
])

const monthName = (monthNumber) =>{
  // console.log('entrou', selectedMonth.value)
  switch (monthNumber) {
    case 1:
      return {name: 'Janeiro', number: 1};
    case 2:
      return {name: 'Fevereiro', number: 2};
    case 3:
      return {name: 'Março', number: 3};
    case 4:
      return {name: 'Abril', number: 4};

    case 5:
      return {name: 'Maio', number: 5};
      
    case 6:
      return {name: 'Junho', number: 6};

    case 7:
      return {name: 'Julho', number: 7};
      
    case 8:
      return {name: 'Agosto', number: 8};

    case 9:
      return {name: 'Setembro', number: 9};
      
    case 10:
      return {name: 'Outubro', number: 10};

    case 11:
      return {name: 'Novembro', number: 11};
      
    case 12:
      return {name: 'Dezembro', number: 12};
  
    default:
      return '';
  }
}

function preencherDays(){
  var novaDate = new Date()
  novaDate.setHours(0,0,0,0)
  var contDia = 0
  limparDays()
  // console.log('entrou', daysInMonth)
  for (let i = 0; i < daysInMonth.value.length; i++) {

    novaDate.setDate(daysInMonth.value[i].date)
    novaDate.setMonth(selectedMonth.value - 1)
    novaDate.setFullYear(selectedYear.value)
    // console.log('novaDate: ' + novaDate + ' isValid() ' + isValid(novaDate))
    if(novaDate.getDate() > contDia){
      for (let index = 0; index < daysOfTheWeek.value.length; index++) {
        if(novaDate.getDay() == daysOfTheWeek.value[index].num){
          // console.log(daysInMonth.value[i].date + 'entrou no if - novaDate.getDay() =  ' + novaDate.getDay() + '  daysOfWeek = ' + daysOfTheWeek.value[index].num)
          var appointmentsAux = []

          for(var agenda of agendamentosBuscados.value){
            //Pegando a data em String do JSON e separando as partes importantes 2024-10-01T13:10:10.234
            var data = agenda.dataInicio.split('-')
            var dia = data[2].split('T')
            var mes = data[1]
            var ano = data[0]
            var dataAgenda = new Date(ano, mes, dia[0])
            if(dataAgenda.getDate() == novaDate.getDate() && dataAgenda.getMonth()-1 == novaDate.getMonth() && dataAgenda.getFullYear() == novaDate.getFullYear()){
              appointmentsAux.push(agenda)
            }
          }
          appointmentsAux.sort((a, b)=> new Date(a.dataInicio) - new Date(b.dataInicio))
          daysInMonth.value[i].appointments = appointmentsAux
          daysOfTheWeek.value[index].days.push(daysInMonth.value[i])
          contDia++
          break;
        }else if(novaDate.getDate() == 1){
          daysOfTheWeek.value[index].days.push(0)
        }
      }
    }
    totalDiasNoMesAtual = contDia
  }
}

async function cadastrarAgendamento(){
  if(tituloAgendamento.value == ''){
    toast.add({severity: 'warning', summary: 'Informe o título do agendamento', life: 3000})
    return
  }
  if(clienteSelecionado.value == null){
    toast.add({severity: 'warning', summary: 'Selecione um cliente', life: 3000})
    return
  }
  if(tipoAgendamento.value == ''){
    toast.add({severity: 'warning', summary: 'Informe o tipo de agendamento', life: 3000})
    return
  }

  await useFetch('http://localhost:8080/api/agendamento/novo', {
    method: 'POST',
    body: {
      titulo: tituloAgendamento.value,
      dataInicio: new Date(Date.UTC(horarioInicio.value.getFullYear(), horarioInicio.value.getMonth(), horarioInicio.value.getDate(), horarioInicio.value.getHours(), horarioInicio.value.getMinutes(), horarioInicio.value.getSeconds())),
      dataFim: new Date(Date.UTC(horarioFim.value.getFullYear(), horarioFim.value.getMonth(), horarioFim.value.getDate(), horarioFim.value.getHours(), horarioFim.value.getMinutes(), horarioFim.value.getSeconds())),
      descricao: descricao.value,
      fkPrestador: prestador.idPrestador,
      fkCliente: clienteSelecionado.value.id,
      tipoAgendamento: tipoAgendamento.value,
      cancelado: false,
    },
    onResponse({ request, response, options }) {
        if(response.status == 200){
          tituloAgendamento.value = ''
          horarioInicio.value = new Date()
          horarioFim.value = new Date()
          descricao.value = ''
          clienteSelecionado.value = null
          tipoAgendamento.value = ''
          dialogVisible.value = false
          carregarAgendamentos()
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 400){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
    }
  })
}

async function carregarAgendamentos(){
  await useFetch('http://localhost:8080/api/agendamento/buscarprestadorlimite', {
    method: 'POST',
    query:{idPrestador: prestador.idPrestador},
    body:{
      dataInicio: new Date(selectedYear.value, selectedMonth.value-1, 1),
      dataFim: new Date(selectedYear.value, selectedMonth.value, totalDiasNoMesAtual),
    },
    onResponse({ request, response, options }) {
        if(response.status == 200){
          agendamentosBuscados.value = response._data;
          preencherDays()
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 400){
          toast.add({severity: 'error', summary: 'Erro: ' + response._data, life: 3000})
        }
    }
  })
}


function limparDays(){
  for (let i = 0; i < daysOfTheWeek.value.length; i++) {
    daysOfTheWeek.value[i].days = []
  }
}

function changePreviousMonth(){
  if(selectedMonth.value == 1){
    selectedMonth.value = 12
    selectedYear.value--
  }else{
    selectedMonth.value--;
  }
  carregarAgendamentos()
}

function changeNextMonth(){
  if(selectedMonth.value == 12){
    selectedMonth.value = 1
    selectedYear.value++
  }else{
    selectedMonth.value++;
  }
  carregarAgendamentos()
}

const openDialog = (day) => {
  horarioInicio.value.setDate(day.date)
  horarioInicio.value.setMonth(selectedMonth.value-1)
  horarioInicio.value.setFullYear(selectedYear.value)

  horarioFim.value.setDate(day.date)
  horarioFim.value.setMonth(selectedMonth.value-1)
  horarioFim.value.setFullYear(selectedYear.value)
  selectedDay.value = new Date(selectedYear.value, selectedMonth.value - 1, day.date)
  dialogVisible.value = true
  buscarClientes();
}

function formatDate(date){
  return format(date, 'dd/MM/yyyy')
}

function formatHours(date){
  return format(date, 'HH:mm')
}

const formatCpf = (value) =>{
    var src = /^(\d{3})(\d{3})(\d{3})(\d{2})$/
    var dst = '$1.$2.$3-$4'
    return value.replace(src, dst)
}

const formatHour = (date) => {
  var dataSeparada = date.split('T')
  var horarioSeparado = dataSeparada[1].split('.')
  var somenteHoraMinuto = horarioSeparado[0].split(':')

  return somenteHoraMinuto[0]+':'+somenteHoraMinuto[1]
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

async function dialogDetalhes(appointment, day){
  selectedDay.value = new Date(selectedYear.value, selectedMonth.value - 1, day)
  detalhesAgendamento.value = appointment
  // console.log(detalhesAgendamento.value.fkCliente)
  await dadosCliente(detalhesAgendamento.value.fkCliente)
  dialogDetalhesVisible.value = true;
}


async function dadosCliente (idCliente){
  await useFetch('http://localhost:8080/api/cliente/buscar', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador, idCliente: idCliente},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          // console.log('entrou', response._data)
          clienteDetalhe.value = response._data
        }
    },
  })
}

async function cancelarAgendamento(){
  await useFetch('http://localhost:8080/api/agendamento/cancelar', {
    method: 'PUT',
    query: {idAgendamento: detalhesAgendamento.value.id},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          // console.log('entrou', response._data)
          dialogDetalhesVisible.value = false
          carregarAgendamentos()
        }
    },
  })
}

onMounted(() => {
  carregarAgendamentos();
  for (var tipo in TipoAgendamento) {
    tipos.push(tipo)
  }
})

definePageMeta({
  middleware: 'auth'
})
</script>

<style>
.container {
  background-color: black;
  color: white;
}
.input {
  background-color: #333333;
  border: 1px solid #555;
  padding: 0.5rem;
  width: 100%;
  color: white;
}
.btn, .btn-primary {
  background-color: #4CAF50;
  padding: 0.5rem 1rem;
  border: none;
  color: white;
  cursor: pointer;
}
.btn-secondary {
  background-color: #555;
}
.grid {
  background-color: black;
}
</style>