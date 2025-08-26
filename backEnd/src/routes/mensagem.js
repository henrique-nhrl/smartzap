const express = require('express');
const router = express.Router();

const MensagemController = require('../controllers/MensagemController');

router.get('/mensagens', MensagemController.buscarTodas);
router.get('/mensagem/:codigo', MensagemController.buscarUm);
router.post('/mensagem', MensagemController.inserir);
router.put('/mensagem/alterar/:codigo', MensagemController.alterar);
router.delete('/mensagem/:codigo', MensagemController.excluir);
router.put('/mensagem/cancelar/:codigo', MensagemController.cancelar);
router.put('/mensagem/updateValorOportundade', MensagemController.updateValorOportundade);
router.put('/mensagem/updateModalMensagem', MensagemController.updateModalMensagem);
router.post('/mensagens/getMsgsNotSend', MensagemController.getMsgsNotSend);
router.post('/mensagens/getMsgsSend', MensagemController.getMsgsSend);
router.post('/mensagens/getMsgsScheduleToday', MensagemController.getMsgsScheduleToday);
router.post('/mensagens/getMsgsSendToday', MensagemController.getMsgsSendToday);
router.post('/mensagens/getMsgsCanceled', MensagemController.getMsgsCanceled);
router.post('/mensagens/getMsgsAll', MensagemController.getMsgsAll);

router.post('/mensagens/getMsgsPendentToday', MensagemController.getMsgsPendentToday);
module.exports =router;