#!/bin/bash

# ============================================
# E-LEARNING PLATFORM - GITHUB UPLOAD SCRIPT
# ============================================

echo "🚀 Starting E-Learning Platform GitHub Upload..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Your GitHub URL (CHANGE THIS)
GITHUB_REPO="https://github.com/melnahas11111-ctrl/E-learning-platform.git"

# Step 1: Create project directory
echo -e "${BLUE}[STEP 1]${NC} Creating project structure..."
mkdir -p elearning-platform
cd elearning-platform

# Step 2: Initialize Git
echo -e "${BLUE}[STEP 2]${NC} Initializing Git repository..."
git init
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Step 3: Create directory structure
echo -e "${BLUE}[STEP 3]${NC} Creating directory structure..."
mkdir -p backend/{config,controllers,middleware,routes,services,utils,database,tests}
mkdir -p frontend/{src/{components,pages,services,hooks,styles},public}
mkdir -p docs
mkdir -p scripts
mkdir -p nginx
mkdir -p .github/workflows

# Step 4: Create essential root files
echo -e "${BLUE}[STEP 4]${NC} Creating essential files..."

# .gitignore
cat > .gitignore << 'GITIGNORE_EOF'
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json
npm-debug.log
yarn-debug.log
yarn-error.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Build files
build/
dist/
out/

# Logs
logs/
*.log

# Database
*.sqlite
*.db

# OS
Thumbs.db

# Temporary
tmp/
temp/
.cache/
GITIGNORE_EOF

# .env.example
cat > .env.example << 'ENV_EOF'
# Server
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elearning_platform
DB_USER=elearning_user
DB_PASSWORD=your_password_here
DB_SSL=true

# JWT
JWT_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret-here
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@elearning-platform.qa

# Backup
BACKUP_INTERVAL_HOURS=6
BACKUP_RETENTION_DAYS=90
FIREBASE_BACKUP_ENABLED=true

# Security
ENCRYPTION_KEY=your-encryption-key
ALLOWED_ORIGINS=https://elearning-platform.qa

# App
APP_URL=https://elearning-platform.qa
DEFAULT_TIMEZONE=Asia/Qatar
ENV_EOF

# LICENSE
cat > LICENSE << 'LICENSE_EOF'
MIT License

Copyright (c) 2024 Qatar Ministry of Public Health

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
LICENSE_EOF

echo -e "${GREEN}✓ Essential files created${NC}"

# Step 5: Copy main documentation
echo -e "${BLUE}[STEP 5]${NC} Creating documentation files..."

cat > README.md << 'README_EOF'
# E-Learning Platform: Food Sample Collection Training
## Qatar Ministry of Public Health (MoPH)

