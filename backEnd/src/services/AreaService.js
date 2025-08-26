const db = require('../db');
const logger = require('../logger');

module.exports = {
    buscarTodas: () =>{
        return db.query('select * from area where inativo = ? order by nome',['N']);
    },
    // buscarPorNumero: (contato) => {
    //     return db.query('select * from contato where idcli = ? and num = ?',[contato.idcli, contato.num]);
    // },
        
    // consultarPorEmail: (contato) => {
    //     return db.query('select * from contato where idcli = ? and (lower(nome) like ? or num like ?) ',[contato.idcli, "%"+contato.texto.toLowerCase()+"%", "%"+contato.texto+"%"]);
    // },

    // excluir: (codigo) => {
    //     return db.query('delete from contato where id = ?' ,[codigo]);
    // },

    // inserir: (cliente) => {
    //     return db.query('insert into cliente (nome, responsavel,telcontato,email,idusuariocadastro, inativo, api_enabled, api_id, cobranca_ativa) values(?,?,?,?,?,?,?,?,?)',
    //         [cliente.nome, cliente.responsavel, cliente.telefone, cliente.email,0,'N','S',2,'N']);
    
    // },
    // alterar: (contato) => {
    //     return db.query('update contato set nome = ? where idcli = ? and num = ?',
    //         [contato.nome, contato.idcli, contato.num]);
    // },
}