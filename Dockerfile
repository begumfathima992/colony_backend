<<<<<<< HEAD
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
=======
# 1. Use the official Node.js image as the base
FROM node:20-slim

# 2. Create a directory inside the container
WORKDIR /usr/src/app

# 3. Copy package files first to leverage Docker cache
COPY package*.json ./

# 4. Install dependencies 
# (Using 'npm install' is fine, but 'npm ci' is better for consistent builds)
RUN npm install

# 5. Copy the rest of your application code
COPY . .

# 6. Expose the port from your .env (Port 2000)
EXPOSE 2000

# 7. Start the application
# We use "npm start" which runs "node index.js" per your package.json
CMD [ "npm", "start" ]
>>>>>>> d9029b519d8564e60af0044a72be968e12b47a7a
