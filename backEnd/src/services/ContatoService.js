const db = require('../db');
const logger = require('../logger');

module.exports = {
    buscarTodas: (idCli) =>{
        return db.query('select * from contato where idcli = ? order by nome',[idCli]);
    },
    buscarPorNumero: (contato) => {
        return db.query('select * from contato where idcli = ? and num = ?',[contato.idcli, contato.num]);
    },
        
    consultarPorNomeOuNumero: (contato) => {
        return db.query('select * from contato where idcli = ? and (lower(nome) like ? or num like ?) ',[contato.idcli, "%"+contato.texto.toLowerCase()+"%", "%"+contato.texto+"%"]);
    },

    excluir: (codigo) => {
        return db.query('delete from contato where id = ?' ,[codigo]);
    },

    inserir: async (contato) => {
        return db.query('insert into contato (idcli, idusuario,num,nome) values(?,?,?,?)',
            [contato.idcli, contato.idusuario, contato.num, contato.nome])
        .then(result => {
            return result.insertId;
        });    
    },
    alterar: (contato) => {
        return db.query('update contato set nome = ? where idcli = ? and num = ?',
            [contato.nome, contato.idcli, contato.num]);
    },

    consultarPorNomeENumero: (contato) => {
        return db.query('select * from contato where idcli = ? and (lower(nome) = ? and num = ?) ',[contato.idcli, contato.nome.toLowerCase(), contato.numero]);
    },
}