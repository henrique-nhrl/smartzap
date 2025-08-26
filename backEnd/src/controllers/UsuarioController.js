const logger = require('../logger');
const UsuarioService = require('../services/UsuarioService');
const Utils = require('../utils/utils');
const jwt = require('jsonwebtoken');
const Email = require('../utils/emailSender');


module.exports = {
    buscarTodas: async(req, res)=> {
        let json = {error:'', result:[]};

        let usuarios = await UsuarioService.buscarTodas();

        for(let i in usuarios){
            json.result.push({
               id: usuarios[i].id,
               numDestino: usuarios[i].numdestino     
            });
        }
        res.json(json);
    },

    buscarUm: async(req, res) => {
        let json = {error: '', result: {}};

        let codigo = req.params.codigo;
        let usuario = await UsuarioService.buscarUm(codigo);
        
        if(usuario){
            return res.status(200).json(usuario);
        }

        return res.status(422).json({ mensagem: 'Usuario não localizado'});
    },

    inserir: async(req, res) => {
        let json = {error: '', result: {}};
        let dtcriacao = Date.now().form; //req.body.usuario.tdcriacao;
        let hrcriacao =  Date.now();
        let idcli = 42; //req.body.idCli;
        let idusuario = 59;//= req.body.idUsuario;
        let idnumorigem = 1;
        let numdestino = 11111111111; // req.body.numDestino;
        let contato =  'teste'; // req.body.contato;
        let dtagend = Date.now();
        let hragend = Date.now();
        let dtlimite = Date.now();
        let hrlimite = Date.now();
        let idanexo = 0;
        let idtipo = 1;
        let idstatus = 1;
        let dtenvio = Date.now();
        let hrenvio = Date.now();
        let mensagem = req.body.mensagem;
        let lista = 'N';
        let prioridade = 0;

        

        if(req.body.mensagem){
            await UsuarioService.inserir(dtcriacao, hrcriacao, idcli, idusuario,
                idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,
                hrlimite,idanexo,idtipo,idstatus,dtenvio,hrenvio,mensagem,lista,prioridade);
            json.result = {
                dtcriacao, hrcriacao, idcli, idusuario,
                idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,
                hrlimite,idanexo,idtipo,idstatus,dtenvio,hrenvio,mensagem,lista,prioridade
            }
        }else{
            json.error = 'Campos não enviados';
        }

        res.json(json);
    },

    alterar: async(req, res) => {
        let json = {error: '', result: {}};
 
        let id = req.params.codigo;
        let dtcriacao = req.body.dtcriacao;
        let hrcriacao =  Date.now();
        let idcli = req.body.idCli;
        let idusuario = req.body.idUsuario;
        let idnumorigem = 1;
        let numdestino =  req.body.numDestino;
        let contato = req.body.contato;
        let dtagend = Date.now();
        let hragend = Date.now();
        let dtlimite = Date.now();
        let hrlimite = Date.now();
        let idanexo = 0;
        let idtipo = 1;
        let idstatus = 1;
        let dtenvio = Date.now();
        let hrenvio = Date.now();
        let mensagem = req.body.mensagem;
        let lista = 'N';
        let prioridade = 0;

        if(req.body.usuario){
            await UsuarioService.alterar(id,dtcriacao, hrcriacao, idcli, idusuario,
                idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,
                hrlimite,idanexo,idtipo,idstatus,dtenvio,hrenvio,mensagem,lista,prioridade);
            json.result = {id, dtcriacao, hrcriacao, idcli, idusuario,
                           idnumorigem,numdestino,contato,dtagend,hragend,dtlimite,
                           hrlimite,idanexo,idtipo,idstatus,dtenvio,hrenvio,mensagem,lista,prioridade
            }
        }else{
            json.error = 'Campos não enviados';
        }

        res.json(json);
    },

    excluir: async(req, res)=>{
        return res.status(200).json({ message: req.query});
        let json = {error:'', result:{}};
        await UsuarioService.excluir(req.query);
    },

    login: async(req, res)=>{
        const {email, senha } = req.body;
        logger.info(`Buscar usuario: ${email}`);
        let usuario = await UsuarioService.buscarPorEmail(email);
        if(!usuario[0]) {
            logger.info(`Email não cadastrado: ${email}`);
            return res.status(422).json({ mensagem: 'Email não cadastrado'});
        };

        if(usuario[0].inativo === 'S') {
            logger.info(`Usuario inativo: ${email}`);
            return res.status(422).json({ mensagem: 'Usuário inativo'});
        };

        if(!(await Utils.compareHash(senha, usuario[0].pwd ))){
            logger.info(`Senha informada incorreta: ${email}`);
           return res.status(422).json({ mensagem: 'Senha informada incorreta'});
        };

        try {
            const secret = process.env.SECRET
            const token = jwt.sign(
                {
                    idCli: usuario[0].idCli,
                    idUsuario: usuario[0].id
                },
                secret,
                { expiresIn: '2h'}
            )
            logger.info(`Autenticação realizada com sucesso: ${email}`);           
            res.status(200).json({msg: "Autenticação realizada com sucesso", idCli:usuario[0].idcli, idUsuario: usuario[0].id, token});
        } catch (error) {
            logger.error(`erro ${error}`);
            res.status(500).json({msg: "Erro no servidor tente mais tarde"});
        }

    },
    buscarPorEmail: async(req, res) => {
        let json = {error: '', result: {}};

        let email = req.params.email;
        let usuario = await UsuarioService.buscarPorEmail(email);
        
        if(usuario.length > 0){
           const newUsuario = {
            id: usuario[0].id,
            nome: usuario[0].nome,
            email: usuario[0].email
           }
           return res.status(200).json(newUsuario);
        }

        return res.status(422).json({ mensagem: 'Usuario não localizado'});
    },
    usuarioEmpresa: async(req, res) => {
        let json = {error: '', result: {}};

        let usuario = await UsuarioService.usuarioEmpresa();
        
        if(usuario){
            return res.status(200).json(usuario);
        }

        return res.status(422).json({ mensagem: 'Usuario não localizado'});
    },
    forgotPassword: async(req, res) => {
        const { email } = req.body;
        // Verifique se o e-mail existe no banco de dados
        try {
            const user = await UsuarioService.usuarioApiPorEmail(email);
            
            if (user.length === 0) {
                return res.status(404).json({mensagem:'E-mail não existe'});
            }

            const userId = user[0].id;
            // Gerar o token de redefinição de senha
            const resetToken = jwt.sign({ id: userId }, process.env.SECRET, {
            expiresIn: '1h'
            });
            // Enviar o e-mail com o link de redefinição
            const resetLink = `${process.env.SERVER_URL}/reset-password/${resetToken}`;
            
            await sendResendEmail(user[0], resetLink);
            return res.status(200).json({ mensagem: 'Link de redefinição de senha enviado'});
        } catch (error) {
          return res.status(500).json({erro: 'Erro ao processar a solicitação'});
        }
    },
    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;
        try {
          const decoded = jwt.verify(token, process.env.SECRET);
          const user = await UsuarioService.buscarUm(decoded.id);
          if (user.length === 0) {
            return res.status(404).json({erro:'User not found'});
          }
          //Alterar senha
          const pwd = await Utils.hashValue(newPassword); 
          await UsuarioService.atualizarSenha(user[0].id, pwd);
      
          return res.status(200).json({mensagem: 'Senha alterada com sucesso'});
        } catch (error) {
            return res.status(400).json({mensagem:'Token inválido ou expirado'});
        }
      }
}

async function sendResendEmail(usuario, resetLink) {
    const url = resetLink;
    const mensagem = `
        <h1>Olá, ${usuario.nome}</h1>
        <br>
        <p>Para recuperar a sua senha, clique no link abaixo. Caso não consiga, copie e cole o endereço no seu navegador.</p>
        <p><a href='${url}'>${url}</a></p>
        <br>
        <p>O link gerado irá expirar em 1 (uma) horas.</p>
        <br>
        <p>Caso você não tenha solicitado a alteração de sua senha, desconsidere este e-mail.</p>
        <br>
        <div style='text-align : center; font-size: 0.8em;'>  
            <p>${new Date().getUTCFullYear()} - Equipe SmartZap.</p>
            <p>Todos os direitos reservados</p>
        </div>
    `;
    // Envio do e-mail de forma assíncrona
    await Email.sendEmail(usuario.email, "Recuperação de senha", mensagem);
    
}