const ClienteService = require('../services/ClienteService');
const UsuarioService = require('../services/UsuarioService');
const TerminalService = require('../services/TerminalService');
const ClienteAreaService = require('../services/ClienteAreaService');
const MensagemService = require('../services/MensagemService');
const Utils = require('../utils/utils');
const db = require('../db');
const logger = require('../logger');
const Email = require('../utils/emailSender')

module.exports = {
    // buscarTodas: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     let idCli = req.params.idcli;
        
    //     let contatos = await ContatoService.buscarTodas(idCli);
    //     return res.status(200).json(contatos);
    // },
    // buscarPorNumero: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     const newContato = {
    //         idcli: req.params.idcli,
    //         num: req.params.numero
    //     }
        
    //     let contatos = await ContatoService.buscarPorNumero(newContato);
    //     return res.status(200).json(contatos);
    // },
    // consultarPorNumero: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     const newContato = {
    //         idcli: req.params.idcli,
    //         numero: req.params.numero
    //     }
        
    //     let contatos = await ContatoService.consultarPorNumero(newContato);
    //     return res.status(200).json(contatos);
    // },
    // consultarPorNome: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     const newContato = {
    //         idcli: req.params.idcli,
    //         nome: req.params.nome
    //     }
        
    //     let contatos = await ContatoService.consultarPorNome(newContato);
    //     return res.status(200).json(contatos);
    // },

    // consultarPorNomeOuNumero: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     const newContato = {
    //         idcli: req.params.idcli,
    //         texto: req.params.texto
    //     }
        
    //     let contatos = await ContatoService.consultarPorNomeOuNumero(newContato);
    //     return res.status(200).json(contatos);
    // },

    // excluir: async(req, res)=> {
    //     let json = {error:'', result:[]};
    //     let codigo = req.params.codigo;
        
    //     ContatoService.excluir(codigo);
    //     return res.status(200).json('excluido com sucesso');
    // },

    inserir: async(req, res) => {
        let json = {error: '', result: {}};
        const newCliente = {
            nome: req.body.nome,
            responsavel: req.body.responsavel,
            telefone: req.body.telefone,
            email: req.body.email,
            senha: req.body.senha,
            idarea: req.body.idarea,
            idcupom: req.body.idcupom,
        };
        
        try {
            // Iniciar a transação
            await db.beginTransaction();
            // verifica usuario já cadastrado
            const usuario = await  UsuarioService.buscarPorEmail(newCliente.email);
            if (usuario.length !== 0) {
                return res.status(422).json({ mensagem: 'E-mail já cadastrado'});
            }
            //Cadastra o cliente
            const clienteId = await ClienteService.inserir(newCliente);
            
            // Cadastra o clienteArea
            const newClienteArea = {
                idcli: clienteId,
                idarea: newCliente.idarea
            }
            await ClienteAreaService.inserir(newClienteArea);

            // cadastrar terminal
            const apiInstaceId = clienteId + 'C' + newCliente.telefone;
            const apiKey = await Utils.generateRandomString();
            
            const newTerminal = {
              idcli: clienteId,
              numtel: newCliente.telefone,
              apiinstanceid: apiInstaceId,
              apikey: apiKey,
              inativo: 'N'
            }
            const terminalId = await TerminalService.inserir(newTerminal);

            //Cadastrar usuário
            const pwd = await Utils.hashValue(newCliente.senha); 

            const newUsuario = {
              idcli: clienteId,
              idtrm: terminalId,
              nome: newCliente.responsavel,
              email: newCliente.email,
              pwd: pwd,
              admin: 'S',
              inativo: 'N'
            }

            const usuId = await UsuarioService.inserir(newUsuario);
            const usu = await  UsuarioService.buscarUm(usuId);

            // Commit da transação
            await db.commit();
            await sendWelcomeMessage(usu[0]).catch(err => {
                logger.error('Erro ao enviar mensagem de boas-vindas:', err);
            });

            await sendWelcomeEmail(usu[0]).catch(err => {
                logger.error('Erro ao enviar e-mail de boas-vindas:', err);
            });

            return res.status(200).json({ mensagem: 'Usuário cadastrado com suscesso', usuario: usu[0]});
        } catch (error) {
            // Rollback em caso de erro
            await db.rollback();
            logger.error(error);
            return res.status(422).json({ mensagem: 'Erro no servidor tente mais tarde'});
        }
    },
    teste: async(req, res) => {
      const user = await UsuarioService.buscarUm(247); 
      sendWelcomeEmail(user[0]).catch(err => {
        logger.error('Erro ao enviar mensagem de boas-vindas:', err);
      });
      sendWelcomeMessage(user[0]).catch(err => {
        logger.error('Erro ao enviar e-mail de boas-vindas:', err);
    });

      return res.status(200).json({ mensagem: 'teste com suscesso'});
    }
}

