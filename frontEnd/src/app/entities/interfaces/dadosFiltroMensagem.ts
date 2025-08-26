export interface DadosFiltroMensagem {
  idCli?: number;
  idUser?: number;
  adminUser?: boolean;
  texto: string;
  page: number;
  limit: number;
}
