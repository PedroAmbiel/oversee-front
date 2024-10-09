export default defineNuxtRouteMiddleware((to, from) => {

    if(from.path == '/login' && to.path == '/painel'){
        console.log("passou no middleware")
        userStore().possuiEmpresaCadastrada()
    }
    
    if(to.path != '/login' && !userStore().isAutenticado()){
        return navigateTo('/login')
    }

    if(to.path != '/novo-prestador' && !userStore().isAutenticado()){
        return navigateTo('/login') 
    }

})
