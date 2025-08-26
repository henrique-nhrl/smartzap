const { error } = require('console');
//const { buscarTodas, excluir, inserir } = require('../controllers/UsuarioController');
const db = require('../db');
const logger = require('../logger');

module.exports = {
    buscarTodas: () =>{
        return new Promise((aceito, rejeitado)=>{
            db.query('select * from usuario where id < 100', (error, results)=>{
                if(error) {
                    rejeitado(error); 
                    logger.error(error);
                    return;}
                aceito(results);
            })
        })
    },

    buscarUm: (codigo) => {
        return db.query('select usu.id, usu.idtrm, usu.nome, usu.email, usu.admin, cli.nome as empresanome, trm.numtel, ' +
            'cli.api_enabled as apienabled, api.api_url as apiurl, trm.api_instanceid as apiinstanceid, trm.api_key as apikey, usu.idcli ' +
            'from usuario usu ' +
            'left join cliente cli on cli.id = usu.idcli ' +
            'left join terminal trm on trm.id = usu.idtrm ' +
            'left join api api on api.id = cli.api_id ' +
            'where usu.inativo = "N" and usu.id = ?', [codigo]);
    },

    inserir: async (usuario) => {
        return db.query('insert into usuario(idcli,idtrm,nome,email,pwd,admin,inativo) values(?,?,?,?,?,?,?)',
            [usuario.idcli, usuario.idtrm, usuario.nome, usuario.email, usuario.pwd, usuario.admin, usuario.inativo])
        .then(result => {
            return result.insertId;
        });
    },

    alterar: (id, dtcriacao, hrcriacao, idcli, idusuario,
        idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,
        hrlimite,idanexo,idtipo,idstatus,dtenvio,hrenvio,mensagem,lista,prioridade) => {
            return new Promise((aceito, rejeitado)=>{
                db.query('update msg set dtcriacao = ?, hrcriacao = ?, idcli = ?, idusuario = ?,'+
                         'idnumorigem = ?,numdestino = ?,contato = ?,dtagend = ?,hragend = ?,dtlimite = ?,'+
                         'hrlimite = ?,idanexo = ?,idtipo = ?,idstatus = ?,dtenvio = ?,hrenvio = ?,mensagem = ?,'+
                         'lista = ?,prioridade = ? where id = ?',
                        [dtcriacao, hrcriacao, idcli, idusuario,
                        idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,
                        hrlimite,idanexo,idtipo,idstatus,dtenvio,hrenvio,mensagem,lista,prioridade,id],
                    (error, results)=>{
                        if(error) {rejeitado(error); return;}
                        aceito(results.insertCodigo)
                    }
                )
            }
        )
    },

    excluir: (codigo) =>{
        return new Promise((aceito, rejeitado)=>{
            db.query('delete from msg where id = ?',[codigo], (error, results)=>{
                if(error) { rejeitado(error); return;}
                aceito(results);
            })
        })
    },
    buscarPorEmail: (email) =>{
        return db.query('select * from usuario where email = ?', [email]);
    },
    usuarioEmpresa: () => {
        return db.query('select usu.id, usu.idtrm, usu.nome, usu.email, usu.admin, cli.nome as empresanome, trm.numtel, ' +
            'cli.api_enabled as apienabled, api.api_url as apiurl, trm.api_instanceid as apiinstanceid, trm.api_key as apikey, usu.idcli ' +
            'from usuario usu ' +
            'left join cliente cli on cli.id = usu.idcli ' +
            'left join terminal trm on trm.id = usu.idtrm ' +
            'left join api api on api.id = cli.api_id ' +
            'where usu.inativo = "N" and usu.id = ?', [process.env.ADMIN_USER_ID ]);
    },
    usuarioApiPorEmail: (email) => {
        return db.query('select usu.id, usu.idtrm, usu.nome, usu.email, usu.admin, cli.nome as empresanome, trm.numtel, ' +
            'cli.api_enabled as apienabled, api.api_url as apiurl, trm.api_instanceid as apiinstanceid, trm.api_key as apikey, usu.idcli ' +
            'from usuario usu ' +
            'left join cliente cli on cli.id = usu.idcli ' +
            'left join terminal trm on trm.id = usu.idtrm ' +
            'left join api api on api.id = cli.api_id ' +
            'where usu.inativo = "N" and usu.email = ?', [email]);
    },
    atualizarSenha: (userId, newPwd) => {
        return db.query('update usuario set pwd = ? where id = ?', [newPwd, userId]);
    },
};

