const express = require('express');
const router = express.Router();

const TerminalController = require('../controllers/TerminalController');

router.get('/terminais/:idcli', TerminalController.buscarTodos);
// router.get('/terminal/:codigo', Utils.checkToken, UsuarioController.buscarUm);
// router.post('/terminal', UsuarioController.inserir);
// router.put('/terminal/:codigo', UsuarioController.alterar);
// router.delete('/terminal/:codigo', UsuarioController.excluir);
router.get('/getApiKey', TerminalController.getApiKey);
router.put('/updateApiKey', TerminalController.updateApiKey);
module.exports =router;