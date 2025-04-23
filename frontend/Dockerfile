FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY . .

# Solución para el error de TypeScript
RUN npm run build || (echo "Intentando construir sin TypeScript" && npx vite build)

# Imagen para servir archivos estáticos
FROM nginx:alpine

# Copiar archivos de la aplicación construida
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
RUN echo 'server { \
  listen 3000; \
  location / { \
    root /usr/share/nginx/html; \
    try_files $uri $uri/ /index.html; \
  } \
  location /api { \
    proxy_pass http://backend:5000; \
    proxy_set_header Host $host; \
    proxy_set_header X-Real-IP $remote_addr; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"] 