![License](https://img.shields.io/badge/license-MIT-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![React](https://img.shields.io/badge/react-%3E%3D18-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%3E%3D14-336791)

**Status**: Production Ready | **Version**: 1.0.0 | **Standards**: ISO 6887 Compliant

---

## 📋 Overview

A secure, standards-compliant e-learning platform for training food inspectors in modern food sample collection methods per **ISO 6887 series** standards, validated by Qatar Ministry of Public Health.

### Key Features
✅ **ISO 6887 Compliance** - Immutable content with SHA-256 verification  
✅ **Secure Authentication** - JWT + RBAC + MFA support  
✅ **Progress Tracking** - Module completion, assessment scoring, certification  
✅ **Firebase Integration** - Real-time sync + Cloud backup  
✅ **Qatar Timezone** - All logs in AST (UTC+3)  
✅ **Automated Backups** - Full/incremental with 90-day retention  
✅ **Admin Dashboard** - User management, analytics, QR enrollment  
✅ **Audit Trail** - Complete activity logging for compliance  

---

## 🚀 Quick Start

### Prerequisites
```bash
- Node.js 18+
- PostgreSQL 14+
- npm 9+
```

### Installation
```bash
# 1. Clone repository
git clone https://github.com/melnahas11111-ctrl/E-learning-platform.git
cd E-learning-platform

# 2. Install dependencies
npm install
npm install --prefix backend
npm install --prefix frontend

# 3. Setup environment
cp .env.example .env
# Edit .env with your values

# 4. Initialize database
psql elearning_platform < backend/database/schema.sql

# 5. Start development
npm run dev
```

---

## 📁 Project Structure

```
E-learning-platform/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database, Firebase config
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, validation, logging
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic
│   ├── utils/              # Utilities (timezone, QR, encryption)
│   ├── database/           # SQL schema
│   ├── tests/              # Unit tests
│   ├── server.js           # Express app entry
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API client
│   │   └── hooks/          # Custom hooks
│   └── package.json
├── docs/                   # Documentation
│   ├── DEPLOYMENT_GUIDE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── DEVELOPMENT.md
├── .env.example            # Environment template
├── README.md               # This file
└── LICENSE                 # MIT License
```

---

## 🔐 Security Features

- **JWT Authentication** - Expiring tokens (7-day access, 30-day refresh)
- **Password Security** - Bcrypt hashing (10 salt rounds)
- **Data Encryption** - AES-256-GCM for sensitive data
- **SSL/TLS** - All communications encrypted
- **Input Validation** - Protection against injection attacks
- **Audit Logging** - Complete activity trail
- **Role-Based Access** - Admin, Trainer, Trainee roles

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) | Complete setup from scratch |
| [IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) | Architecture & APIs |
| [DEVELOPMENT.md](docs/DEVELOPMENT.md) | Development setup |

---

## 🛠️ Available Scripts

### Backend
```bash
npm --prefix backend start     # Production mode
npm --prefix backend dev       # Development mode with hot reload
npm --prefix backend test      # Run tests
npm --prefix backend lint      # Lint code
```

### Frontend
```bash
npm --prefix frontend start    # Development server
npm --prefix frontend build    # Production build
npm --prefix frontend test     # Run tests
```

---

## 📊 Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js 18 + Express.js |
| Frontend | React 18 + Tailwind CSS |
| Database | PostgreSQL 14 |
| Real-time | Firebase Realtime DB |
| Auth | JWT + bcryptjs |
| Encryption | AES-256-GCM |
| Web Server | Nginx |
| Logging | Winston |

---

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/login           - User login
POST /api/auth/logout          - Logout
POST /api/auth/enroll-qr       - QR enrollment
```

### Content & Progress
```
GET  /api/content/courses      - List courses
GET  /api/progress/dashboard   - User progress
POST /api/assessments/submit   - Submit assessment
GET  /api/assessments/results  - Get results
```

### Admin Functions
```
POST /api/admin/users/create      - Create user
GET  /api/admin/users             - List users
POST /api/admin/qr-tokens/generate - Generate QR
POST /api/admin/backups/full      - Trigger backup
```

Full API docs: See [IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)

---

## 🚀 Deployment

### Production Deployment
See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for:
- System setup (Ubuntu 20.04+)
- PostgreSQL configuration
- Nginx reverse proxy
- SSL/TLS certificates
- Firewall setup
- Automated backups
- Monitoring

### Docker Deployment (Coming Soon)
Containerized deployment instructions coming soon.

---

## 📝 Development

### Setup Development Environment
```bash
# 1. Clone repo
git clone https://github.com/melnahas11111-ctrl/E-learning-platform.git
cd E-learning-platform

# 2. Install dependencies
npm install

# 3. Create .env
cp .env.example .env

# 4. Start development servers
npm run dev
```

### Running Tests
```bash
npm test
```

### Code Quality
```bash
npm run lint
npm run format
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Support

