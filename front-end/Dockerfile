# ---- Build stage (includes devDeps) ----
    FROM node:20-alpine AS builder
    WORKDIR /app
    
    # Use local CLI from node_modules (best), no global needed
    COPY package*.json ./
    # install ALL deps so the Angular builder is available
    RUN npm ci --legacy-peer-deps
    
    # build
    COPY . .
    # use npx to ensure the local CLI is used
    RUN npx ng build --configuration production
    
    # ---- Runtime stage (static files only) ----
    FROM nginx:1.27-alpine
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    # Angular 17/18 output path
    COPY --from=builder /app/dist/*/browser/ /usr/share/nginx/html/
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    
    