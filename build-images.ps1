# Script PowerShell para build das imagens Docker
Write-Host "=== Build das imagens Docker ===" -ForegroundColor Green

# Build da imagem do backend
Write-Host "Build da imagem do backend..." -ForegroundColor Yellow
docker build -t smartzap-backend:latest ./backEnd

# Build da imagem do frontend
Write-Host "Build da imagem do frontend..." -ForegroundColor Yellow
docker build -t smartzap-frontend:latest ./frontEnd

Write-Host "=== Build concluído! ===" -ForegroundColor Green
Write-Host "Imagens criadas:" -ForegroundColor Cyan
Write-Host "  - smartzap-backend:latest" -ForegroundColor White
Write-Host "  - smartzap-frontend:latest" -ForegroundColor White
Write-Host ""
Write-Host "Para fazer deploy:" -ForegroundColor Yellow
Write-Host "  .\deploy.ps1" -ForegroundColor White
