
# Telemax - Custom Smoking Pipe E-commerce Platform

Telemax is a comprehensive e-commerce platform specializing in custom smoking pipes with a modular design system. The platform allows users to build custom pipes by selecting different components (starters, rings, tops) and features full user management, order processing, and administrative tools.

## 🏗️ Architecture Overview

This is a monorepo containing three main applications:

- **`api/`** - Node.js/Express REST API backend
- **`Telemax-Web/`** - React/TypeScript web application  
- **`TelemaxApp/`** - React Native mobile application

## 🚀 Applications

### Backend API (`/api`)
**Tech Stack:** Node.js, Express.js, MySQL, JWT Authentication

**Key Features:**
- User authentication & authorization with JWT
- Two-factor authentication (2FA) support
- Product catalog management with modular parts system
- Order processing and management
- Admin dashboard with comprehensive statistics
- Rate limiting and security middleware (Helmet, CORS)
- Email integration with Nodemailer
- File upload handling with Multer

**Main Endpoints:**
- `/api/auth` - Authentication (login, signup, password reset)
- `/api/products` - Product catalog and parts management
- `/api/orders` - Order processing and history
- `/api/admin` - Administrative functions (stats, users, inventory)
- `/api/builder` - Custom pipe builder functionality
- `/api/contact` - Contact form handling

### Web Application (`/Telemax-Web`)
**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion

**Key Features:**
- Modern responsive design with smooth animations
- Multi-language support (i18n)
- Custom pipe builder with visual configurator
- Shopping cart and checkout process
- User profile and order history
- Admin dashboard for management
- Advanced UI components with Radix UI
- State management with Redux Toolkit & Zustand
- Payment processing integration

**Main Pages:**
- Home page with product showcase
- Custom pipe builder/configurator
- Shopping cart and checkout
- User authentication (signin/signup)
- Admin dashboard with analytics
- Order management and history

### Mobile App (`/TelemaxApp`)
**Tech Stack:** React Native, Expo, TypeScript, NativeWind (Tailwind)

**Key Features:**
- Cross-platform mobile experience
- Native navigation with React Navigation
- Authentication flow
- Product browsing and customization
- Shopping cart functionality
- User profile management
- State management with Zustand

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- MySQL database
- Expo CLI (for mobile app development)

### Backend Setup
```bash
cd api/
npm install
npm run dev
```

### Web Application Setup
```bash
cd Telemax-Web/
npm install
npm run dev
```

### Mobile Application Setup
```bash
cd TelemaxApp/
npm install
npm start
```

## 📊 Database Schema

The platform uses MySQL with the following core entities:

- **Users** - Customer accounts with authentication
- **Products** - Complete pipe products
- **Parts** - Modular components (starters, rings, tops)
- **Orders** - Purchase transactions and history
- **Contacts** - Customer inquiries

## 🔧 Configuration

### Environment Variables

**Backend (`/api/.env`):**
- Database configuration (MySQL)
- JWT secrets and expiration
- Email service settings
- Server port configuration

**Web App (`/Telemax-Web/.env`):**
- API endpoints
- Payment gateway keys
- External service configurations

## 🚀 Deployment

### Production Setup
- Backend: Configured for production deployment on port 4000
- Frontend: Built with Vite for optimized production bundles
- Database: Production MySQL instance at specified IP
- Process management: PM2 ecosystem configuration included

### Admin Access
The platform includes comprehensive admin functionality for:
- User management and statistics
- Product catalog and inventory management
- Order processing and fulfillment
- Contact form management
- Export functionality for data analysis

## 📱 Platform-Specific Features

### Web Platform
- Advanced animations with Framer Motion and GSAP
- Smooth scrolling with Lenis
- Image galleries and carousels
- Responsive design across all devices
- SEO optimization

### Mobile Platform  
- Native mobile UI/UX patterns
- Optimized for touch interactions
- Platform-specific navigation
- Offline capability considerations

## 🔐 Security Features

- JWT-based authentication with secure token handling
- Rate limiting to prevent abuse
- Input validation and sanitization
- SQL injection prevention
- CORS configuration for cross-origin requests
- Helmet.js for security headers

---

**Note:** This platform is specifically designed for custom smoking pipe manufacturing and sales, featuring a unique modular component system that allows customers to build personalized products.
