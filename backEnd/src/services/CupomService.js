const { error } = require('console');
const db = require('../db');

module.exports = {
    buscarTodos: (idcli) => {
        return db.query('select * from terminal where inativo = ? and idCli = ?', ['N',idcli]);
    },
    buscarPorNome: (nome) => {
        return db.query('select * from cupom where nome = ?', [nome]);
    },
};

