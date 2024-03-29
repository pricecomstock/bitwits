FROM node:12-alpine

# Create app directory
WORKDIR /app

# Copy current directory in
COPY package*.json ./

# install everything
RUN npm install

COPY . .

ENV PORT 80
ENV NODE_ENV production

RUN npm run build
RUN ["node", "./server/game/prompts/syncFromSheety.js"]

EXPOSE 80

CMD ["node", "./server/server.js"]



# production stage
# FROM nginx:1.13.12-alpine as production-stage
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]