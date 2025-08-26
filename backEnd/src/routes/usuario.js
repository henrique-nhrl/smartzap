const express = require('express');
const router = express.Router();

const UsuarioController = require('../controllers/UsuarioController');
const Utils = require('../utils/utils');

router.get('/usuarios', UsuarioController.buscarTodas);
router.get('/usuario/:codigo', Utils.checkToken, UsuarioController.buscarUm);
router.post('/usuario', UsuarioController.inserir);
router.put('/usuario/:codigo', UsuarioController.alterar);
router.delete('/usuario/:codigo', UsuarioController.excluir);
router.post('/login', UsuarioController.login);
router.get('/usuario/getByEmail/:email', UsuarioController.buscarPorEmail);
router.get('/usuarioEmpresa', UsuarioController.usuarioEmpresa);
router.post('/forgotPassword', UsuarioController.forgotPassword);
router.post('/resetPassword', UsuarioController.resetPassword);

module.exports =router;