const express = require('express');
const router = express.Router();

const ContatoController = require('../controllers/ContatoController');

router.get('/contatos/:idcli', ContatoController.buscarTodas);
router.get('/contatos/buscarPorNumero/:idcli/:numero', ContatoController.buscarPorNumero);
router.get('/contatos/consultarPorNumero/:idcli/:numero', ContatoController.consultarPorNumero);
router.get('/contatos/consultarPorNome/:idcli/:nome', ContatoController.consultarPorNome);
router.get('/contatos/consultarPorNomeOuNumero/:idcli/:texto', ContatoController.consultarPorNomeOuNumero);
// router.get('/mensagem/:codigo', MensagemController.buscarUm);
router.post('/contato', ContatoController.inserir);
// router.put('/mensagem/:codigo', MensagemController.alterar);
router.delete('/contato/:codigo', ContatoController.excluir);
router.get('/contato/consultarPorNomeENumero/:idcli/:nome/:numero', ContatoController.consultarPorNomeENumero);

module.exports =router;