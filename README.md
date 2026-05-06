# E-Learning Platform: Food Sample Collection Training
## Qatar Ministry of Public Health (MoPH)

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: May 2026

---

## 📋 QUICK START GUIDE

### Prerequisites
```bash
# Node.js v18+
node --version

# PostgreSQL 14+
psql --version

# npm v9+
npm --version
```

### Installation (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/moph/elearning-platform.git
cd elearning-platform

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your values (database, Firebase, JWT keys, etc.)

# 4. Initialize database
psql -U elearning_user -d elearning_platform -f schema.sql

# 5. Start development server
npm run dev

# Server running at http://localhost:3000
```

---

## 🎯 PROJECT OVERVIEW

### Purpose
Secure, standards-compliant e-learning platform for training food inspectors in modern food sample collection methods per **ISO 6887 series** standards, validated by Qatar Ministry of Public Health.

### Key Features
✅ **ISO 6887 Compliance** - Immutable content with SHA-256 hash verification
✅ **Secure Authentication** - JWT + RBAC + MFA support
✅ **Progress Tracking** - Module completion, assessment scoring, certification
✅ **Firebase Integration** - Real-time sync + Cloud backup
✅ **Qatar Timezone** - All logs in AST (UTC+3)
✅ **Automated Backups** - Full/incremental with 90-day retention
✅ **Admin Dashboard** - User management, QR enrollment, analytics
✅ **Audit Trail** - Complete activity logging for compliance

---

## 📁 PROJECT STRUCTURE

```
elearning-platform/
│
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   ├── firebase.js          # Firebase configuration
│   │   └── environment.js       # Environment variables
│   │
│   ├── controllers/
│   │   ├── authController.js    # Login, QR enrollment
│   │   ├── userController.js    # User profile mgmt
│   │   ├── contentController.js # Course content
│   │   ├── progressController.js # Progress tracking
│   │   ├── assessmentController.js # Assessments & grades
│   │   ├── analyticsController.js # Reporting
│   │   └── adminController.js   # Admin functions
│   │
│   ├── routes/
│   │   ├── auth.js              # /api/auth/*
│   │   ├── users.js             # /api/users/*
│   │   ├── content.js           # /api/content/*
│   │   ├── progress.js          # /api/progress/*
│   │   ├── assessments.js       # /api/assessments/*
│   │   ├── analytics.js         # /api/analytics/*
│   │   └── admin.js             # /api/admin/*
│   │
│   ├── services/
│   │   ├── contentService.js    # Content management
│   │   ├── progressService.js   # Progress logic
│   │   ├── firebaseService.js   # Firebase sync
│   │   ├── backupService.js     # Backup automation
│   │   └── emailService.js      # Email notifications
│   │
│   ├── middleware/
│   │   ├── authentication.js    # JWT verification
│   │   ├── authorization.js     # RBAC checks
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── requestValidator.js  # Input validation
│   │   └── auditLogger.js       # Audit trail
│   │
│   ├── utils/
│   │   ├── dateTimeUtils.js     # Qatar timezone (AST)
│   │   ├── qrGenerator.js       # QR code generation
│   │   ├── tokenGenerator.js    # JWT & tokens
│   │   ├── encryption.js        # Data encryption
│   │   └── logger.js            # Winston logging
│   │
│   ├── database/
│   │   ├── schema.sql           # Full schema
│   │   └── migrations/          # Database migrations
│   │
│   └── tests/
│       ├── auth.test.js
│       ├── assessments.test.js
│       └── backup.test.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TraineeDashboard.jsx    # Student view
│   │   │   ├── AdminDashboard.jsx      # Admin view
│   │   │   ├── AssessmentComponent.jsx
│   │   │   ├── ModuleComponent.jsx
│   │   │   └── ProgressChart.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── EnrollmentPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js           # API client
│   │   │   └── auth.js          # Auth service
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.js       # Auth hook
│   │   │
│   │   ├── App.jsx
│   │   └── index.jsx
│   │
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── DEPLOYMENT_GUIDE.md      # Full deployment steps
│   ├── IMPLEMENTATION_SUMMARY.md # Architecture & APIs
│   ├── DATABASE_SCHEMA.md       # Entity relationships
│   ├── API_DOCUMENTATION.md     # Endpoint details
│   └── SECURITY_GUIDE.md        # Security best practices
│
├── scripts/
│   ├── migrate.js               # Database migrations
│   ├── backup.js                # Backup automation
│   ├── restore.js               # Restore from backup
│   └── seed.js                  # Demo data
│
├── nginx/
│   └── elearning-platform.conf  # Nginx config
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── LICENSE
```

---

## 🚀 DEPLOYMENT

### Development Environment
```bash
npm run dev
# Server: http://localhost:3000
# HMR enabled for React components
```

### Production Deployment
See **DEPLOYMENT_GUIDE.md** for:
- System requirements setup
- PostgreSQL configuration
- Node.js service setup
- Nginx reverse proxy
- SSL/TLS certificates
- Firewall configuration
- Automated backups
- Monitoring setup

**Quick Deploy Command**:
```bash
npm run build
npm run migrate
npm start
```

---

## 🔐 SECURITY

### Authentication
- JWT tokens (7-day access, 30-day refresh)
- Bcrypt password hashing (10 salt rounds)
- Account lockout after 5 failed attempts
- Session management with 24-hour expiry
- Optional MFA support

### Data Protection
- SHA-256 content hash verification
- AES-256-GCM encryption for sensitive data
- SSL/TLS for all communications
- PostgreSQL access restricted to localhost
- Input validation on all endpoints

### Audit & Compliance
- Activity logging for all user actions
- Audit trail for administrative operations
- IP address and device tracking
- Qatar timezone logging for local compliance
- 90-day backup retention

### Authorization (RBAC)
```
ADMIN     - User mgmt, content validation, backups, analytics
TRAINER   - Create content, review assessments, reports
TRAINEE   - Access courses, take assessments
EVALUATOR - Grade practical assessments
```

---

## 💾 DATABASE

### Overview
- **Primary**: PostgreSQL 14+ (ACID compliance)
- **Backup**: Firebase Realtime Database
- **Schema**: 25+ tables covering users, content, progress, assessments, audit logs

### Key Tables
```
users                  → User accounts & roles
curriculum_versions    → Immutable course content (ISO 6887)
modules                → Course modules & structure
assessments           → Knowledge checks & final exam
assessment_attempts   → Grading results & scores
trainee_course_progress → Progress tracking (0-100%)
certifications        → Generated certificates
activity_log          → User activity audit trail
backup_logs           → Backup operation records
firebase_sync_log     → Real-time sync events
```

### Backup Strategy
- **Full Backup**: Every 24 hours (compressed, ~50-100MB)
- **Incremental Backup**: Every 6 hours
- **Firebase Sync**: Every 4 hours (real-time data)
- **Retention**: 90 days
- **Verification**: SHA-256 hash validation

---

## 🌐 API DOCUMENTATION

### Authentication
```
POST /api/auth/login           - User login
POST /api/auth/enroll-qr       - QR enrollment
POST /api/auth/logout          - Logout
POST /api/auth/refresh-token   - Refresh JWT
```

### User Management
```
GET  /api/users/me             - Current user
PUT  /api/users/me             - Update profile
POST /api/users/change-password - Password change
GET  /api/users/sessions       - Active sessions
```

### Content & Courses
```
GET /api/content/courses       - List courses
GET /api/content/courses/:id   - Course details
GET /api/content/modules/:id   - Module content
GET /api/content/curriculum-hash - Content integrity
```

### Progress & Assessments
```
GET  /api/progress/dashboard   - User progress
POST /api/assessments/start/:id - Start assessment
POST /api/assessments/submit/:id - Submit answers
GET  /api/assessments/results  - Results & grade
GET  /api/assessments/certificate - Download cert
```

### Admin Functions
```
POST /api/admin/users/create   - Create user
GET  /api/admin/users          - List users
POST /api/admin/qr-tokens/generate - Generate QR
POST /api/admin/backups/full   - Trigger backup
POST /api/admin/firebase/sync-users - Manual sync
```

Full API docs: See **IMPLEMENTATION_SUMMARY.md**

---

## 📊 ANALYTICS

### Dashboard Metrics
- User enrollment statistics
- Course completion rates (%)
- Assessment pass rates
- Average time per module
- Top performers ranking
- Recent activity timeline

### Reporting
- CSV export of user progress
- Trainee completion reports
- Assessment performance analysis
- Access log reports (by date range)
- Firebase sync status

---

## 🔧 ENVIRONMENT VARIABLES

```env
# Server
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=elearning_platform
DB_USER=elearning_user
DB_PASSWORD=secure_password
DB_SSL=true

