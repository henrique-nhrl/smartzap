const db = require('../db');
const logger = require('../logger');

module.exports = {
    // buscarTodas: () =>{
    //     return db.query('select * from area where inativo = ? order by nome',['N']);
    // },
    // buscarPorNumero: (contato) => {
    //     return db.query('select * from contato where idcli = ? and num = ?',[contato.idcli, contato.num]);
    // },
        
    // consultarPorEmail: (contato) => {
    //     return db.query('select * from contato where idcli = ? and (lower(nome) like ? or num like ?) ',[contato.idcli, "%"+contato.texto.toLowerCase()+"%", "%"+contato.texto+"%"]);
    // },

    // excluir: (codigo) => {
    //     return db.query('delete from contato where id = ?' ,[codigo]);
    // },

    inserir: async (clienteArea) => {
        return db.query('insert into cliente_area (idcli, idarea) values(?,?)',
           [clienteArea.idcli, clienteArea.idarea])
        .then(result => {
            return result.insertId;
        });    
    },
    // alterar: (contato) => {
    //     return db.query('update contato set nome = ? where idcli = ? and num = ?',
    //         [contato.nome, contato.idcli, contato.num]);
    // },
}