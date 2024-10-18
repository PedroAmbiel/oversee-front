<template>
  <AutenticadoBarraSuperior />
  <div class="flex">
    <AutenticadoBarraLateral />
    <div class="container mx-auto mt-10 p-6">
    <!-- Date Range and Filter Section -->
    <div class="flex justify-evenly items-center mb-4">
      <!-- <div>
        <label>Período: </label>
        <DatePicker type="date" v-model="startDate" class="mr-2" placeholder="Início"/>
        <DatePicker type="date" v-model="endDate" placeholder="Fim"/>
      </div> -->

      <Button class="!font-bold !text-lg" @click="changePreviousMonth()"> < </Button>
      <span class="text-2xl">{{ monthName(selectedMonth).name }}</span>
      <Button class="!font-bold !text-lg" @click="changeNextMonth()"> > </Button>
      <span class="text-2xl">{{ selectedYear }}</span>
    </div>

    <!-- Calendar Grid -->
 
    <div class="grid grid-cols-7 gap-10 p-10" v-if="daysOfTheWeek">
      <div v-for="(day, daysIndex) in daysOfTheWeek" :key="daysIndex" class="text-center">
        {{ day.name }}
        {{ console.log(day) }}
        <div v-for="(date, index) in day.days" :key="index">

          <div class="border p-1 h-36 relative text-center overflow-y-auto" v-if="date != 0">
            <Button @click="openDialog(date)" ><span>{{ date.date }}</span></Button>
            <!-- Show appointments -->
            <div v-for="appointment in date.appointments" :key="appointment.id" class="bg-white text-black p-1 mt-2 rounded overflow-hidden">
              {{ appointment.title }}
            </div>
          </div>
          <div class="border p-1 h-36 relative text-center" v-if="date == 0">
            <Button class="!cursor-default !bg-[#3d3d3d] !border-none" ><span class="text-[#3d3d3d]">00</span></Button>
          </div>
      </div>
      </div>
      
    </div>

    <!-- Dialog for Adding Appointment -->
    <Dialog v-model:visible="dialogVisible" header="Novo Agendamento" modal>
      <form @submit.prevent="saveAppointment">
        <label class="m-10"> Dia selecionado: {{ formatDate(selectedDay) }}</label>
        <div class="bg-white p-5 rounded-xl">
          <div class="mb-2 flex flex-col">
            <label class="text-black">Título:</label>
            <InputText v-model="tituloAgendamento" required />
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Cliente:</label>
            <Select v-model="clienteSelecionado" :options="clientes" optionLabel="nome" placeholder="Selecione o cliente" class="w-full md:w-56" />
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Horário Inicio:</label>
            <DatePicker id="datepicker-timeonly" v-model="horarioInicio" timeOnly fluid />
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Horario Fim:</label>
            <DatePicker id="datepicker-timeonly" v-model="horarioFim" timeOnly fluid />
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Descrição:</label>
            <InputText v-model="descricao" />
          </div>
          <div class="mb-2 flex flex-col">
            <label class="text-black">Tipo de Agendamento:</label>
            <InputText v-model="tipoAgendamento" required />
          </div>
          <div class="flex space-x-2 mt-6 justify-evenly">
            <Button type="submit" class="!bg-black !text-white">Salvar</Button>
          </div>
        </div>
      </form>
    </Dialog>
  </div>
  </div>
</template>

<script setup>
import { format, isValid } from 'date-fns';

const prestador = userStore()

const today = new Date()
const selectedDay = ref(null)
const selectedMonth = ref(today.getMonth()+1)
const selectedYear = ref(today.getFullYear())

const dialogVisible = ref(false)



//FORM
const tituloAgendamento = ref('')
const clienteSelecionado = ref(null)
const horarioInicio = ref(null)
const horarioFim = ref(null)
const descricao = ref('')
const tipoAgendamento = ref('')

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
  console.log('entrou', selectedMonth.value)
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
  var contDia = 0
  limparDays()
  console.log('entrou', daysInMonth)
  for (let i = 0; i < daysInMonth.value.length; i++) {

    novaDate.setDate(daysInMonth.value[i].date)
    novaDate.setMonth(selectedMonth.value - 1)
    novaDate.setFullYear(selectedYear.value)
    console.log('novaDate: ' + novaDate + ' isValid() ' + isValid(novaDate))
    if(novaDate.getDate() > contDia){
      for (let index = 0; index < daysOfTheWeek.value.length; index++) {
        if(novaDate.getDay() == daysOfTheWeek.value[index].num){
          console.log(daysInMonth.value[i].date + 'entrou no if - novaDate.getDay() =  ' + novaDate.getDay() + '  daysOfWeek = ' + daysOfTheWeek.value[index].num)
          daysOfTheWeek.value[index].days.push(daysInMonth.value[i])
          contDia++
          break;
        }else if(novaDate.getDate() == 1){
          daysOfTheWeek.value[index].days.push(0)
        }
      }
    }
  }
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
  preencherDays()
}

function changeNextMonth(){
  if(selectedMonth.value == 12){
    selectedMonth.value = 1
    selectedYear.value++
  }else{
    selectedMonth.value++;
  }
  preencherDays()
}

const openDialog = (day) => {
  selectedDay.value = new Date(selectedYear.value, selectedMonth.value - 1, day.date)
  dialogVisible.value = true
  buscarClientes();
}

const saveAppointment = () => {
  if (selectedDay.value) {
    selectedDay.value.appointments.push({
      id: Date.now(),
      title: tituloAgendamento.value,
    })
    dialogVisible.value = false
    tituloAgendamento.value = ''
  }
}

function formatDate(date){
  return format(date, 'dd/MM/yyyy')
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

onMounted(() => {
  preencherDays();
})

definePageMeta({
  middleware: 'auth'
})
</script>

<style>
.container {
  background-color: #2d2d2d;
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
  background-color: #3d3d3d;
}
</style>