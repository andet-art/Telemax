#!/bin/bash

# Telemax API Production Start Script for DigitalOcean

echo "🚀 Starting Telemax API in Production Mode"
echo "🌐 Server IP: 209.38.231.125"
echo "🔌 Port: 4000"

# Create logs directory if it doesn't exist
mkdir -p logs

# Set environment variables
export NODE_ENV=production
export PORT=4000

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 not found. Installing PM2..."
    npm install -g pm2
fi

# Stop any existing processes
echo "🛑 Stopping existing processes..."
pm2 stop telemax-api 2>/dev/null || echo "No existing process to stop"

# Start the application
echo "✅ Starting API server..."
pm2 start ecosystem.config.js --env production

# Show status
pm2 status

# Show logs
echo "📋 Recent logs:"
pm2 logs telemax-api --lines 10 --nostream

echo ""
echo "🎉 Telemax API started successfully!"
echo "📍 Access your API at: http://209.38.231.125:4000"
echo "🩺 Health check: http://209.38.231.125:4000/api/health"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check process status"
echo "  pm2 logs telemax-api - View logs"
echo "  pm2 restart telemax-api - Restart process"
echo "  pm2 stop telemax-api - Stop process"