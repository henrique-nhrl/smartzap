const MensagemService = require('../services/MensagemService');
const ContatoService = require('../services/ContatoService');
const Utils = require('../utils/utils');
const logger = require('../logger');

module.exports = {
    buscarTodas: async(req, res)=> {
        let json = {error:'', result:[]};
        let mensagens = await MensagemService.buscarTodas();

        for(let i in mensagens){
            json.result.push({
               id: mensagens[i].id,
               numDestino: mensagens[i].numdestino     
            });
        }
        res.json(json);
    },

    buscarUm: async(req, res) => {
        let json = {error: '', result: {}};
        let codigo = req.params.codigo;

        let mensagem = await MensagemService.buscarUm(codigo);
        json.result = {
            mensagem
        }
        return res.json(json);
    },

    inserir: async(req, res) => {
        let json = {error: '', result: {}};
        const newMessage = {
            dtcriacao: await Utils.formatDate(String(req.body.dtCriacao)),
            hrcriacao: await Utils.formatTime(String(req.body.hrCriacao)),
            idcli: req.body.idCli,
            idusuario: req.body.idUsuario,
            idnumorigem: req.body.idNumorigem,
            numdestino: await Utils.removeMascara(req.body.numDestino),
            contato: req.body.contato,
            dtagend: await Utils.formatDate(String(req.body.dtAgend)),
            hragend: await Utils.formatTime(String(req.body.hrAgend)),
            dtlimite: await Utils.formatDate(String(req.body.dtLimite)),
            hrlimite: await Utils.formatTime(String(req.body.hrLimite)),
            idanexo: 0,
            idtipo: 1,
            idstatus: 1,
            mensagem: req.body.mensagem,
            lista: 'N',
            prioridade: req.body.prioridade,
            vroportunidade: req.body.vrOportunidade
        };
        try {
            await MensagemService.inserir(newMessage);
            const newContato = {
                idcli: newMessage.idcli,
                idusuario: newMessage.idusuario,
                num: newMessage.numdestino,
                nome: newMessage.contato
            }
            const contato =  await ContatoService.buscarPorNumero(newContato);
            if (contato.length == 0){
                await ContatoService.inserir(newContato);
            }else {
                await ContatoService.alterar(newContato);
            }

            json.result = {
                newMessage
            }
            res.json(json);
            //res.status(200).json({msg: "Mensagem agendada com sucesso"});
        } catch (error) {
            logger.error(error);
            json.error = "Erro no servidor tente mais tarde";
            res.json(json);
            //res.status(500).json({msg: "Erro no servidor tente mais tarde"});
        }
    },

    alterar: async(req, res) => {
        let json = {error: '', result: {}};
 
        let id = req.params.codigo;
        let dtcriacao = req.body.dtcriacao;
        let hrcriacao =  Date.now();
        let idcli = req.body.idCli;
        let idusuario = req.body.idUsuario;
        let idnumorigem = 1;
        let numdestino =  req.body.numDestino;
        let contato = req.body.contato;
        let dtagend = Date.now();
        let hragend = Date.now();
        let dtlimite = Date.now();
        let hrlimite = Date.now();
        let idanexo = 0;
        let idtipo = 1;
        let idstatus = 1;
        let dtenvio = Date.now();
        let hrenvio = Date.now();
        let mensagem = req.body.mensagem;
        let lista = 'N';
        let prioridade = 0;

        if(req.body.mensagem){
            await MensagemService.alterar(id,dtcriacao, hrcriacao, idcli, idusuario,
                idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,
                hrlimite,idanexo,idtipo,idstatus,dtenvio,hrenvio,mensagem,lista,prioridade);
            json.result = {id, dtcriacao, hrcriacao, idcli, idusuario,
                           idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,
                           hrlimite,idanexo,idtipo,idstatus,dtenvio,hrenvio,mensagem,lista,prioridade
            }
        }else{
            json.error = 'Campos não enviados';
        }

        res.json(json);
    },

    excluir: async(req, res)=>{
        let json = {error:'', result:{}};
        await MensagemService.excluir(req.params.codigo);
    },

    cancelar: async(req, res)=>{
        let json = {error:'', result:{}};
        let codigo = req.params.codigo;
        try {
            await MensagemService.cancelar(codigo);
                json.result = {
                'Ok': 'Mensagem cancelada com sucesso'
            }
            res.json(json);
        //res.status(200).json({msg: "Mensagem agendada com sucesso"});
        } catch (error) {
            logger.error(error);
            json.error = "Erro no servidor tente mais tarde";
            res.json(json);
            //res.status(500).json({msg: "Erro no servidor tente mais tarde"});
        }
    },
    updateValorOportundade: async(req, res)=>{
        let json = {error:'', result:{}};
        const mensagem = req.body;
        try {
            await MensagemService.updateValorOportunidade(mensagem);
                json.result = {
                'Ok': 'Mensagem atualizada com sucesso'
            }
            res.json(json);
        //res.status(200).json({msg: "Mensagem agendada com sucesso"});
        } catch (error) {
            logger.error(error);
            json.error = "Erro no servidor tente mais tarde";
            res.json(json);
            //res.status(500).json({msg: "Erro no servidor tente mais tarde"});
        }
    },
    updateModalMensagem: async(req, res)=>{
        let json = {error:'', result:{}};
        const mensagem = req.body;
        const newMensagem = {
            id: mensagem.id,
            mensagem: mensagem.mensagem,
            dtagend: await Utils.formatDate(String(mensagem.dtagend)),
            hragend: await Utils.formatTime(String(mensagem.hragend)),
            vroportunidade: mensagem.vroportunidade,
            dtlimite: await Utils.formatDate(String(mensagem.dtlimite)),
            hrlimite: await Utils.formatTime(String(mensagem.hrlimite)),
        }

        try {
            await MensagemService.updateModalMensagem(newMensagem);
                json.result = {
                'Ok': 'Mensagem atualizada com sucesso'
            }
            res.json(json);
        //res.status(200).json({msg: "Mensagem agendada com sucesso"});
        } catch (error) {
            logger.error(error);
            json.error = "Erro no servidor tente mais tarde";
            res.json(json);
            //res.status(500).json({msg: "Erro no servidor tente mais tarde"});
        }
    },
    getMsgsNotSend: async(req, res)=> {
        filtro = {
            idCli: req.body.idCli,
            idUser: req.body.idUser,
            adminUser: req.body.adminUser,
            texto: req.body.texto,
            page: parseInt(req.body.page) || 1,
            limit: parseInt(req.body.limit) || 10
        }
       
        let mensagens = await MensagemService.getMsgsNotSend(filtro);
        return res.status(200).json(mensagens);
    },

    getMsgsSend: async(req, res)=> {
        filtro = {
            idCli: req.body.idCli,
            idUser: req.body.idUser,
            adminUser: req.body.adminUser,
            texto: req.body.texto,
            page: parseInt(req.body.page) || 1,
            limit: parseInt(req.body.limit) || 10
        }
        let mensagens = await MensagemService.getMsgsSend(filtro);
        return res.status(200).json(mensagens);
    },    

    getMsgsScheduleToday: async(req, res)=> {
        filtro = {
            idCli: req.body.idCli,
            idUser: req.body.idUser,
            adminUser: req.body.adminUser,
            texto: req.body.texto,
            page: parseInt(req.body.page) || 1,
            limit: parseInt(req.body.limit) || 10
        }
        let mensagens = await MensagemService.getMsgsScheduleToday(filtro);
        return res.status(200).json(mensagens);
    },

    getMsgsSendToday: async(req, res)=> {
        filtro = {
            idCli: req.body.idCli,
            idUser: req.body.idUser,
            adminUser: req.body.adminUser,
            texto: req.body.texto,
            page: parseInt(req.body.page) || 1,
            limit: parseInt(req.body.limit) || 10
        }
        let mensagens = await MensagemService.getMsgsSendToday(filtro);
        return res.status(200).json(mensagens);
    },    

    getMsgsPendentToday: async(req, res)=> {
        filtro = {
            idCli: req.body.idCli,
            idUser: req.body.idUser,
            adminUser: req.body.adminUser,
            texto: req.body.texto,
            page: parseInt(req.body.page) || 1,
            limit: parseInt(req.body.limit) || 10
        }
        let mensagens = await MensagemService.getMsgsPendentToday(filtro);
        return res.status(200).json(mensagens);
    },
    getMsgsCanceled: async(req, res)=> {
        filtro = {
            idCli: req.body.idCli,
            idUser: req.body.idUser,
            adminUser: req.body.adminUser,
            texto: req.body.texto,
            page: parseInt(req.body.page) || 1,
            limit: parseInt(req.body.limit) || 10
        }
        let mensagens = await MensagemService.getMsgsCanceled(filtro);
        return res.status(200).json(mensagens);
    },
    getMsgsPendentToday: async(req, res)=> {
        filtro = {
            idCli: req.body.idCli,
            idUser: req.body.idUser,
            adminUser: req.body.adminUser,
            texto: req.body.texto,
            page: parseInt(req.body.page) || 1,
            limit: parseInt(req.body.limit) || 10
        }
        let mensagens = await MensagemService.getMsgsPendentToday(filtro);
        return res.status(200).json(mensagens);
    },
    getMsgsAll: async(req, res)=> {
        filtro = {
            idCli: req.body.idCli,
            idUser: req.body.idUser,
            adminUser: req.body.adminUser,
            texto: req.body.texto,
            page: parseInt(req.body.page) || 1,
            limit: parseInt(req.body.limit) || 10
        }
        let mensagens = await MensagemService.getMsgsAll(filtro);
        return res.status(200).json(mensagens);
    }                



}