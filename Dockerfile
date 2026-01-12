FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /app

# Installer hele Playwright-projektet (din eksisterende package.json)
COPY package*.json ./
COPY packages ./packages
COPY utils ./utils
COPY tests ./tests
# Hvis der er andre mapper, du bruger, kopier dem også

RUN npm install

# Kopiér server.mjs (og evt. ekstra filer til API’et)
COPY server.mjs ./server.mjs

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.mjs"]
