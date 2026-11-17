# Multi-stage Dockerfile for TerraVision / CropAI Full-Stack App
# Compatible with Hugging Face Spaces, Render, Koyeb, Railway, and Fly.io

# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend with ML Models and Static Assets
FROM python:3.11-slim
WORKDIR /app

# Install system utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements & install Python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend application
COPY backend/ ./backend/

# Copy model artifacts
COPY "Model Zip" "./Model Zip"

# Copy built frontend assets from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose port (default 8000, dynamically overridden by $PORT on Render/HuggingFace)
ENV PORT=8000
EXPOSE 8000

# Start Uvicorn
CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT}"]
