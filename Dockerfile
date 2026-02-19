FROM node:20-slim

RUN apt-get update -y \
 && apt-get install -y openssl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
