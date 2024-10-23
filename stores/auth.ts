import { defineStore } from 'pinia'

export const userStore = defineStore({
  id: 'userStore',
  state: () => ({ 
    idPrestador: null,
    nome: null,
    sobrenome: null,
    email: null,
    telefone: null,
    cpf: null,
    dataNascimento: null,
    empresaCadastrada: false
  }),
  persist:{
    storage: piniaPluginPersistedstate.localStorage(),
    afterHydrate: (ctx) =>{
      ctx.store.$state.lastRefreshedAt = new Date(ctx.store.$state.lastRefreshedAt);
      ctx.store.$state.lastLoginVerify = new Date(ctx.store.$state.lastLoginVerify);
      ctx.store.$state.accessExpireOn = new Date(ctx.store.$state.accessExpireOn);
      ctx.store.$state.refreshExpireOn = new Date(ctx.store.$state.refreshExpireOn);
    }
  },
  actions: {
    async login(email: string, password : string){
      let msg; 
      await useFetch('http://localhost:8080/api/prestador/login', {
        method: 'POST',
        body: {
          cpf: email,
          senha: password
        },
  
        onResponse({request, response, options}){
          if(response.status == 200){
            console.log(response._data)
            userStore().idPrestador = response._data.id.toString()
            userStore().nome = response._data.nome
            userStore().sobrenome = response._data.sobrenome
            userStore().email = response._data.email
            userStore().telefone = response._data.telefone
            userStore().cpf = response._data.cpf
            userStore().dataNascimento = response._data.dataNascimento
            msg = "T"
          }
        },
        onResponseError({ request, response, options }) {
          if(response.status == 401){
            console.log(response._data)
            msg = response._data.toString()
          } 
        },
      })

      return msg;
  },

  isAutenticado(){
    if(this.idPrestador){
      return true
    }else{
      return false
    }
  },

  possuiEmpresaCadastrada(){
    var router = useRouter()

    useFetch('http://localhost:8080/api/prestador/buscarempresa', {
      method: 'GET',
      query: { idPrestador: this.idPrestador },
      
      onResponse({options, request, response, error}){
        if(response.status == 200){
          router.push('/painel')
          userStore().empresaCadastrada = true
        }
      },
      onResponseError({ request, options, error, response }) {
          if(response.status == 404){
            router.push('/cadastro-empresa')
          }
      }
    })
  },

  limparUserStore(){
    this.$reset()
  },

}})
