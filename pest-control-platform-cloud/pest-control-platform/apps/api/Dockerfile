FROM node:22-alpine
WORKDIR /app
COPY package.json ./package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
RUN npm install
COPY . .
RUN npm run prisma:generate -w apps/api && npm run build -w apps/api
EXPOSE 4000
CMD ["sh","-c","npm run prisma:migrate -w apps/api && npm run prisma:seed -w apps/api && npm run start -w apps/api"]