# JWT
JWT_SECRET=your-64-char-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-key
FIREBASE_CLIENT_EMAIL=your-email
FIREBASE_DATABASE_URL=https://your-db.firebaseio.com
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
BACKUP_STORAGE_PATH=/var/backups/elearning
FIREBASE_BACKUP_ENABLED=true

# Security
ENCRYPTION_KEY=your-256-bit-hex-key
ALLOWED_ORIGINS=https://elearning-platform.qa

# App
APP_URL=https://elearning-platform.qa
DEFAULT_TIMEZONE=Asia/Qatar
```

---

## 🧪 TESTING

```bash
# Run all tests
npm test

# Watch mode
npm test:watch

# Coverage report
npm test -- --coverage

# Specific test file
npm test -- auth.test.js
```

### Test Suite Coverage
- ✅ Authentication flows
- ✅ Authorization (RBAC)
- ✅ Assessment submission & grading
- ✅ Progress tracking
- ✅ Backup operations
- ✅ Firebase sync
- ✅ Error handling

---

## 📝 DOCUMENTATION

| Document | Purpose |
|----------|---------|
| **DEPLOYMENT_GUIDE.md** | Complete setup from scratch |
| **IMPLEMENTATION_SUMMARY.md** | Architecture, features, APIs |
| **DATABASE_SCHEMA.md** | Entity relationships, fields |
| **API_DOCUMENTATION.md** | Detailed endpoint reference |
| **SECURITY_GUIDE.md** | Security best practices |
| **TROUBLESHOOTING.md** | Common issues & solutions |

---

## 👥 TEAM & SUPPORT

### Project Team
- **Backend Lead**: backend@elearning-platform.qa
- **Frontend Lead**: frontend@elearning-platform.qa
- **DevOps/Infrastructure**: devops@elearning-platform.qa
- **Database Admin**: dba@elearning-platform.qa

### Support
- **Technical Support**: support@elearning-platform.qa
- **Issue Tracking**: https://github.com/moph/elearning-platform/issues
- **Documentation**: https://docs.elearning-platform.qa
- **Status Page**: https://status.elearning-platform.qa

---

## 📦 VERSIONING

- **Current Version**: 1.0.0
- **Release Date**: May 2026
- **Node.js**: 18.x LTS
- **PostgreSQL**: 14.x
- **React**: 18.x (Frontend)

---

## 📄 LICENSE

MIT License - See LICENSE file for details

---

## ✅ PRODUCTION READINESS CHECKLIST

- [x] Database schema finalized
- [x] API endpoints documented
- [x] Authentication & authorization implemented
- [x] Backup/recovery tested
- [x] Firebase integration complete
- [x] Logging & monitoring setup
- [x] Security audit passed
- [x] Load testing completed
- [x] UI/UX reviewed
- [x] Documentation complete
- [x] Deployment guide ready
- [x] Support procedures established

---

## 🎓 SYSTEM COMPLIANCE

### Standards Compliance
- ✅ **ISO 6887**: Food sample preparation standards
- ✅ **ISO 27001**: Information security management
- ✅ **GDPR**: Data protection (if applicable)
- ✅ **Qatar Local Requirements**: Timezone, data residency

### Features for Compliance
- Immutable content storage with validation
- Complete audit trail for regulatory review
- Admin-controlled access and enrollment
- Encrypted data in transit and at rest
- Automated backup with verification
- Activity logging with Qatar timezone

---

## 🚀 NEXT STEPS

1. **Review** DEPLOYMENT_GUIDE.md
2. **Configure** .env with your credentials
3. **Initialize** PostgreSQL database
4. **Run** npm install && npm run migrate
5. **Start** npm run dev
6. **Test** user enrollment and assessments
7. **Deploy** to production (see deployment guide)
8. **Monitor** logs and backup operations

---

**Questions?** Refer to IMPLEMENTATION_SUMMARY.md or contact support@elearning-platform.qa

**Ready to Deploy?** Follow DEPLOYMENT_GUIDE.md step-by-step.

---

*This platform was developed with Qatar MoPH Food Safety Department standards and is ready for production use.*
