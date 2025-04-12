FROM node:18-alpine AS development

# Criar diretório da aplicação
WORKDIR /usr/src/app

# Instalar dependências globais
RUN npm i -g @nestjs/cli

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar em modo de desenvolvimento
CMD ["npm", "run", "start:dev"] 