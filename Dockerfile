FROM node:18

WORKDIR usr/src/app

COPY package*.json ./

RUN npm install -g pnpm && \
    pnpm install

COPY . .

COPY .env ./

RUN pnpm dlx prisma generate && \
    pnpm build

EXPOSE 4455

CMD ["pnpm", "start"]