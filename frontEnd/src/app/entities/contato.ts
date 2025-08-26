export class Contato {
  id?: number;
  idcli?: number;
  idusuario?: number;
  num: string = "";
  nome: string = "";

  constructor(id?: number, idcli?: number, idusuario?: number, num: string = "", nome: string = "") {
      this.id = id;
      this.idcli = idcli;
      this.idusuario = idusuario;
      this.num = num;
      this.nome = nome;
  }
}


