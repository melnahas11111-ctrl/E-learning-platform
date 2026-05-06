# E-LEARNING PLATFORM DEPLOYMENT & IMPLEMENTATION GUIDE
## Food Sample Collection Training - Qatar MoPH

---

## TABLE OF CONTENTS
1. System Requirements
2. Database Setup
3. Backend Deployment
4. Frontend Deployment
5. Firebase Configuration
6. Security Implementation
7. Backup & Recovery
8. Monitoring & Maintenance
9. Troubleshooting Guide

---

## 1. SYSTEM REQUIREMENTS

### Server Requirements
- **OS**: Linux (Ubuntu 20.04 LTS or later)
- **CPU**: 4+ cores
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 100GB+ (SSD recommended)
- **Network**: 100 Mbps+ connectivity

### Software Dependencies
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y \
  curl \
  wget \
  git \
  build-essential \
  python3 \
  openssl \
  ca-certificates

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL 14
sudo apt-get install -y postgresql postgresql-contrib

# Install Nginx (reverse proxy)
sudo apt-get install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Docker (optional, for containerization)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

---

## 2. DATABASE SETUP

### PostgreSQL Installation & Configuration

```bash
# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE elearning_platform OWNER postgres;
CREATE USER elearning_user WITH PASSWORD 'secure_password_here';
ALTER ROLE elearning_user SET client_encoding TO 'utf8';
ALTER ROLE elearning_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE elearning_user SET default_transaction_deferrable TO on;
ALTER ROLE elearning_user SET default_transaction_read_committed TO on;
GRANT ALL PRIVILEGES ON DATABASE elearning_platform TO elearning_user;

# Exit psql
\q

# Update PostgreSQL configuration for security
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and modify these settings:
# listen_addresses = 'localhost'  # Change to specific IP if remote access needed
# shared_buffers = 256MB          # Increase to ~25% of system RAM
# effective_cache_size = 1GB      # Increase to ~50% of system RAM
# work_mem = 4MB                  # Increase to (RAM * 1000 / max_connections) / 2

# Restart PostgreSQL
sudo systemctl restart postgresql

# Test connection
psql -U elearning_user -d elearning_platform -h localhost

# Run SQL schema from schema.sql file (from earlier in conversation)
psql -U elearning_user -d elearning_platform -h localhost -f schema.sql
```

### Backup Configuration

```bash
# Create backup directory
sudo mkdir -p /var/backups/elearning
sudo chown -R postgres:postgres /var/backups/elearning
sudo chmod 700 /var/backups/elearning

# Create backup script
sudo tee /usr/local/bin/backup_elearning.sh > /dev/null <<EOF
#!/bin/bash
BACKUP_DIR="/var/backups/elearning"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

pg_dump -U elearning_user -h localhost elearning_platform | gzip > "$BACKUP_FILE"

# Keep only last 30 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
EOF

# Make executable
sudo chmod +x /usr/local/bin/backup_elearning.sh

# Add cron job for automatic backups (every 6 hours)
sudo crontab -e

# Add this line:
0 */6 * * * /usr/local/bin/backup_elearning.sh >> /var/log/elearning-backup.log 2>&1
```

---

## 3. BACKEND DEPLOYMENT

### Project Setup

```bash
# Create application directory
sudo mkdir -p /opt/elearning-platform
sudo chown -R $USER:$USER /opt/elearning-platform
cd /opt/elearning-platform

# Clone or initialize Git repo
git init

# Copy project files
# (Copy all files from provided code)

# Install dependencies
npm install

# Create .env file (with secure values)
cat > .env <<EOF
# Server Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elearning_platform
DB_USER=elearning_user
DB_PASSWORD=$(openssl rand -base64 32)
DB_SSL=true

# JWT
JWT_SECRET=$(openssl rand -base64 64)
REFRESH_TOKEN_SECRET=$(openssl rand -base64 64)
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=noreply@elearning-platform.qa

# Backup
BACKUP_INTERVAL_HOURS=6
BACKUP_RETENTION_DAYS=90
BACKUP_STORAGE_PATH=/var/backups/elearning

# Firebase Backup
FIREBASE_BACKUP_ENABLED=true
FIREBASE_BACKUP_INTERVAL_HOURS=4

# App URL
APP_URL=https://elearning-platform.qa

# Timezone
DEFAULT_TIMEZONE=Asia/Qatar

# CORS
ALLOWED_ORIGINS=https://elearning-platform.qa,https://admin.elearning-platform.qa

# Encryption
ENCRYPTION_KEY=$(openssl rand -base64 32)
EOF

# Set proper permissions
chmod 600 .env
```

