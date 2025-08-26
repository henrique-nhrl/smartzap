const { error } = require('console');
const db = require('../db');
const logger = require('../logger');

module.exports = {
    buscarUm: (id) =>{
        return db.query('select id, titulo, texto from msg_modelo_cliente where inativo = "N" and id = ? order by titulo',[id]);
    },
    buscarTodas: (idCli) =>{
        return db.query('select id, titulo, texto from msg_modelo_cliente where inativo = "N" and idcli = ? order by titulo',[idCli]);
    },
    buscarPorTitulo: (modelo) =>{
        return db.query('select id, titulo, texto from msg_modelo_cliente where inativo = "N" and idcli = ? and titulo like ? order by titulo',[modelo.idcli, "%" + modelo.titulo + "%"]);
    },
}    