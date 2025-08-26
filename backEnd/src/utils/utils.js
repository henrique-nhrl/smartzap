const crypto = require('crypto');
const moment = require('moment');
const jwt = require('jsonwebtoken');


class Utils {
    static async compareHash(value, hash) {
    const hashedValue = await this.hashValue(value);
    return hashedValue === hash;
    }

    static async hashValue(value) {
        return await crypto.createHash('md5').update(value).digest('hex');
    }

    static async formatDate(value) {
        return moment(value, moment.ISO_8601).format('YYYY-MM-DD');
    }

    static async formatTime(value) {
        return moment(value, moment.ISO_8601).format('HH:mm:ss'); 
    }

    static async formatLocalDate(value) {
      return moment(new Date(value)).format('YYYY-MM-DD');
  }

  static async formatLocalTime(value) {
      return moment(new Date(value)).format('HH:mm:ss');
  }

    static async formatMoney(value) {
      if (value) {
        return value.replace(/[^0-9]/g, '');
      }
  
      return value;
    }

    static checkToken(req, res, next) {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      
      if (!token) return res.status(401).json({ msg: "Acesso negado!" });
    
      try {
        const secret = process.env.SECRET;
    
        jwt.verify(token, secret);
    
        next();
      } catch (err) {
        res.status(400).json({ msg: "O Token é inválido!" });
      }
    }

    static async removeMascara(valor) {
      if (valor) {
        return valor.replace(/[^0-9]/g, '');
      }
  
      return valor;
    }

    static async generateRandomString() {
      const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
      // Formatar a data atual no formato 'yyyymmddhhnnsszzz'
      const now = new Date();
      const dateTimeStr = now.getFullYear().toString() +
                          ('0' + (now.getMonth() + 1)).slice(-2) +
                          ('0' + now.getDate()).slice(-2) +
                          ('0' + now.getHours()).slice(-2) +
                          ('0' + now.getMinutes()).slice(-2) +
                          ('0' + now.getSeconds()).slice(-2) +
                          ('00' + now.getMilliseconds()).slice(-3);
    
      // Gerar hash SHA-256 da string da data
      const hashStr = crypto.createHash('sha256').update(dateTimeStr).digest('hex');
    
      let randomString = '';
    
      // Gerar uma string aleatória de 20 caracteres
      for (let i = 0; i < 20; i++) {
        const index = parseInt(hashStr[i], 16) % charSet.length;
        randomString += charSet[index];
      }
    
      return randomString;
    } 

    static async removeCodigoPais(numero) {
      // Verificar se o número de telefone é uma string válida
      if (!numero || typeof numero !== 'string') {
        console.error('Número de telefone inválido:', numero);
        return ''; // Ou retorne um valor padrão ou lance um erro
      }

      // Remover todos os espaços, parênteses, traços e caracteres especiais
      let cleanNumber = numero.replace(/[\s()-]/g, '');

      // Remove os primeiros 2 caracteres (55)
      if (cleanNumber.startsWith('55')) {
          cleanNumber = cleanNumber.substring(2); 
      }
  
      return cleanNumber;
    }
}

module.exports = Utils;