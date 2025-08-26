const { error } = require('console');
const db = require('../db');
const logger = require('../logger');
const Utils = require('../utils/utils');

module.exports = {
  buscarTodas: () =>{
      return new Promise((aceito, rejeitado)=>{
          db.query('select * from msg where id < 100', (error, results)=>{
              if(error) {
                  rejeitado(error); 
                  logger.error(error);
                  return;}
              aceito(results);
          })
      })
  },

  buscarUm: (codigo) => {
      return db.query('select * from msg where id = ?', [codigo]);
  },

  inserir: async (mensagem) => {
    return db.query('insert into msg (dtcriacao, hrcriacao, idcli, idusuario,'+
        'idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,'+
        'hrlimite,idanexo,idtipo,idstatus,mensagem,'+
        'lista,prioridade,vroportunidade) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [mensagem.dtcriacao, mensagem.hrcriacao, mensagem.idcli, mensagem.idusuario, 
      mensagem.idnumorigem, mensagem.numdestino, mensagem.contato, mensagem.dtagend, mensagem.hragend, mensagem.dtlimite, 
      mensagem.hrlimite, mensagem.idanexo, mensagem.idtipo, mensagem.idstatus, mensagem.mensagem, 
      mensagem.lista, mensagem.prioridade, mensagem.vroportunidade])
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
                  if(error) {
                      rejeitado(error); 
                      logger.error(error);
                      return;}
                  aceito(results.insertCodigo)
              } )
      })
  },

  excluir: (codigo) =>{
      return new Promise((aceito, rejeitado)=>{
          db.query('delete from msg where id = ?',[codigo], (error, results)=>{
              if(error) { rejeitado(error); return;}
              aceito(results);
          })
      })
  },

  cancelar: (codigo) => {
    return db.query('update msg set idstatus=3 where id=? and idstatus=1', [codigo]);
  },

  updateValorOportunidade: (mensagem) => {
    return db.query('update msg set vroportunidade=? where id=?', [mensagem.vroportunidade,mensagem.id]);
  },

  updateModalMensagem: (mensagem) => {
    return db.query('update msg set vroportunidade=?, mensagem=?, dtagend=?, hragend=?, dtlimite=?, hrlimite=? where id=?', 
      [mensagem.vroportunidade,
        mensagem.mensagem,
        mensagem.dtagend,
        mensagem.hragend,
        mensagem.dtlimite,
        mensagem.hrlimite,
        mensagem.id]);
  },

  getMsgsNotSend(filtro) {
    const conditions = [{ query: 'm.idstatus = ?', values: [1] }];
    const { baseQuery, values } = buildBaseQuery(filtro, conditions);
    return executeQuery(baseQuery, values, filtro);
  },

  getMsgsSend(filtro) {
      const conditions = [{ query: 'm.idstatus = ?', values: [2] }];
      const { baseQuery, values } = buildBaseQuery(filtro, conditions);
      return executeQuery(baseQuery, values, filtro);
  },

  getMsgsScheduleToday(filtro) {
      const conditions = [{ query: 'DATE(m.dtcriacao) = CURRENT_DATE', values: [] }];
      const { baseQuery, values } = buildBaseQuery(filtro, conditions);
      return executeQuery(baseQuery, values, filtro);
  },

  getMsgsSendToday(filtro) {
      const conditions = [
          { query: 'm.idstatus = ?', values: [2] },
          { query: 'DATE(m.dtenvio) = CURRENT_DATE', values: [] }
      ];
      const { baseQuery, values } = buildBaseQuery(filtro, conditions);
      return executeQuery(baseQuery, values, filtro);
  },

  getMsgsPendentToday(filtro) {
      const conditions = [
          { query: 'm.idstatus = ?', values: [1] },
          { query: 'DATE(m.dtagend) = CURRENT_DATE', values: [] }
      ];
      const { baseQuery, values } = buildBaseQuery(filtro, conditions);
      return executeQuery(baseQuery, values, filtro);
  },

  getMsgsCanceled(filtro) {
      const conditions = [{ query: '(m.idstatus = 3 OR m.idstatus = 4)', values: [] }];
      const { baseQuery, values } = buildBaseQuery(filtro, conditions);
      return executeQuery(baseQuery, values, filtro);
  },

  getMsgsAll(filtro) {
      const { baseQuery, values } = buildBaseQuery(filtro);
      return executeQuery(baseQuery, values, filtro);
  },

};

function buildBaseQuery(filtro, conditions = []) {
  filtro.texto = filtro.texto.toLowerCase();

  let baseQuery = `
      FROM msg m 
      LEFT JOIN usuario u ON u.id = m.idusuario 
      LEFT JOIN msg_status ms ON ms.id = m.idstatus 
      WHERE m.idcli = ?
  `;
  
  const values = [filtro.idCli];
  
  if (filtro.adminUser === 'N') {
      baseQuery += ` AND m.idusuario = ?`;
      values.push(filtro.idUser);
  }

  if (filtro.texto !== '') {
      baseQuery += `
          AND (LOWER(u.nome) LIKE ? 
            OR LOWER(m.numdestino) LIKE ? 
            OR LOWER(m.contato) LIKE ? 
            OR LOWER(m.mensagem) LIKE ?)
      `;
      const searchText = `%${filtro.texto}%`;
      values.push(searchText, searchText, searchText, searchText);
  }

  if (conditions.length > 0) {
      conditions.forEach(condition => {
          baseQuery += ` AND ${condition.query}`;
          values.push(...condition.values);
      });
  }

  return { baseQuery, values };
}

function buildQueryWithPagination(baseQuery, values, filtro) {
  const offset = (filtro.page - 1) * filtro.limit;
  
  const query = `
      SELECT m.id, m.idstatus, m.dtcriacao, m.hrcriacao, u.nome as usuario, 
             m.numdestino, m.contato, m.dtagend, m.hragend, m.dtenvio, m.hrenvio, 
             m.mensagem, ms.descricao as status, COALESCE(m.vroportunidade, 0) AS vroportunidade,
             m.dtlimite, m.hrlimite
      ${baseQuery}
      ORDER BY m.id DESC LIMIT ? OFFSET ?
  `;
  
  values.push(filtro.limit, offset);
  
  return { query, values };
}

function executeQuery(baseQuery, countValues, filtro) {
  const { query, values } = buildQueryWithPagination(baseQuery, countValues.slice(), filtro); // clone countValues para query

  return db.query(query, values)
      .then(results => {
          if (results.length === 0) {
              return { totalPages: 0, mensagens: [] };
          }

          const countQuery = `SELECT COUNT(*) AS count, SUM(vroportunidade) as valor ${baseQuery}`;
          return db.query(countQuery, countValues)
              .then(countResult => {
                  const totalRecords = countResult[0].count;
                  const totalValor = countResult[0].valor;
                  const totalPages = Math.ceil(totalRecords / filtro.limit);

                  return {
                      totalMensagens: totalRecords,
                      totalOportunidades: totalValor,
                      totalPages: totalPages,
                      mensagens: results
                  };
              });
      })
      .catch(err => {
          console.error(err);
          throw new Error('Erro ao buscar mensagens');
      });
}


