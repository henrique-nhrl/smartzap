# Script PowerShell para gerar certificados SSL para app-dev.smartzap.net
# Este script deve ser executado no servidor onde o domínio está configurado

Write-Host "=== Gerando certificados SSL para app-dev.smartzap.net ===" -ForegroundColor Green

# Verifica se o certbot está instalado
try {
    $null = Get-Command certbot -ErrorAction Stop
    Write-Host "Certbot encontrado!" -ForegroundColor Green
} catch {
    Write-Host "Certbot não encontrado. Instalando..." -ForegroundColor Yellow
    
    # Tenta instalar via chocolatey se disponível
    if (Get-Command choco -ErrorAction SilentlyContinue) {
        choco install certbot -y
    } else {
        Write-Host "Chocolatey não encontrado. Instale o certbot manualmente:" -ForegroundColor Red
        Write-Host "https://certbot.eff.org/instructions" -ForegroundColor Red
        exit 1
    }
}

# Cria diretório para certificados se não existir
if (!(Test-Path "./certs")) {
    New-Item -ItemType Directory -Path "./certs" -Force
    Write-Host "Diretório ./certs criado" -ForegroundColor Green
}

# Para o nginx temporariamente se estiver rodando
$nginxProcess = Get-Process nginx -ErrorAction SilentlyContinue
if ($nginxProcess) {
    Write-Host "Parando nginx temporariamente..." -ForegroundColor Yellow
    Stop-Service nginx -Force -ErrorAction SilentlyContinue
}

# Gera certificado usando certbot standalone
Write-Host "Gerando certificado SSL..." -ForegroundColor Yellow
certbot certonly --standalone --email admin@smartzap.net --agree-tos --no-eff-email -d app-dev.smartzap.net

# Verifica se o certificado foi gerado com sucesso
$certPath = "/etc/letsencrypt/live/app-dev.smartzap.net/fullchain.pem"
if (Test-Path $certPath) {
    Write-Host "Certificado gerado com sucesso!" -ForegroundColor Green
    
    # Copia os certificados para o diretório local
    Write-Host "Copiando certificados para ./certs..." -ForegroundColor Yellow
    Copy-Item "/etc/letsencrypt/live/app-dev.smartzap.net/fullchain.pem" "./certs/" -Force
    Copy-Item "/etc/letsencrypt/live/app-dev.smartzap.net/privkey.pem" "./certs/" -Force
    Copy-Item "/etc/letsencrypt/options-ssl-nginx.conf" "./certs/" -Force
    Copy-Item "/etc/letsencrypt/ssl-dhparams.pem" "./certs/" -Force
    
    Write-Host "Certificados copiados para ./certs/" -ForegroundColor Green
    Write-Host "Agora você pode fazer deploy do Docker Swarm!" -ForegroundColor Green
} else {
    Write-Host "Erro: Certificado não foi gerado. Verifique se o domínio app-dev.smartzap.net está apontando para este servidor." -ForegroundColor Red
    exit 1
}

# Reinicia nginx se estava rodando
if ($nginxProcess) {
    Write-Host "Reiniciando nginx..." -ForegroundColor Yellow
    Start-Service nginx -ErrorAction SilentlyContinue
}

Write-Host "=== Processo concluído! ===" -ForegroundColor Green
Write-Host "Certificados disponíveis em: ./certs/" -ForegroundColor Cyan
Write-Host "Para renovar automaticamente, configure uma tarefa agendada no Windows" -ForegroundColor Cyan
