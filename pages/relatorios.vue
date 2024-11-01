<template>
  <Toast />
  <AutenticadoBarraSuperior />
  <div class="flex bg-black justify-center">
    <AutenticadoBarraLateral />
    
  <div class="h-full w-4/5">
    <Tabs value="0" class="">
      <TabList>
          <Tab value="0">Consultas</Tab>
          <Tab value="1">Financeiro</Tab>
          <Tab value="2">Clientes</Tab>
      </TabList>
      <TabPanels>
          <TabPanel value="0">
            <div class="flex flex-col gap-y-24">
              <div>
                <div class="flex justify-center gap-x-10 mb-4">
                  <Button class="!font-bold !text-lg !bg-white !border-none" @click="changePreviousYear()"> < </Button>
                  <span class="text-3xl">{{ anoSelecionadoPorMes }}</span>
                  <Button class="!font-bold !text-lg !bg-white !border-none" @click="changeNextYear()"> > </Button>
                </div>
                <Chart type="bar" :data="chartPorMesData" :options="chartOptions" />
              </div>
              <div>
                <Chart type="bar" :data="chartPorClienteData" :options="chartOptions" />
              </div>
              <div>
                <Chart type="bar" :data="chartPorAnoData" :options="chartOptions" />
              </div>
            </div>
          </TabPanel>
          <TabPanel value="1">
              <p class="m-0">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                  ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
              </p>
          </TabPanel>
          <TabPanel value="2">
              <p class="m-0">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
                  qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
              </p>
          </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
  </div>
</template>

<script setup>
const prestador = userStore()
const toast = useToast()
const chartOptions = ref();


//###### AGENDAMENTO POR MES ######// 
const agendamentosPorMes = ref(null)
const anoSelecionadoPorMes = ref(new Date().getFullYear());
async function agendamentosPorMesRelatorio(){
  await useFetch('http://localhost:8080/api/relatorio/agendamentospormes', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador, ano: anoSelecionadoPorMes.value},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          agendamentosPorMes.value = response._data;
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 500){
          toast.add({severity: 'error', summary: 'Erro interno: ' + response._data, life: 3000})
        }
        if(response.status == 404){
          agendamentosPorMes.value = null
        }
    }
  })
}

const legendasPorMes = () => {
  var legendas = []
  if(agendamentosPorMes.value == null) return 
  for (var item of agendamentosPorMes.value) {
    legendas.push(item.mes)
  }
  return monthName(legendas)
}

const agendasPorMes = () => {
  var agendas = []
  if(agendamentosPorMes.value == null) return 
  for (var item of agendamentosPorMes.value) {
    agendas.push(item.qtdAgendamentos)
  }
  return agendas
}

const chartPorMesData = ref();
const agendamentosPorMesGrafico = () => {
  return {
        labels: legendasPorMes(),
        datasets: [
            {
                label: agendamentosPorMes.value != null ? 'Agendamentos por mês' : 'Nenhum Agendamento encontrado',
                data: agendasPorMes(),
                backgroundColor: ['rgba(100, 115, 22, 1)'],
                borderColor: ['rgb(100, 115, 22)'],
                borderWidth: 1
            }
        ]
    };
}


async function changePreviousYear(){
  anoSelecionadoPorMes.value--
  await agendamentosPorMesRelatorio();
  await agendamentosPorClienteRelatorio();
  chartPorMesData.value = agendamentosPorMesGrafico();
  chartPorClienteData.value = agendamentosPorClienteGrafico();
}

async function changeNextYear(){
  anoSelecionadoPorMes.value++
  await agendamentosPorMesRelatorio();
  await agendamentosPorClienteRelatorio();
  chartPorMesData.value = agendamentosPorMesGrafico();
  chartPorClienteData.value = agendamentosPorClienteGrafico();
}



//###### AGENDAMENTO POR ANO ######//

const agendamentosPorAno = ref(null)
const chartPorAnoData = ref();

async function agendamentosPorAnoRelatorio(){
  await useFetch('http://localhost:8080/api/relatorio/agendamentosporano', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador, ano: new Date().getFullYear()},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          agendamentosPorAno.value = response._data;
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 500){
          toast.add({severity: 'error', summary: 'Erro interno: ' + response._data, life: 3000})
        }
        if(response.status == 404){
          agendamentosPorAno.value = null
        }
    }
  })
}

