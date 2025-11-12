# Estágio 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia o package.json e instala as dependências
COPY package.json ./
RUN npm install

# Copia o resto do código
COPY . .

# Estágio 2: Produção (imagem final, menor e mais segura)
FROM node:18-alpine

WORKDIR /app

# Copia as dependências instaladas e o código do estágio anterior
COPY --from=builder /app ./

# Variável de ambiente para o token (defina ao rodar o contêiner)
ENV PORT=3000
ENV API_TOKEN="" 
# Você vai definir o API_TOKEN ao rodar o contêiner

# Expõe a porta
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]