FROM node:22-alpine

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@10.17.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

# compila typescript a javascript
RUN pnpm run build

EXPOSE 3000

# arranca nest en modo producción
CMD ["pnpm", "run", "start:prod"]