const legendasPorAno = () => {
  var legendas = []
  if(agendamentosPorAno.value == null) return 
  for (var item of agendamentosPorAno.value) {
    legendas.push(item.ano)
  }
  return legendas
}

const agendasPorAno = () => {
  var agendas = []
  if(agendamentosPorAno.value == null) return 
  for (var item of agendamentosPorAno.value) {
    agendas.push(item.qtdAgendamentos)
  }
  return agendas
}

const agendamentosPorAnoGrafico = () => {
  return {
        labels: legendasPorAno(),
        datasets: [
            {
                label: agendamentosPorAno.value != null ? 'Agendamentos por ano' : 'Nenhum Agendamento encontrado',
                data: agendasPorAno(),
                backgroundColor: ['rgba(100, 115, 22, 1)'],
                borderColor: ['rgb(100, 115, 22)'],
                borderWidth: 1
            }
        ]
    };
}


//###### AGENDAMENTO POR CLIENTE ######//
const agendamentosPorCliente = ref(null)
const chartPorClienteData = ref();

async function agendamentosPorClienteRelatorio(){
  await useFetch('http://localhost:8080/api/relatorio/agendamentosporcliente', {
    method: 'GET',
    query: {idPrestador: prestador.idPrestador, ano: anoSelecionadoPorMes.value},
    onResponse({ request, response, options }) {
        if(response.status == 200){
          agendamentosPorCliente.value = response._data;
        }
    },
    onResponseError({ request, response, options }) {
        if(response.status == 500){
          toast.add({severity: 'error', summary: 'Erro interno: ' + response._data, life: 3000})
        }
        if(response.status == 404){
          agendamentosPorCliente.value = null
        }
    }
  })
}

const legendasPorCliente = () => {
  var legendas = []
  if(agendamentosPorCliente.value == null) return 
  for (var item of agendamentosPorCliente.value) {
    legendas.push(item.nomeCliente)
  }
  return legendas
}

const agendasPorCliente = () => {
  var agendas = []
  if(agendamentosPorCliente.value == null) return 
  for (var item of agendamentosPorCliente.value) {
    agendas.push(item.qtdAgendamentos)
  }
  return agendas
}

const agendamentosPorClienteGrafico = () => {
  return {
        labels: legendasPorCliente(),
        datasets: [
            {
                label: agendamentosPorCliente.value != null ? 'Agendamentos por cliente' : 'Nenhum Agendamento encontrado',
                data: agendasPorCliente(),
                backgroundColor: ['rgba(100, 115, 22, 1)'],
                borderColor: ['rgb(100, 115, 22)'],
                borderWidth: 1
            }
        ]
    };
}

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    }
}

onMounted(async ()=> {
  await agendamentosPorMesRelatorio()
  await agendamentosPorAnoRelatorio()
  await agendamentosPorClienteRelatorio()
  chartPorMesData.value = agendamentosPorMesGrafico();
  chartPorAnoData.value = agendamentosPorAnoGrafico();
  chartPorClienteData.value = agendamentosPorClienteGrafico();
  chartOptions.value = setChartOptions()
})

const monthName = (monthNumbers) =>{
  // console.log('entrou', selectedMonth.value)
  var nomes = []
  for(var num of monthNumbers){
    switch (num) {
      case 1:
        nomes.push('Janeiro')
        break;
      case 2:
        nomes.push('Fevereiro')
        break;
      case 3:
        nomes.push('Março')
        break;
      case 4:
        nomes.push('Abril')
        break;
      case 5:
        nomes.push('Maio')
        break;
      case 6:
        nomes.push('Junho')
        break;
      case 7:
        nomes.push('Julho')
        break;
      case 8:
        nomes.push('Agosto')
        break;
      case 9:
        nomes.push('Setembro')
        break;
      case 10:
        nomes.push('Outubro')
        break;
      case 11:
        nomes.push('Novembro')
        break;
      case 12:
        nomes.push('Dezembro')
        break;
    }
  }
  return nomes
}

definePageMeta({
  middleware: 'auth'
})
</script>

<style>

</style>