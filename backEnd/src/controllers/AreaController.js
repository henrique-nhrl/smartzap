const AreaService = require('../services/AreaService');

module.exports = {
    buscarTodas: async(req, res)=> {
        let json = {error:'', result:[]};
        
        let areas = await AreaService.buscarTodas();
        return res.status(200).json(areas);
    },
    // buscarPorNumero: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     const newContato = {
    //         idcli: req.params.idcli,
    //         num: req.params.numero
    //     }
        
    //     let contatos = await ContatoService.buscarPorNumero(newContato);
    //     return res.status(200).json(contatos);
    // },
    // consultarPorNumero: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     const newContato = {
    //         idcli: req.params.idcli,
    //         numero: req.params.numero
    //     }
        
    //     let contatos = await ContatoService.consultarPorNumero(newContato);
    //     return res.status(200).json(contatos);
    // },
    // consultarPorNome: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     const newContato = {
    //         idcli: req.params.idcli,
    //         nome: req.params.nome
    //     }
        
    //     let contatos = await ContatoService.consultarPorNome(newContato);
    //     return res.status(200).json(contatos);
    // },

    // consultarPorNomeOuNumero: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     const newContato = {
    //         idcli: req.params.idcli,
    //         texto: req.params.texto
    //     }
        
    //     let contatos = await ContatoService.consultarPorNomeOuNumero(newContato);
    //     return res.status(200).json(contatos);
    // },

    // excluir: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     let codigo = req.params.codigo;
        
    //     ContatoService.excluir(codigo);
    //     return res.status(200).json('excluido com sucesso');
    // },

    // inserir: async(req, res) => {
    //     let json = {error: '', result: {}};
    //     const newCliente = {
    //         nome: req.body.nome,
    //         responsavel: req.body.responsavel,
    //         telefone: req.body.telefone,
    //         email: req.body.email,
    //         senha: req.body.senha,
    //         idarea: req.body.idarea,
    //     };
    //     try {
    //         const cliente =  await ClienteService.inserir(newCliente);
           

    //         json.result = {
    //             newContato
    //         }
    //         res.json(json);
    //     } catch (error) {
    //         logger.error(error);
    //         json.error = "Erro no servidor tente mais tarde";
    //         res.json(json);
    //     }
    // }
}