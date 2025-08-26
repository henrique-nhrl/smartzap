const db = require('../db');
const logger = require('../logger');

module.exports = {
    // buscarTodas: (idCli) =>{
    //     return db.query('select * from contato where idcli = ? order by nome',[idCli]);
    // },
    // buscarPorNumero: (contato) => {
    //     return db.query('select * from contato where idcli = ? and num = ?',[contato.idcli, contato.num]);
    // },
        
    buscarPorEmail: (email) => {
        return db.query('select * from cliente where email = ?',[email]);
    },

    // excluir: (codigo) => {
    //     return db.query('delete from contato where id = ?' ,[codigo]);
    // },

    inserir: async (cliente) => {
        return db.query('insert into cliente (nome, responsavel,telcontato,email,idusuariocadastro, inativo, api_enabled, api_id, cobranca_ativa, idcupom) values(?,?,?,?,?,?,?,(select id from api WHERE api_default = ?),?,?)',
            [cliente.nome, cliente.responsavel, cliente.telefone, cliente.email,0,'N','S','S','N', cliente.idcupom])
        .then(result => {
            return result.insertId;
        })
    },

    // inserir: async (cliente) => {
    //     return db.query('insert into cliente (nome, responsavel,telcontato,email,idusuariocadastro, inativo, api_enabled, api_id, cobranca_ativa, idcupom) values(?,?,?,?,?,?,?,?,?,?)',
    //         [cliente.nome, cliente.responsavel, cliente.telefone, cliente.email,0,'N','S',3,'N', cliente.idcupom])
    //     .then(result => {
    //         return result.insertId;
    //     })
    // },

    // alterar: (contato) => {
    //     return db.query('update contato set nome = ? where idcli = ? and num = ?',
    //         [contato.nome, contato.idcli, contato.num]);
    // },
}