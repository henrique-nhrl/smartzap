const { error } = require('console');
const db = require('../db');
const { updateApiKey } = require('../controllers/TerminalController');

module.exports = {
    buscarTodos: (idcli) => {
        return db.query('select * from terminal where inativo = ? and idCli = ?', ['N',idcli]);
    },
    inserir: async (terminal) => {
        return db.query('insert into terminal(idcli, numtel,inativo, api_instanceid,api_key) values(?,?,?,?,?)',
            [terminal.idcli, terminal.numtel, terminal.inativo, terminal.apiinstanceid, terminal.apikey])
        .then(result => {
           return result.insertId;
        });    
    },                                                                          
    buscarPorNumero: (telefone) => {
        return db.query('select * from terminal where numtel = ?', [telefone]);
    },
    updateApiKey: (terminal) => {
        return db.query('update terminal set api_key = ? where id = ?', [terminal.apikey, terminal.id]);
    },
};

