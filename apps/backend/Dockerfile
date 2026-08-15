FROM node:20-alpine AS builder 
#Start with Node.js 20 running on Alpine Linux.
WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
# --from=builder Copy from the earlier stage.
# --chown: Change ownership to:
# appuser:appgroup
# instead of leaving files owned by root.
COPY --chown=appuser:appgroup ./src ./src
COPY --chown=appuser:appgroup package.json ./

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health \
  || exit 1

CMD ["node", "src/index.js"]