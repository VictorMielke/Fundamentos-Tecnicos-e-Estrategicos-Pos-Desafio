FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml* ./
COPY .yarn ./.yarn
COPY tsconfig.json ./

RUN corepack enable && yarn install --immutable

COPY src ./src
COPY drizzle ./drizzle

RUN yarn build
RUN yarn workspaces focus --all --production || yarn install --production --immutable

FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

USER nodejs

EXPOSE 3333

CMD ["node", "dist/server.js"]
