const ContatoService = require('../services/ContatoService');

module.exports = {
    buscarTodas: async(req, res)=> {
        let json = {error:'', result:[]};
        let idCli = req.params.idcli;
        
        let contatos = await ContatoService.buscarTodas(idCli);
        return res.status(200).json(contatos);
    },
    buscarPorNumero: async(req, res)=> {
        let json = {error:'', result:[]};
        const newContato = {
            idcli: req.params.idcli,
            num: req.params.numero
        }
        
        let contatos = await ContatoService.buscarPorNumero(newContato);
        return res.status(200).json(contatos);
    },
    consultarPorNumero: async(req, res)=> {
        let json = {error:'', result:[]};
        const newContato = {
            idcli: req.params.idcli,
            numero: req.params.numero
        }
        
        let contatos = await ContatoService.consultarPorNumero(newContato);
        return res.status(200).json(contatos);
    },
    consultarPorNome: async(req, res)=> {
        let json = {error:'', result:[]};
        const newContato = {
            idcli: req.params.idcli,
            nome: req.params.nome
        }
        
        let contatos = await ContatoService.consultarPorNome(newContato);
        return res.status(200).json(contatos);
    },

    consultarPorNomeOuNumero: async(req, res)=> {
        let json = {error:'', result:[]};
        const newContato = {
            idcli: req.params.idcli,
            texto: req.params.texto
        }
        
        let contatos = await ContatoService.consultarPorNomeOuNumero(newContato);
        return res.status(200).json(contatos);
    },

    excluir: async(req, res)=> {
        let json = {error:'', result:[]};
        let codigo = req.params.codigo;
        
        ContatoService.excluir(codigo);
        return res.status(200).json('excluido com sucesso');
    },

    inserir: async(req, res) => {
        let json = {error: '', result: {}};
        const newContato = {
            idcli: req.body.idcli,
            idusuario: req.body.idusuario,
            num: req.body.num,
            nome: req.body.nome
        };
        try {
            // const contato =  await ContatoService.buscarPorNumero(newContato);
            // if (contato.length == 0){
                await ContatoService.inserir(newContato);
            // }else {
            //     await ContatoService.alterar(newContato);
            // }

            json.result = {
                newContato
            }
            res.json(json);
        } catch (error) {
            logger.error(error);
            json.error = "Erro no servidor tente mais tarde";
            res.json(json);
        }
    },
    consultarPorNomeENumero: async(req, res)=> {
        let json = {error:'', result:[]};
        const newContato = {
            idcli: req.params.idcli,
            nome: req.params.nome,
            numero: req.params.numero,
        }
        
        let contatos = await ContatoService.consultarPorNomeENumero(newContato);
        return res.status(200).json(contatos);
    },
}