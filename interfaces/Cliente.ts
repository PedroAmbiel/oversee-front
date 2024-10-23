export class Cliente{
    id: number = 0;
    nome: string = '';
    dataNascimento: Date = new Date();
    rg: string = '';
    cpf: string = '';
    fkPrestador: number = 0;
    dataCadastro: Date = new Date();
}

export enum TipoAgendamento {
    REUNIAO = 'Reunião',
    SERVICO = 'Serviço',
    OUTRO = 'Outro',
}

export enum TipoDocumento{
    NOTA_FISCAL = "Nota Fiscal",
    CONTRATO = "Contrato",
    OUTRO = "Outro",
}