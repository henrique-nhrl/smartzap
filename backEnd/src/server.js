require('dotenv').config({path:'variaveis.env'});
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const logger = require('./logger');
const mensagem = require('../src/routes/mensagem');
const usuario = require('../src/routes/usuario');
const contato = require('../src/routes/contato');
const terminal = require('../src/routes/terminal');
const mensagemModelo = require('../src/routes/mensagemModelo');
const cliente = require('../src/routes/cliente');
const area = require('../src/routes/area');
const cupom = require('../src/routes/cupom');

const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use('/api', mensagem);
server.use('/api', usuario);
server.use('/api', contato);
server.use('/api', terminal);
server.use('/api', mensagemModelo);
server.use('/api', cliente);
server.use('/api', area);
server.use('/api', cupom);

server.listen(process.env.PORT, ()=>{
    logger.info(`servidor rodando em: http://${process.env.SERVER_IP}:${process.env.PORT}`);
})