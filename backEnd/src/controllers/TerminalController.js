const TerminalService = require('../services/TerminalService');
const Utils = require('../utils/utils');

module.exports = {
    buscarTodos: async(req, res)=> {
        let json = {error:'', result:[]};
        let idCli = req.params.idcli;
        let terminais = await TerminalService.buscarTodos(idCli);
        for(let i in terminais){
            json.result.push({
               id: terminais[i].id,
               idcli: terminais[i].idcli,
               numtel: terminais[i].numtel,
            //    dtativacao: terminais[i].dtativacao,
            //    hrativacao: terminais[i].hrativacao, 
            //    upcontatos: terminais[i].upcontatos,
            //    lastsync: terminais[i].lastsync,
            //    inativo: terminais[i].inativo,
            //    cel11: terminais[i].cel11,
            //    api_instanceid: terminais[i].api_instanceid,
            //    api_key: terminais[i].api_key
            });
        }
        //res.json(json);
        return res.status(200).json(json.result);
    },
    getApiKey: async(req, res)=> {
        const apiKey = await Utils.generateRandomString();
        return res.status(200).json({apikey: apiKey});
    },
    updateApiKey: async(req, res)=>{
        let json = {error:'', result:{}};
        const updateTerminal = {
           id: req.body.id,
           apikey: req.body.apikey
        };
        try {
            await TerminalService.updateApiKey(updateTerminal);
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
}