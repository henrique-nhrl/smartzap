const express = require('express');
const router = express.Router();

const CupomController = require('../controllers/CupomController');

router.get('/buscarPorNome/:nome', CupomController.buscarPorNome);
module.exports =router;