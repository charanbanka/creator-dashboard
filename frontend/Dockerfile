# ---- Build Stage ----
    FROM node:18-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy dependencies
    COPY package*.json ./
    
    # Install dependencies
    RUN npm install
    
    # Copy the rest of the code
    COPY . .
    
    # Build the React app
    RUN npm run build
    
    # ---- Serve Stage (Production) ----
    FROM nginx:alpine
    
    # Copy built files to Nginx html folder
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    # Optional: Replace default nginx config (uncomment if you have one)
    # COPY nginx.conf /etc/nginx/nginx.conf
    
    # Expose port 80
    EXPOSE 80
    
    # Start Nginx
    CMD ["nginx", "-g", "daemon off;"]
    