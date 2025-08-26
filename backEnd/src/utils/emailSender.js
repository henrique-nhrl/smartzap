const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const logger = require('../logger');


class sendEmail {
    // Função principal para enviar e-mail
    static async sendEmail(email, subject, message, attachments = []) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_DOMINIO,
          secure: false,
          auth: {
            user: process.env.EMAIL_LOGIN,
            pass: process.env.EMAIL_SENHA,
          },
          tls: {
            ciphers: 'SSLv3'
          }
        });
  
        // Configurações do e-mail
        const mailOptions = {
          from: `"${process.env.EMAIL_NOME}" <${process.env.EMAIL_LOGIN}>`,
          to: email,
          subject: subject,
          html: message,
          priority: 'high',
        };
  
        // Se houver anexos, adiciona
        if (attachments.length > 0) {
          mailOptions.attachments = attachments.map(filePath => ({
            filename: path.basename(filePath),
            path: filePath,
          }));
        }
  
        // Enviar o e-mail
        await transporter.sendMail(mailOptions);
        logger.info('Email enviado com sucesso.');
      } catch (error) {
        logger.error(`Erro ao enviar o e-mail: ${error}`);
      }
    }
  
    // Função auxiliar para anexar arquivos
    static attachFiles(filePaths = []) {
      return filePaths.filter(filePath => fs.existsSync(filePath)); // Filtra arquivos existentes
    }
  }
  
  module.exports = sendEmail;