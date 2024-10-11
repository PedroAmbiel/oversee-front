<template>
  <Toast />
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md" v-if="!msgEnviado">
      <h2 class="text-center text-2xl font-bold text-white mb-6">Esqueci minha senha</h2>
      
      <form id="solicitarSenha" @submit.prevent="onSubmit" v-if="!isTrocaSenha">
        <!-- Email Input using PrimeVue -->
        <div class="mb-4">
          <label for="cpf" class="block text-sm font-medium text-gray-300">CPF</label>
          <InputMask
            v-model="cpf"
            id="cpf"
            class="!w-full mt-1 focus:!border-white"
            placeholder="Digite seu CPF"
            mask="999.999.999-99"
          />
        </div>

        <!-- Submit Button using PrimeVue -->
        <div class="mb-4">
          <Button
            label="Recuperar Senha"
            class="w-full !bg-white hover:!bg-gray-200"
            type="submit"
            :disabled="!cpf"
          />
        </div>
      </form>

      <form id="redefinirSenha" @submit.prevent="redefinirSenha" v-if="isTrocaSenha">
        <!-- Email Input using PrimeVue -->
        <div class="mb-4">
          <label for="novaSenha" class="block text-sm font-medium text-gray-300">Nova Senha</label>
          <Password
            v-model="novaSenha"
            id="novaSenha"
            class="!w-full mt-1 focus:!border-white"
            input-class="!w-full"
            placeholder="Nova senha"
            :invalid="novaSenha != novaSenhaRep"
            :required="true" 
            promptLabel="Informe sua senha" weakLabel="Senha fraca" mediumLabel="Senha média" strongLabel="Senha forte"
            :toggle-mask="true"
          >
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
        <div class="mb-4">
          <label for="novaSenhaRep" class="block text-sm font-medium text-gray-300">Repita a senha</label>
          <Password
            v-model="novaSenhaRep"
            id="novaSenhaRep"
            class="!w-full mt-1 focus:!border-white"
            input-class="!w-full"
            placeholder="Repita a senha"
            :invalid="novaSenha != novaSenhaRep"
            :feedback="false"
            :toggle-mask="true"
          />
        </div>

        <!-- Submit Button using PrimeVue -->
        <div class="mb-4">
          <Button
            label="Alterar senha"
            class="w-full !bg-white hover:!bg-gray-200"
            type="submit"
            :disabled="!novaSenha || !novaSenhaRep"
          />
        </div>
      </form>

      <!-- Link to login page -->
      <div class="text-center">
        <p class="text-sm text-gray-400">
          Lembrou sua senha? 
          <a href="/login" class="text-blue-400 hover:underline">Ir para login</a>
        </p>
      </div>
    </div>
    <div class="flex flex-col w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md text-center" v-if="msgEnviado">
      <span>{{ msgEnviado }}</span>
      <NuxtLink class="mt-2 text-sm text-blue-400 hover:underline" to="/login">Voltar</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const toast = useToast()
const cpf = ref('');
const novaSenha = ref('')
const novaSenhaRep = ref('')

const msgEnviado = ref('')
const isTrocaSenha = ref(false)

var prestador = null

function onSubmit() {
  if (cpf.value) {
    useFetch('http://localhost:8080/api/email/redefinirsenha', {
      method: 'GET',
      query: {cpf: cpf.value.replace(/[^\d]/g, '')},
      onResponse({ request, response, options }) {
          if(response.status == 200){
            msgEnviado.value = 'Caso tenha uma conta conosco, as instruções de redefinição serão enviadas por email'
          }
          else if(response.status == 204){
            toast.add({severity: 'error', summary: 'Informe um CPF válido', life: 3000})
          }
      },
      onResponseError({ request, response, options }) {
          if(response.status == 400){
            msgEnviado.value = 'Caso tenha uma conta conosco, as instruções de redefinição serão enviadas por email'
          }
      }
    })
  }
}

function redefinirSenha(){
  if (novaSenha.value && novaSenhaRep.value) {
    useFetch('http://localhost:8080/api/email/alterarsenha', {
      method: 'PUT',
      body: {
        id: prestador.id,
        novaSenha: novaSenha.value,
        identificador: route.query.identificador
      },
      onResponse({ request, response, options }) {
          if(response.status == 200){
            msgEnviado.value = response._data
          }
      },
      onResponseError({ request, response, options }) {
          if(response.status == 404){
            msgEnviado.value = 'Não foi possivel alterar sua senha, tente mais tarde'
          }else if(response.status == 400){
            toast.add({severity: 'error', summary: response._data})
          }
      }
    })
  }
}


onMounted(() =>{
  if(route.query.identificador){
    isTrocaSenha.value = true
    useFetch('http://localhost:8080/api/email/validar/redefinicaosenha', {
      method: 'GET',
      query: {identificador: route.query.identificador},
      onResponse({ request, response, options }) {
          if(response.status == 200){
            prestador = response._data
            console.log(prestador)
          }
      },
      onResponseError({ request, response, options }) {
          if(response.status == 404){
            isTrocaSenha.value = false
          }
      }
    })
  }
})


</script>

<style scoped>
/* You can add additional styles if needed */
</style>
