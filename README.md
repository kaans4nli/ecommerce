# E-Commerce Platform

A modern e-commerce application built with React (frontend) and Spring Boot (backend), featuring admin dashboard, product management, and user shopping capabilities.

## Tech Stack

### Backend
- **Spring Boot 4.0.6** - Java 17
- **Spring Data JPA** - Database ORM
- **Spring Security + JWT** - Authentication & Authorization
- **PostgreSQL** - Database
- **Maven** - Build tool

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Navigation

## Features

### Public Features
- Browse products with filtering and search
- View product details
- Add products to cart and favorites
- Checkout process

### Admin Features
- Admin dashboard with statistics
- Product management (CRUD)
- Category management
- Product image uploads
- JWT-based authentication

## Installation

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Environment Setup

1. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

2. Update environment variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USERNAME=postgres
DB_PASSWORD=postgres

JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-32-chars-for-security!
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### Backend Setup

```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will start on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will start on `http://localhost:5173`

## Docker Setup

```bash
# Start all services with Docker Compose
docker-compose up -d

# Stop services
docker-compose down
```

## API Endpoints

### Auth
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user info

### Products (Public)
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get product details
- `GET /api/products/featured` - Get featured products

### Products (Admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `POST /api/admin/products/{id}/image` - Upload product image

### Categories (Public)
- `GET /api/categories` - Get all categories

### Categories (Admin)
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/{id}` - Update category
- `DELETE /api/admin/categories/{id}` - Delete category

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

## Database Schema

### Tables
- `admins` - Admin users
- `products` - Product catalog
- `categories` - Product categories

## Development

### Running Tests
```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
npm run test
```

### Code Quality
```bash
# Frontend linting
npm run lint

# Frontend linting fix
npm run lint -- --fix
```

## Key Configuration Files

- `backend/src/main/resources/application.properties` - Backend configuration
- `frontend/vite.config.js` - Vite configuration
- `frontend/.eslintrc.cjs` - ESLint configuration
- `docker-compose.yml` - Docker services configuration

## Security Notes

- JWT tokens expire after 24 hours (configurable)
- Admin routes require `ROLE_ADMIN` authority
- CORS is configured for development
- HTTPS recommended for production
- Store JWT secret securely in production

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` in `.env`

### Frontend API Calls Failing
- Ensure backend is running on port 8080
- Check CORS settings in `app.cors.allowed-origins`

### File Upload Issues
- Ensure Cloudinary credentials are configured
- Check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`

## Project Structure

```
ecommerce/
├── backend/
│   ├── src/main/java/com/example/ecommerce/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── security/
│   │   ├── config/
│   │   └── exception/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── store/
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── .eslintrc.cjs
│   └── package.json
└── docker-compose.yml
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the MIT License.
