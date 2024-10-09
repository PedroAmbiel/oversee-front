<template>
  <Toast position="top-left" />
  <div class="flex min-h-screen text-black">
    <!-- Left Panel (Login Form) -->
    <div class="w-full lg:w-1/3 bg-gray-400/90 flex flex-col justify-center items-center p-8 shadow-lg">
      <img src="../assets/images/over.png" class="w-32" :hidden="!focus">
      <img src="../assets/images/over0.png" class="w-32" :hidden="focus">
      <div class="text-center mb-8">
        <h1 class="text-7xl font-bold mb-2">Oversee</h1>
        <p class="text-black">Seja bem vindo! <a href="/cadastro-prestador" class="text-blue-700 hover:underline">Registrar</a></p>
      </div> 

      <div class="w-full max-w-xs">
        <form @submit.prevent="validarLogin">
        <!-- Email -->
        <div class="mb-6">
          <FloatLabel>
              <InputText id="usuario" v-model="email" class="w-full !bg-white !text-black !border-white"/>
              <label for="usuario" class="!text-gray-500">Usuário</label>
          </FloatLabel>
        </div>

        <!-- Password -->
        <div class="mb-5">
          <FloatLabel>
            <Password v-model="password" inputId="senha" pt:root="!w-full" inputClass="w-full !bg-white !text-black !border-white" 
            @focus="focus = false" @blur="focus = true" :feedback="false" toggleMask />
            <label for="senha" class="!text-gray-500">Senha</label>
          </FloatLabel>
          <NuxtLink to="/trocar-senha" class="text-blue-700 text-sm hover:underline"><span>Esqueci minha senha</span></NuxtLink>
        </div>

        <!-- Remember Me -->
        <!-- <div class="mb-4">
          <label class="inline-flex items-center">
            <Checkbox v-model="checked" :binary="true" pt:input:class="!bg-white"
            :pt="{
              box: (options) =>({
                class: [
                  '!border-none',
                {
                  '!bg-white' : !checked,
                  '!bg-green-400' : checked,
                }


                ]})
              }"
            />
            <span class="ml-2 text-white">Lembre-me</span>
          </label>
        </div> -->

        <!-- Login Button -->
        <div class="mb-4">
          <button class="bg-black text-white w-full py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all hover:-translate-y-1" type="submit">
            Login
          </button>
        </div>
      </form>
        <!-- Login with Google -->
        <!-- <div class="mb-4">
          <button class="w-full flex items-center justify-center bg-gray-200 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-all">
            <i class="pi pi-google text-xl mr-2"></i>
            Login with Google
          </button>
        </div> -->
      </div>
    </div>

    <!-- Right Panel (Background Image) -->
    <div class="hidden lg:block w-2/3 bg-cover bg-center bg-[url(~/assets/images/login_template.jpg)] opacity-20" />
    <!-- </div> -->
  </div>
</template>

<script setup>
import Toast from 'primevue/toast';
  const toast = useToast()
  const user = userStore()

  const email = ref('')
  const password = ref('')
  const focus = ref(true)

    
  async function validarLogin(){
    if(!email.value || !password.value){
      toast.add({severity: 'error', summary: "Informe o usuário e senha", life: 3000})
      return false
    }

    var msg = await user.login(email.value, password.value)
  
    if(msg == 'T'){
      useRouter().push('/painel')
    }else{
      toast.add({severity: 'error', summary: msg, life: 3000})
    }
  }

</script>

<style>

</style>
