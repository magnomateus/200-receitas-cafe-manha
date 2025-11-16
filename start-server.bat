@echo off
echo ========================================
echo  SERVIDOR LOCAL - LANDING PAGE
echo  200 Receitas de Cafe da Manha
echo ========================================
echo.
echo Iniciando servidor HTTP na porta 8000...
echo.
echo Acesse no navegador:
echo http://localhost:8000
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

cd /d D:\projetos\200-receitas-cafe-manha
python -m http.server 8000
