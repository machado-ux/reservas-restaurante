#!/bin/bash
# Crea el repo en GitHub y sube el código usando un token.
# Uso: pega tu token en .github-token y ejecuta ./setup-github.sh

set -e
cd "$(dirname "$0")"
REPO_NAME="reservas-restaurante"

if [ -f .github-token ]; then
  TOKEN=$(grep -v "PEGA_TU_TOKEN_AQUI" .github-token | tr -d ' \n\r' | head -1)
fi
[ -z "$TOKEN" ] && TOKEN="$GITHUB_TOKEN"

if [ -z "$TOKEN" ] || [ "$TOKEN" = "PEGA_TU_TOKEN_AQUI" ]; then
  echo ""
  echo "❌ Necesito tu token de GitHub para crear el repo y subir el código."
  echo ""
  echo "1. Abre este link (copia y pega en el navegador):"
  echo "   https://github.com/settings/tokens/new?description=reservas&scopes=repo"
  echo ""
  echo "2. Pulsa 'Generate token' y COPIA el token (solo se muestra una vez)."
  echo "3. Abre el archivo .github-token en esta carpeta y PEGA el token"
  echo "   (reemplaza donde dice PEGA_TU_TOKEN_AQUI). Guarda el archivo."
  echo "4. Vuelve a ejecutar: ./setup-github.sh"
  echo ""
  exit 1
fi

echo "→ Obteniendo tu usuario de GitHub..."
USER=$(curl -s -H "Authorization: token $TOKEN" https://api.github.com/user | grep '"login"' | head -1 | sed 's/.*"login": *"\([^"]*\)".*/\1/')
if [ -z "$USER" ]; then
  echo "❌ Token inválido o sin permisos. Crea uno nuevo con permiso 'repo'."
  exit 1
fi
echo "   Usuario: $USER"

echo "→ Creando el repositorio $REPO_NAME en GitHub..."
curl -s -X POST -H "Authorization: token $TOKEN" -H "Content-Type: application/json" \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"Sistema de reservas bar/restaurante\",\"private\":false}" \
  https://api.github.com/user/repos > /dev/null

echo "→ Conectando este proyecto al repo y subiendo código..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${TOKEN}@github.com/${USER}/${REPO_NAME}.git"
git push -u origin main

echo ""
echo "✅ Listo. Tu repo está en: https://github.com/${USER}/${REPO_NAME}"
echo "   Puedes borrar el archivo .github-token si quieres (ya no hace falta)."
echo ""
