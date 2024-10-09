<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md" v-if="!msgEnviado">
      <h2 class="text-center text-2xl font-bold text-white mb-6">Esqueci minha senha</h2>
      
      <form @submit.prevent="onSubmit">
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

      <!-- Link to login page -->
      <div class="text-center">
        <p class="text-sm text-gray-400">
          Lembrou sua senha? 
          <a href="/login" class="text-blue-400 hover:underline">Ir para login</a>
        </p>
      </div>
    </div>
    <div class="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-md" v-if="msgEnviado">
      {{ msgEnviado }}
    </div>
  </div>
</template>

<script setup>

const cpf = ref('');
const msgEnviado = ref('')

function onSubmit() {
  if (cpf.value) {

  }
  msgEnviado = 'Caso tenha uma conta conosco, as instruções de redefinição serão enviadas por email'
}
</script>

<style scoped>
/* You can add additional styles if needed */
</style>
