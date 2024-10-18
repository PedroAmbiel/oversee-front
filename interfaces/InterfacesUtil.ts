export interface Clientes{
    id : number,
    dataNascimento: Date,
    nome: string,
    rg: string,
    cpf: string,
    fkPrestador: number,
    dataCadastro: Date
}