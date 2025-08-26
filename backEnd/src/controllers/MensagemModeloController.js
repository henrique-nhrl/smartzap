const MensagemModeloService = require('../services/MensagemModeloService');
const logger = require('../logger');

module.exports = {
    buscarTodas: async(req, res)=> {
        let json = {error:'', result:[]};
        let idCli = req.params.idcli;

        let mensagensModelo = await MensagemModeloService.buscarTodas(idCli);
        if(mensagensModelo){
            logger.info(`informações modelo id ${idCli}`);
            return res.status(200).json(mensagensModelo);
        }
        return res.status(422).json({ mensagem: 'modelos não localizados'});
    },
    buscarUm: async(req, res)=> {
        let json = {error:'', result:[]};
        let id = req.params.idcli;

        let mensagensModelo = await MensagemModeloService.buscarUm(id);
        if(mensagensModelo){
            logger.info(`informações modelo id ${id}`);
            return res.status(200).json(mensagensModelo);
        }
        return res.status(422).json({ mensagem: 'modelos não localizados'});
    },
    consultarPorTitulo: async(req, res)=> {
        let json = {error:'', result:[]};
        const modelo = {
            idcli: req.params.idcli,
            titulo: req.params.titulo
        }

        let mensagensModelo = await MensagemModeloService.buscarPorTitulo(modelo);
        if(mensagensModelo){
            logger.info(`informações modelo id ${modelo.idcli}`);
            return res.status(200).json(mensagensModelo);
        }
        return res.status(422).json({ mensagem: 'modelos não localizados'});
    },
}    