<template>

    <!-- Left Column (Form) -->
      <div class="w-full bg-slate-200 p-8 shadow-lg rounded-md">
        <h1 class="text-4xl font-bold mb-6 text-center text-black">Crie sua conta</h1>

        <form @submit.prevent="onSubmit">

          <!-- CPF and Senha -->
          <Fieldset legend="Dados Pessoais" pt:legend:class="!border-white" class="!p-10">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <InputMask placeholder="CPF *" v-model="cpf" class="w-full" :required="true" mask="999.999.999-99"/>
              <Password placeholder="Senha *" v-model="senha" toggleMask inputClass="!w-full" :required="true" 
              promptLabel="Informe sua senha" weakLabel="Senha fraca" mediumLabel="Senha média" strongLabel="Senha forte">
                <template #footer>
                    <Divider />
                    <ul class="pl-2 ml-2 my-0 leading-normal">
                        <li>Pelo menos uma letra minúscula</li>
                        <li>Pelo menos uma letra maiúscula</li>
                        <li>Pelo menos um caractere especial</li>
                        <li>Mínimo de 8 caracteres</li>
                    </ul>
                </template>
              </Password>
            </div>
          

          <!-- Nome and Sobrenome -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <InputText placeholder="Nome *" v-model="nome" class="w-full" :required="true"/>
            <InputText placeholder="Sobrenome *" v-model="sobrenome" class="w-full" :required="true"/>
          </div>

          <!-- Email and Telefone -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <InputText placeholder="Email *" v-model="email" class="w-full" :required="true"/>
            <InputMask placeholder="Telefone *" v-model="telefone" class="w-full" :required="true" mask="(99) 99999999?9"/>
          </div>
          

          <!-- Data de Nascimento -->
          <div class="mb-4">
            <DatePicker v-model="dataNascimento" placeholder="Data de Nascimento *" class="w-full" :required="true"/>
          </div>
        </Fieldset>

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
            <Button label="Registrar" class="w-full !bg-black !text-white p-3 hover:-translate-y-1 !transition-all " type="submit"/>
          </div>

          <!-- Login Link -->
          <p class="text-center mt-4 text-black">
            Já tem uma conta?
            <a href="/login" class="text-blue-500 hover:underline">Ir para login</a>
          </p>
        </form>
      </div>

</template>

<script setup lang="ts">


  //Prestador
  const nome = ref('')
  const sobrenome= ref('')
  const email= ref('')
  const telefone= ref('')
  const cpf= ref('')
  const senha= ref('')
  const dataNascimento= ref(new Date)
  //Empresa
  const razaoSocial = ref('')
  const nomeFantasia = ref('')
  const telefoneEmpresa = ref('')
  const emailEmpresa = ref('')
  const cnpj = ref('')
  const dataAbertura = ref(new Date)
  const logradouro = ref('')
  //Endereço
  const complemento = ref('')
  const numero = ref('')
  const bairro = ref('')
  const estado = ref('')
  const cep = ref('')
  const cidade = ref('')


  function onSubmit() {
    console.log("Form submitted:asdas");
    // Add your form submission logic here
  }

  function  testarIdade() : Boolean{
    console.log(dataNascimento)
    return true;
  }

</script>

<style scoped>
/* Add any custom styling if needed */
</style>
