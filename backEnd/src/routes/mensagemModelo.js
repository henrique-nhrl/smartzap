const express = require('express');
const router = express.Router();

const MensagemModeloController = require('../controllers/MensagemModeloController');

router.get('/mensagensModelo/:idcli', MensagemModeloController.buscarTodas);
router.get('/mensagensModelo/selecionarPorTitulo/:idcli/:titulo', MensagemModeloController.consultarPorTitulo);
router.get('/mensagemModelo/:codigo', MensagemModeloController.buscarUm);
// router.post('/mensagem', MensagemModeloController.inserir);
// router.put('/mensagem/:codigo', MensagemModeloController.alterar);
// router.delete('/mensagem/:codigo', MensagemModeloController.excluir);

module.exports =router;