async function sendWelcomeMessage(usuario) {
    try {
        const texto = 
        `*Olá, ${usuario.nome}!* \n\n` +
        'Queremos começar agradecendo por usar o *SmartZap! 🙌💙 '+
        'Nosso objetivo é te ajudar a *aumentar o faturamento* 💰, *otimizar seu tempo* ⏳ e *melhorar a experiência* dos seus clientes, '+
        'lembrando-os dos momentos importantes para a *compra de um produto ou serviço recorrente* 🛒🔄. '+
        'Vamos juntos aumentar seu faturamento 💰 e fidelizar seus clientes 🤝, enquanto você os ajuda com este lembrete super importante! ⏰📦 \n\n'+
        
        'Este número de WhatsApp é o nosso canal de *suporte* 📲, e estamos à disposição para esclarecer qualquer dúvida e garantir que você tenha a '+
        '*melhor experiência* possível com o nosso robô 🤖. \n\n'+
        
        'Conte com a gente sempre que precisar! 🚀✨ \n\n'+
        
        'Abraços,  \n\n'+
        'Equipe SmartZap'
        ;
        const hrlimite = new Date(Date.now() + 2 * 60 * 1000);
        const mensagem = {
            dtcriacao: await Utils.formatLocalDate(Date.now()), 
            hrcriacao: await Utils.formatLocalTime(Date.now()), 
            idcli: process.env.ADMIN_CLIENT_ID, 
            idusuario: process.env.ADMIN_USER_ID, 
            idnumorigem: process.env.ADMIN_TERMINAL_ID,
            numdestino: await Utils.removeCodigoPais(usuario.numtel), 
            contato: usuario.nome, 
            dtagend: await Utils.formatLocalDate(Date.now()), 
            hragend: await Utils.formatLocalTime(Date.now()), 
            dtlimite: await Utils.formatLocalDate(Date.now()), 
            hrlimite: await Utils.formatLocalTime(hrlimite), 
            idanexo: 0, 
            idtipo: 1, 
            idstatus: 1, 
            mensagem: texto, 
            lista: 'N', 
            prioridade: 0, 
            vroportunidade: 0
        };
        return await MensagemService.inserir(mensagem);
   } catch(erro){
        console.error('Erro ao enviar a mensagem de redefinição:', erro);
        throw erro; // Rethrow the error to ensure it is caught in the forgotPassword function
   }
}

async function sendWelcomeEmail(usuario) {
    const mensagem = `
        <h1>Olá, ${usuario.nome}! </h1> 
        <br>
        <p>Muito obrigado por se registrar no <a href='${process.env.URL}'><strong>SmartZap.</strong></a>! É um prazer tê-lo(a) conosco.</p>
        <p>Estamos confiantes de que nossa parceria será duradoura e trará ótimos resultados.</p> 
        <p>Se precisar de qualquer suporte ou tiver dúvidas, nossa equipe está sempre à disposição para ajudá-lo(a).</p>
        <br>
        <p>Desejamos sucesso e que você aproveite ao máximo todos os benefícios que o <strong>SmartZap</strong> tem a oferecer.</p>
        <br>
        <p><strong>Atenciosamente,</strong></p>
        <p>Equipe <strong>SmartZap</strong></p>
    `;

    await Email.sendEmail(usuario.email, "Bem-vindo(a) ao SmartZap!", mensagem);
}