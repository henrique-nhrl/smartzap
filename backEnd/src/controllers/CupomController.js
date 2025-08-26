const CupomService = require('../services/CupomService');

module.exports = {
    buscarPorNome: async(req, res)=> {
        let json = {error: '', result: {}};

        let nome = req.params.nome;
        let cupom = await CupomService.buscarPorNome(nome);
        if(cupom.length !== 0){
            return res.status(200).json(cupom);
        }

        return res.status(422).json({ mensagem: 'Cupom Inváldo ou Expirado'});
    },

}