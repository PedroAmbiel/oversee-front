<template>
  <div class="flex min-h-screen text-black">
    <!-- Left Panel (Login Form) -->
    <div class="w-full lg:w-1/3 bg-gray-400/90 flex flex-col justify-center items-center p-8 shadow-lg">
      <div class="text-center mb-8">
        <h1 class="text-7xl font-bold mb-2">Oversee</h1>
        <p class="text-black">Seja bem vindo! <a href="/cadastro-prestador" class="text-blue-700 hover:underline">Registrar</a></p>
      </div>

      <div class="w-full max-w-xs">
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
            <Password v-model="password" inputId="senha" pt:root="!w-full" inputClass="w-full !bg-white !text-black !border-white" :feedback="false"/>
            <label for="senha" class="!text-gray-500">Senha</label>
            <i id="verSenha" class="absolute right-3 top-3 cursor-pointer text-white hover:scale-110 duration-75 ease-linear" :class="showPassword ? `pi pi-eye-slash` : `pi pi-eye`" @click="togglePasswordVisibility"></i>
          </FloatLabel>
        </div>

        <!-- Remember Me -->
        <div class="mb-4">
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
        </div>

        <!-- Login Button -->
        <div class="mb-4">
          <button class="bg-black text-white w-full py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all hover:-translate-y-1">
            Login
          </button>
        </div>

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

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      checked: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
      const passwordField = document.getElementById('senha');
      passwordField.type = this.showPassword ? 'text' : 'password';
    }
  },
  
}
</script>

<style>

</style>
