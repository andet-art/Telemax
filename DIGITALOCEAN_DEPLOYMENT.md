# DigitalOcean Deployment Guide for Telemax API

## 🌐 Server Information
- **IP Address:** 209.38.231.125
- **Port:** 4000
- **Environment:** Production

## 🚀 Deployment Commands

### 1. Connect to Your Droplet
```bash
ssh root@209.38.231.125
```

### 2. Navigate to Your Project
```bash
cd /var/www/Telemax/api
# or wherever your project is located
```

### 3. Install Dependencies
```bash
npm install --production
```

### 4. Configure Environment
Make sure your `.env` file has:
```bash
NODE_ENV=production
PORT=4000
DB_HOST=209.38.231.125
# ... other environment variables
```

### 5. Start the Server (Choose One Method)

#### Option A: Using PM2 (Recommended)
```bash
# Install PM2 globally if not installed
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

#### Option B: Using npm directly
```bash
npm start
```

#### Option C: Using nodemon for development
```bash
npm run dev
```

### 6. Configure Firewall
```bash
# Allow port 4000
ufw allow 4000

# Check firewall status
ufw status
```

### 7. Test the API
```bash
# From your local machine
curl http://209.38.231.125:4000/api/health

# Should return: {"ok":true}
```

## 🔧 Troubleshooting

### If API is not accessible:

1. **Check if server is running:**
```bash
ps aux | grep node
netstat -tlnp | grep :4000
```

2. **Check firewall:**
```bash
ufw status
# Make sure port 4000 is allowed
```

3. **Check server logs:**
```bash
# If using PM2
pm2 logs telemax-api

# If running directly
journalctl -u your-service-name
```

4. **Test locally on server:**
```bash
# SSH into server and test locally
curl http://localhost:4000/api/health
curl http://127.0.0.1:4000/api/health
```

### Common Issues:

1. **Server binding to localhost only:**
   - Make sure server listens on `0.0.0.0:4000` not `localhost:4000`
   - This is already fixed in the updated server.js

2. **Firewall blocking connections:**
   - Run: `ufw allow 4000`
   - Or for specific IPs: `ufw allow from your.ip.address to any port 4000`

3. **Database connection issues:**
   - Verify database is running and accessible
   - Check DB credentials in .env file

## 🔗 API Endpoints Available

After deployment, these endpoints will be available at `http://209.38.231.125:4000`:

### Core Endpoints:
- `GET /api/health` - Health check
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/products` - Get products
- `POST /api/orders` - Create order

### New Enhanced Endpoints:
- `GET /api/categories` - Product categories
- `GET /api/cart` - Shopping cart
- `GET /api/reviews/product/:id` - Product reviews
- `GET /api/wishlist` - User wishlist

## 🔐 Security Considerations

1. **Environment Variables:**
   - Never commit `.env` file to git
   - Use strong JWT secrets
   - Update database credentials regularly

2. **Firewall:**
   - Only open necessary ports
   - Consider using fail2ban for SSH protection

3. **SSL/HTTPS:**
   - Consider using nginx as reverse proxy
   - Setup SSL certificates with Let's Encrypt

## 📊 Monitoring

### Check Server Status:
```bash
# Using PM2
pm2 status
pm2 monit

# Check system resources
htop
df -h
```

### View Logs:
```bash
# PM2 logs
pm2 logs telemax-api --lines 100

# System logs
tail -f /var/log/syslog
```