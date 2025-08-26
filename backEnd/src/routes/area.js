const express = require('express');
const router = express.Router();

const AreaController = require('../controllers/AreaController');

router.get('/areas', AreaController.buscarTodas);
// router.get('/contatos/buscarPorNumero/:idcli/:numero', ContatoController.buscarPorNumero);
// router.get('/contatos/consultarPorNumero/:idcli/:numero', ContatoController.consultarPorNumero);
// router.get('/contatos/consultarPorNome/:idcli/:nome', ContatoController.consultarPorNome);
// router.get('/contatos/consultarPorNomeOuNumero/:idcli/:texto', ContatoController.consultarPorNomeOuNumero);
//router.post('/area', ClienteController.inserir);
// router.delete('/contato/:codigo', ContatoController.excluir);

module.exports =router;