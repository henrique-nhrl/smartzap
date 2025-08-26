const express = require('express');
const router = express.Router();

const ClienteController = require('../controllers/ClienteController');

// router.get('/contatos/:idcli', ContatoController.buscarTodas);
// router.get('/contatos/buscarPorNumero/:idcli/:numero', ContatoController.buscarPorNumero);
// router.get('/contatos/consultarPorNumero/:idcli/:numero', ContatoController.consultarPorNumero);
// router.get('/contatos/consultarPorNome/:idcli/:nome', ContatoController.consultarPorNome);
// router.get('/contatos/consultarPorNomeOuNumero/:idcli/:texto', ContatoController.consultarPorNomeOuNumero);
router.post('/cliente', ClienteController.inserir);
// router.delete('/contato/:codigo', ContatoController.excluir);
//router.get('/teste', ClienteController.teste);

module.exports =router;