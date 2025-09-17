# ---- Build stage ----
    FROM node:20-alpine AS builder
    RUN npm i -g @angular/cli@18.2.1
    WORKDIR /app
    
    # Install deps
    COPY package*.json ./
    RUN npm ci
    
    # Build
    COPY . .
    RUN ng build --configuration production
    
    # ---- Runtime stage ----
    FROM nginx:1.27-alpine
    # Nginx config with SPA fallback + /api proxy
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Angular 17+ outputs to dist/<app>/browser
    # This wildcard works for both classic and new builder layouts
    COPY --from=builder /app/dist/*/browser /usr/share/nginx/html
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    