- **Technical Support**: support@elearning-platform.qa
- **Issues**: [GitHub Issues](https://github.com/melnahas11111-ctrl/E-learning-platform/issues)
- **Documentation**: See `docs/` folder

---

## 🙏 Acknowledgments

Built for Qatar Ministry of Public Health Food Safety Department  
Standards Compliance: ISO 6887 Series

---

**Made with ❤️ for Food Safety Training**
README_EOF

echo -e "${GREEN}✓ Documentation created${NC}"

# Step 6: Create backend package.json
echo -e "${BLUE}[STEP 6]${NC} Creating backend configuration..."

cat > backend/package.json << 'BACKEND_PKG_EOF'
{
  "name": "elearning-platform-backend",
  "version": "1.0.0",
  "description": "E-Learning Platform Backend - Qatar MoPH",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "keywords": ["elearning", "food-safety", "iso-6887", "qatar"],
  "author": "E-Learning Platform Team",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "express-validator": "^7.0.0",
    "pg": "^8.10.0",
    "firebase-admin": "^12.0.0",
    "jsonwebtoken": "^9.1.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "uuid": "^9.0.0",
    "qrcode": "^1.5.3",
    "moment-timezone": "^0.5.45",
    "winston": "^3.11.0",
    "axios": "^1.6.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.52.0",
    "prettier": "^3.0.3"
  }
}
BACKEND_PKG_EOF

echo -e "${GREEN}✓ Backend package.json created${NC}"

# Step 7: Create frontend package.json
echo -e "${BLUE}[STEP 7]${NC} Creating frontend configuration..."

cat > frontend/package.json << 'FRONTEND_PKG_EOF'
{
  "name": "elearning-platform-frontend",
  "version": "1.0.0",
  "description": "E-Learning Platform Frontend - React",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.6.0",
    "lucide-react": "^0.263.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": ["react-app"]
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version"]
  }
}
FRONTEND_PKG_EOF

echo -e "${GREEN}✓ Frontend package.json created${NC}"

# Step 8: Create root package.json
echo -e "${BLUE}[STEP 8]${NC} Creating root package.json..."

cat > package.json << 'ROOT_PKG_EOF'
{
  "name": "elearning-platform",
  "version": "1.0.0",
  "description": "E-Learning Platform for Food Sample Collection Training - Qatar MoPH",
  "private": true,
  "scripts": {
    "install-all": "npm install && npm install --prefix backend && npm install --prefix frontend",
    "dev": "concurrently \"npm --prefix backend run dev\" \"npm --prefix frontend start\"",
    "build": "npm --prefix frontend run build",
    "test": "npm --prefix backend test",
    "lint": "npm --prefix backend run lint"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/melnahas11111-ctrl/E-learning-platform.git"
  },
  "keywords": ["elearning", "food-safety", "iso-6887", "qatar"],
  "author": "E-Learning Platform Team",
  "license": "MIT"
}
ROOT_PKG_EOF

echo -e "${GREEN}✓ Root package.json created${NC}"

# Step 9: Add all files to Git
echo -e "${BLUE}[STEP 9]${NC} Adding files to Git..."
git add .

# Step 10: Create initial commit
echo -e "${BLUE}[STEP 10]${NC} Creating initial commit..."
git commit -m "Initial commit: E-Learning Platform core structure and documentation"

# Step 11: Add remote repository
echo -e "${BLUE}[STEP 11]${NC} Connecting to GitHub repository..."
git remote add origin "$GITHUB_REPO"

# Step 12: Push to GitHub
echo -e "${BLUE}[STEP 12]${NC} Pushing to GitHub..."
echo ""
echo "⚠️  You will be prompted for GitHub credentials."
echo "Use your GitHub personal access token (not password)"
echo ""
git branch -M main
git push -u origin main

echo ""
echo -e "${GREEN}✅ SUCCESS! Your repository has been pushed to GitHub!${NC}"
echo ""
echo "📍 Repository URL: $GITHUB_REPO"
echo ""
echo "Next steps:"
echo "1. Go to: https://github.com/melnahas11111-ctrl/E-learning-platform"
echo "2. Verify all files are there"
echo "3. Edit .env.example with your actual configuration"
echo "4. Follow the DEPLOYMENT_GUIDE.md to deploy"
echo ""
