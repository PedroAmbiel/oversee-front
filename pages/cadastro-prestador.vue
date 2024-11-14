<template>
  <Toast />
    <!-- Left Column (Form) -->
      <div class="w-full bg-slate-200 p-8 shadow-lg rounded-md h-screen">
        <h1 class="text-4xl font-bold mb-6 text-center text-black">Crie sua conta</h1>

        <form @submit.prevent="onSubmit">

          <!-- CPF and Senha -->
          <Fieldset legend="Dados Pessoais" pt:legend:class="!border-white" class="!p-10">

            <!-- Nome and Sobrenome -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <InputText placeholder="Nome *" v-model="nome" class="w-full" :required="true"/>
            <InputText placeholder="Sobrenome *" v-model="sobrenome" class="w-full" :required="true"/>
          </div>


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

          <!-- Email and Telefone -->
          <div class="grid grid-cols-2 gap-4 mb-4">
            <InputText placeholder="Email *" v-model="email" class="w-full" :required="true"/>
            <InputMask placeholder="Telefone *" v-model="telefone" class="w-full" :required="true" mask="(99) 99999999?9"/>
          </div>
          

          <!-- Data de Nascimento -->
          <div class="mb-4">
            <DatePicker v-model="dataNascimento" placeholder="Data de Nascimento *" class="w-full" :required="true" />
          </div>
        </Fieldset>



          <!-- Submit Button -->
          <div class="mt-6">
            <Button label="Registrar" class="w-full !bg-black !text-white p-3 hover:-translate-y-1 !transition-all " type="submit"/>
          </div>

          <!-- Login Link -->
          <p class="text-center mt-4 text-black">
            Já tem uma conta?
            <a href="/" class="text-blue-500 hover:underline">Ir para login</a>
          </p>
        </form>
      </div>

</template>

<script setup lang="ts">
  const toast = useToast()

  //Prestador
  const nome = ref('')
  const sobrenome= ref('')
  const email= ref('')
  const telefone= ref('')
  const cpf= ref('')
  const senha= ref('')
  const dataNascimento= ref(null)



  async function onSubmit() {
    await useFetch('http://localhost:8080/api/prestador/criar', {
      method: 'POST',
      body:{
        nome: nome.value,
        sobrenome: sobrenome.value,
        email: email.value,
        telefone: telefone.value,
        senha: senha.value,
        cpf: cpf.value.replace(/[^\d]/g, ''),
        dataNascimento: dataNascimento.value
      },

      onResponse({request, response, options}){
        if(response.status == 200){
          toast.add({severity: 'success', summary: response._data, life: 5000})
          useRouter().push("/")
        }
      },

      onResponseError({ request, response, options }) {
        toast.add({severity: 'error', summary: response._data, life: 3000})
      } 
    })
  }

  function  testarIdade() : Boolean{
    console.log(dataNascimento)
    return true;
  }

</script>

<style scoped>
/* Add any custom styling if needed */
</style>
