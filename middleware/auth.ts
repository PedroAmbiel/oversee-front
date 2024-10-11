export default defineNuxtRouteMiddleware((to, from) => {

    if(userStore().isAutenticado() && userStore().empresaCadastrada == false){
        userStore().possuiEmpresaCadastrada()
    }

    // if(from.path == '/login' && to.path == '/painel'){
    //     userStore().possuiEmpresaCadastrada()
    // }
    
    if(to.path != '/login' && !userStore().isAutenticado()){
        return navigateTo('/login')
    }else if(to.path != '/novo-prestador' && !userStore().isAutenticado()){
        return navigateTo('/login') 
    }

})
