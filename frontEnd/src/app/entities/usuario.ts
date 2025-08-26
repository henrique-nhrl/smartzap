export class Usuario {
  id?: number | undefined;
  idcli?: number | undefined;
  idtrm: number = 0;
  nome: string = '';
  email: string = '';
  pwp: string = '';
  admin?: boolean;
  inativo?: boolean;
  empresanome: string = '';
  numtel: string = '';
  apiurl: string = '';
  apiinstanceid: string = '';
  apikey: string = '';
  apienabled: string = 'N';
}
