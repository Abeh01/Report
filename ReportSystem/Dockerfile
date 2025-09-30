# Use an LTS Node image
FROM node:20-alpine
# App directory
WORKDIR /usr/src/app
# Install deps first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev
# Copy app source
COPY . .
# Ensure uploads folder exists inside container (will be bind-mounted)
RUN mkdir -p /usr/src/app/uploads
# Expose port
EXPOSE 3000
# Run
CMD ["node", "main.jsx"]
