FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

# docker build -t frontend-image . (in folder pls!)
# docker run -d -p 3000:3000 --name frontend frontend-image