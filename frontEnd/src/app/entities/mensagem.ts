import { DateTime } from "@eonasdan/tempus-dominus";

export class Mensagem {
    id = 0;
    dtCriacao: Date;
    hrCriacao: Date;
    idCli = 0;
    idUsuario= 0;
    idNumorigem = 0;
    numDestino: string = "";
    contato: string = "";
    dtAgend: DateTime;
    hrAgend: DateTime;
    dtLimite: Date;
    hrLimite: Date;
    idAnexo? = 0;
    idTipo? = 1;
    idStatus? = 1;
    dtEnvio?: Date;
    hrEnvio?: Date;
    mensagem: string = '';
    lista? = 'N';
    prioridade = 1;
    vrOportunidade = 0;
    modelo = '';
}
