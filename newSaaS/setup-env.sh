#!/bin/bash

# CODShop SaaS - Environment Setup Guide
# This file documents all environment variables needed

cat > backend/.env << 'EOF'
# Application Settings
APP_NAME=CODShop
APP_ENV=local
APP_KEY=base64:abcdefghijklmnopqrstuvwxyz1234567890ABCD=
APP_DEBUG=true
APP_URL=http://localhost
APP_TIMEZONE=UTC

# Database Configuration
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=saas_db
DB_USERNAME=postgres
DB_PASSWORD=password

# Authentication
AUTH_DRIVER=session
AUTH_GUARD=web

# Session Configuration
SESSION_DRIVER=cookie
SESSION_LIFETIME=120

# Cache Configuration
CACHE_DRIVER=redis
CACHE_PREFIX=

# Queue Configuration
QUEUE_CONNECTION=redis
QUEUE_PREFIX=codshop_queue_

# Redis Configuration
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail Configuration
MAIL_MAILER=log
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@codshop.local
MAIL_FROM_NAME="${APP_NAME}"

# AWS / MinIO Configuration (S3-compatible)
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=products
AWS_URL=http://minio:9000
AWS_ENDPOINT=http://minio:9000
AWS_USE_PATH_STYLE_ENDPOINT=true

# Sanctum Configuration (API Token Auth)
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,127.0.0.1,127.0.0.1:5173
SANCTUM_ENCRYPTION_KEY=

# Logging
LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug
LOG_STACK=single

# Feature Flags
FEATURES=

# Company Info
APP_COMPANY_NAME=CODShop
APP_COMPANY_DOMAIN=codshop.com
APP_COMPANY_EMAIL=support@codshop.com

# Payment Gateway (Optional)
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

# SMS Service (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Email Service
SENDGRID_API_KEY=
EOF

echo "✅ Backend .env file created at backend/.env"
echo ""
echo "📝 Frontend Environment:"
echo "Create frontend/.env with:"
cat > frontend/.env << 'EOF'
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=CODShop
VITE_APP_TITLE=CODShop - E-commerce SaaS
EOF

echo "✅ Frontend .env file created at frontend/.env"
echo ""
echo "🔑 Important Notes:"
echo ""
echo "1. Generate Laravel APP_KEY:"
echo "   docker-compose exec backend php artisan key:generate"
echo ""
echo "2. For Production, update:"
echo "   - APP_ENV=production"
echo "   - APP_DEBUG=false"
echo "   - Strong passwords for databases"
echo "   - Real email service (SendGrid, AWS SES)"
echo "   - Real storage service (Cloudflare R2, AWS S3)"
echo ""
echo "3. For Email Verification:"
echo "   - Set MAIL_MAILER to 'sendgrid' or 'mailgun'"
echo "   - Add API keys for your email service"
echo ""
echo "4. For Payments (Future):"
echo "   - Add Stripe keys when implementing payment"
echo ""
echo "5. Database backup directory setup:"
mkdir -p backups
chmod 755 backups
echo "   ✅ Created /backups directory"
echo ""
echo "6. Storage permissions:"
mkdir -p backend/storage/app/private
mkdir -p backend/storage/app/public
mkdir -p backend/storage/framework/cache
mkdir -p backend/storage/framework/sessions
mkdir -p backend/storage/logs
chmod -R 775 backend/storage
echo "   ✅ Storage directories created with proper permissions"
echo ""
echo "🚀 Next steps:"
echo "   1. Review the .env files for your setup"
echo "   2. Run: docker-compose up -d"
echo "   3. Run: docker-compose exec backend php artisan migrate --force"
echo "   4. Run: docker-compose exec backend php artisan db:seed"
echo "   5. Access: http://localhost:5173"
