# server/Dockerfile

FROM node:18-alpine
WORKDIR /app

# 1) Copy only package files (for Docker cache)
COPY package*.json ./

# 2) Install dependencies
RUN npm ci

# 3) Copy the rest of your backend (including prisma/schema.prisma)
COPY . .

# 4) Generate the Prisma client now that schema is in place
RUN npx prisma generate

# 5) Expose your app port
EXPOSE 5001

# 6) Start the server
CMD ["npm", "start"]
