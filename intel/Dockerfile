FROM node:24-alpine
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY intel/package.json ./intel/package.json
RUN pnpm install --filter osiris-intel --prod --frozen-lockfile
WORKDIR /workspace/intel
COPY intel/server.js ./
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:4000/health || exit 1
CMD ["node", "server.js"]