### Systemd Service Setup

```bash
# Create systemd service file
sudo tee /etc/systemd/system/elearning-platform.service > /dev/null <<EOF
[Unit]
Description=E-Learning Platform API Server
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/elearning-platform
Environment="PATH=/usr/local/bin:/usr/bin"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/elearning-platform/server.log
StandardError=append:/var/log/elearning-platform/error.log

[Install]
WantedBy=multi-user.target
EOF

# Create log directory
sudo mkdir -p /var/log/elearning-platform
sudo chown -R www-data:www-data /var/log/elearning-platform

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable elearning-platform
sudo systemctl start elearning-platform

# Check status
sudo systemctl status elearning-platform
```

### Nginx Reverse Proxy Configuration

```bash
# Create Nginx config
sudo tee /etc/nginx/sites-available/elearning-platform > /dev/null <<EOF
upstream elearning_backend {
    server localhost:3000;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name elearning-platform.qa *.elearning-platform.qa;
    return 301 https://\$server_name\$request_uri;
}

# HTTPS Server Block
server {
    listen 443 ssl http2;
    server_name elearning-platform.qa;

    # SSL Certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/elearning-platform.qa/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elearning-platform.qa/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https:" always;

    # Logging
    access_log /var/log/nginx/elearning-access.log;
    error_log /var/log/nginx/elearning-error.log;

    # Client body size limit
    client_max_body_size 50M;

    # Proxy settings
    location /api {
        proxy_pass http://elearning_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Frontend serving
    location / {
        root /var/www/elearning-frontend/build;
        try_files \$uri \$uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://elearning_backend;
        access_log off;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/elearning-platform /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Setup (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d elearning-platform.qa

# Set up auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

---

## 4. FRONTEND DEPLOYMENT

### React Build & Deployment

```bash
# Navigate to frontend directory
cd /opt/elearning-platform/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Copy build to web root
sudo mkdir -p /var/www/elearning-frontend
sudo cp -r build/* /var/www/elearning-frontend/
sudo chown -R www-data:www-data /var/www/elearning-frontend
```

### Environment Configuration

```bash
# Create .env.production
cat > .env.production <<EOF
REACT_APP_API_URL=https://elearning-platform.qa/api
REACT_APP_FIREBASE_CONFIG={
  "apiKey": "YOUR_FIREBASE_API_KEY",
  "authDomain": "YOUR_FIREBASE_AUTH_DOMAIN",
  "projectId": "YOUR_FIREBASE_PROJECT_ID",
  "storageBucket": "YOUR_FIREBASE_STORAGE_BUCKET",
  "messagingSenderId": "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  "appId": "YOUR_FIREBASE_APP_ID"
}
REACT_APP_FIREBASE_SYNC_INTERVAL=4
EOF
```

---

## 5. FIREBASE CONFIGURATION

### Firebase Project Setup

```bash
# Initialize Firebase in your project
firebase login
firebase init

# Upload Firestore security rules
firebase deploy --only firestore:rules

# Configure Firebase backup
firebase firestore:backups:scheduled:create \
  --display-name="Daily Backup" \
  --recurrence="R/2024-01-01T00:00:00Z/P1D" \
  --retention-days=30 \
  --location="us-central1"
```

---

## 6. SECURITY IMPLEMENTATION

### SSL/TLS Configuration (Already in Nginx setup)

### Firewall Setup

```bash
# Enable UFW (Uncomplicated Firewall)
sudo apt-get install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Database Security

```bash
# Restrict PostgreSQL access to localhost
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Ensure it contains:
# local   all             postgres                                peer
# local   all             all                                     peer
# host    all             all             127.0.0.1/32            md5
# host    all             all             ::1/128                 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Application Security Headers (Already in Nginx)

---

## 7. BACKUP & RECOVERY

### Automated Backup Schedule

```bash
# Backups run every 6 hours via the application
# Manual full backup:
curl -X POST https://elearning-platform.qa/api/admin/backups/full \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json"

# Check backup logs
curl https://elearning-platform.qa/api/admin/backups/logs \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Database Restore Procedure

```bash
# List available backups
ls -lh /var/backups/elearning/

# Restore from backup
gunzip < /var/backups/elearning/backup_20240101_120000.sql.gz | \
  psql -U elearning_user -h localhost elearning_platform

# Verify restoration
psql -U elearning_user -d elearning_platform -c "SELECT COUNT(*) FROM users;"
```

---

## 8. MONITORING & MAINTENANCE

### Application Logging

```bash
# View application logs
sudo tail -f /var/log/elearning-platform/server.log

# View error logs
sudo tail -f /var/log/elearning-platform/error.log

# View Nginx logs
sudo tail -f /var/log/nginx/elearning-access.log
```

### Health Monitoring

```bash
# Check service status
sudo systemctl status elearning-platform

# Monitor resource usage
top
free -h
df -h

# Monitor database connections
psql -U elearning_user -d elearning_platform -c \
  "SELECT datname, usename, count(*) FROM pg_stat_activity GROUP BY datname, usename;"
```

### Performance Optimization

```bash
# Enable query logging for slow queries
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add/modify:
log_min_duration_statement = 1000  # Log queries taking > 1 second
shared_preload_libraries = 'pg_stat_statements'

# Restart PostgreSQL
sudo systemctl restart postgresql

# Analyze performance
psql -U elearning_user -d elearning_platform -c \
  "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

---

## 9. TROUBLESHOOTING GUIDE

### Common Issues & Solutions

#### 1. Database Connection Error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string in .env
psql -U elearning_user -h localhost -d elearning_platform -c "SELECT 1;"

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 2. Service Not Starting
```bash
# Check service logs
sudo journalctl -u elearning-platform -n 50

# Check Node.js version
node --version  # Should be v18+

# Manually test server
cd /opt/elearning-platform && npm start
```

#### 3. Firebase Sync Issues
```bash
# Check Firebase connectivity
curl -X GET "https://YOUR_FIREBASE_DATABASE_URL/.json"

# Verify credentials in .env
grep FIREBASE .env

# Check Firebase sync logs in application
curl https://elearning-platform.qa/api/admin/firebase/sync-logs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 4. SSL Certificate Issues
```bash
# Check certificate validity
sudo certbot certificates

# Verify certificate dates
openssl x509 -in /etc/letsencrypt/live/elearning-platform.qa/fullchain.pem -noout -dates

# Renew if needed
sudo certbot renew --force-renewal
```

#### 5. High Disk Usage
```bash
# Check disk space
df -h

# Find large files
du -sh /*

# Clean old backups
find /var/backups/elearning -name "backup_*.sql.gz" -mtime +30 -delete

# Clean logs
sudo truncate -s 0 /var/log/elearning-platform/*.log
```

---

## IMPLEMENTATION CHECKLIST

### Pre-Deployment
- [ ] System meets minimum requirements
- [ ] PostgreSQL installed and configured
- [ ] Node.js v18+ installed
- [ ] Nginx installed
- [ ] SSL certificate obtained
- [ ] Firebase project created and configured
- [ ] Firewall rules configured
- [ ] Backup strategy planned

### Database Setup
- [ ] PostgreSQL user created with secure password
- [ ] Database initialized with schema
- [ ] Indexes created for performance
- [ ] Backup script tested
- [ ] Automated backup schedule configured

### Backend Deployment
- [ ] Code cloned/copied to /opt/elearning-platform
- [ ] Dependencies installed (npm install)
- [ ] .env file configured with all required values
- [ ] Systemd service file created and enabled
- [ ] Service started and verified running
- [ ] Application logging configured

### Frontend Deployment
- [ ] React build created
- [ ] Build files copied to web root
- [ ] Environment variables configured
- [ ] Nginx serving frontend correctly

### Security
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules active
- [ ] Security headers configured
- [ ] Database access restricted
- [ ] API authentication tested

### Testing
- [ ] Health endpoint responding
- [ ] User login functionality tested
- [ ] Content access verified
- [ ] Assessment submission working
- [ ] Firebase sync verified
- [ ] Backups completing successfully

### Post-Deployment
- [ ] Monitoring alerts configured
- [ ] Log rotation set up
- [ ] Backup restoration tested
- [ ] Documentation updated
- [ ] Team training completed
- [ ] Go-live date confirmed

---

## SUPPORT CONTACTS

**Technical Support**: support@elearning-platform.qa
**System Administrator**: admin@elearning-platform.qa
**Database Administrator**: dba@elearning-platform.qa
**Security Team**: security@elearning-platform.qa

---

**Document Version**: 1.0
**Last Updated**: May 2026
**Status**: Production Ready
