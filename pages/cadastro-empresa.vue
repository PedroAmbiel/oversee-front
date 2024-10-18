<template>
<Toast />
  <div class="w-full bg-slate-200 p-8 shadow-lg rounded-md h-screen">
    <h1 class="text-4xl font-bold mb-6 text-center text-black">Cadastro de Empresa</h1>

      <form @submit.prevent="onSubmit">
      
        <Fieldset legend="Dados Empresa" class="!p-10 !mt-10" pt:legend:class="!border-white">
          <!-- Razao Social and Nome Fantasia -->
          <div class="grid grid-cols-2 gap-4 mb-4">
          <InputText placeholder="Razão Social *" v-model="razaoSocial" class="w-full" :required="true"/>
          <InputText placeholder="Nome Fantasia" v-model="nomeFantasia" class="w-full"/>
        </div>

        <!-- Telefone and Email -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <InputMask placeholder="Telefone *" v-model="telefoneEmpresa" class="w-full" mask="(99) 99999999?9" :required="true"/>
          <InputText placeholder="Email *" v-model="emailEmpresa" class="w-full" :required="true" />
        </div>

        <!-- CNPJ and Data de Abertura -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <InputMask placeholder="CNPJ *" v-model="cnpj" class="w-full" mask="99.999.999/9999-99" :required="true"/>
          <DatePicker v-model="dataAbertura" placeholder="Data de Abertura *" class="w-full" :required="true"/>
        </div>

        <!-- Endereço: Logradouro, Número, Bairro -->
        <Fieldset legend="Endereço">
          <div class="grid grid-cols-3 gap-4 mb-4">
            <InputText placeholder="Logradouro *" v-model="logradouro" class="w-full" :required="true"/>
            <InputText placeholder="Número *" v-model="numero" class="w-full" :required="true"/>
            <InputText placeholder="Bairro *" v-model="bairro" class="w-full" :required="true"/>
          </div>

          <!-- Cidade, Estado, CEP -->
          <div class="grid grid-cols-3 gap-4 mb-4">
            <InputText placeholder="Cidade *" v-model="cidade" class="w-full" :required="true"/>
            <InputText placeholder="Estado *" v-model="estado" class="w-full" :required="true"/>
            <InputMask placeholder="CEP *" v-model="cep" class="w-full" mask="99999-999" :required="true"/>
          </div>

          <!-- Complemento -->
          <div class="mb-4">
            <InputText placeholder="Complemento" v-model="complemento" class="w-full" />
          </div>
        </Fieldset>
      </Fieldset>
      <!-- Submit Button -->
      <div class="mt-6">
            <Button label="Confirmar" class="w-full !bg-black !text-white p-3 hover:-translate-y-1 !transition-all " type="submit"/>
      </div>
    </form>
  </div>
</template>

<script setup>
  const toast = useToast()
  //Empresa
  const razaoSocial = ref('')
  const nomeFantasia = ref('')
  const telefoneEmpresa = ref('')
  const emailEmpresa = ref('')
  const cnpj = ref('')
  const dataAbertura = ref(null)
  const logradouro = ref('')
  //Endereço
  const complemento = ref('')
  const numero = ref('')
  const bairro = ref('')
  const estado = ref('')
  const cep = ref('')
  const cidade = ref('')

  async function onSubmit() {
    await useFetch('http://localhost:8080/api/empresa/novo', {
      method: 'POST',
      body:{
        fkPrestador: 1,
        razaoSocial: razaoSocial.value,
        nomeFantasia: nomeFantasia.value,
        telefone: telefoneEmpresa.value,
        email: emailEmpresa.value,
        cnpj: cnpj.value.replace(/[^\d]/g, ''),
        endereco: {
          logradouro: logradouro.value,
          numero: numero.value,
          bairro: bairro.value,
          cidade: cidade.value,
          estado: estado.value,
          cep: cep.value,
          complemento: complemento.value
        },
        dataAbertura: dataAbertura.value
      },

      onResponse({request, response, options}){
        if(response.status == 200){
          toast.add({severity: 'success', summary: response._data, life: 5000})
          useRouter().removeRoute('/cadastro-empresa')
          useRouter().push("/painel")
        }
      },

      onResponseError({ request, response, options }) {
        console.log(cnpj.value.replace(/[^\d]/g, ''))
        toast.add({severity: 'error', summary: response._data, life: 3000})
      } 
    })
  }


  definePageMeta({
    middleware: 'auth'
  })

</script>

<style>

</style>