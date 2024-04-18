# Step 1: Use an official Node.js image as the base
FROM node:16-alpine as build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of your frontend application source code
COPY . .

COPY .env.production .env

# Step 6: Build your application for production
RUN npm run build

# # Step 9: Copy Nginx configuration file (if you have a custom one)
# COPY nginx.conf /etc/nginx/nginx.conf

# # Step 10: Expose port 80
# EXPOSE 80

# # Step 11: Start nginx
# CMD ["nginx", "-g", "daemon off;"]

FROM node:16-alpine

COPY --from=build /app/build /var/lib/frontend
