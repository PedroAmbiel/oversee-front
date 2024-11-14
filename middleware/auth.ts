export default defineNuxtRouteMiddleware((to, from) => {

    if(userStore().isAutenticado() && userStore().empresaCadastrada == false){
        userStore().possuiEmpresaCadastrada()
    }

    // if(from.path == '/login' && to.path == '/painel'){
    //     userStore().possuiEmpresaCadastrada()
    // }
    
    if(to.path != '/' && !userStore().isAutenticado()){
        return navigateTo('/')
    }else if(to.path != '/novo-prestador' && !userStore().isAutenticado()){
        return navigateTo('/') 
    }

})
