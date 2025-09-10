# Development Test Credentials

Use these credentials for testing the application during development:

## Test Users

### Demo User
- **Email:** `demo@telemax.com`
- **Password:** `demo123`
- **Role:** user
- **Status:** ✅ Verified working

### New Test User
- **Email:** `newuser@test.com`
- **Password:** `test123456`  
- **Role:** user
- **Status:** ✅ Verified working

## Testing the Auth Flow

### Backend API Tests (via curl)
```bash
# Test signup
curl -X POST http://209.38.231.125:4000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"first_name": "Test", "last_name": "User", "email": "test@example.com", "password": "password123"}'

# Test signin
curl -X POST http://209.38.231.125:4000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@telemax.com", "password": "demo123"}'
```

### Frontend Tests
Use the above credentials in the signin form at `/signin`.

## Troubleshooting

If you get 401 Unauthorized errors:

1. **Check credentials**: Make sure you're using the exact email/password combinations above
2. **Verify API is running**: The backend API should be running on port 4000
3. **Check CORS**: CORS is configured to allow all origins for development
4. **Database connection**: Ensure MySQL database is accessible and contains the users

## API Endpoints Verified Working

- ✅ `POST /api/auth/signup` - User registration
- ✅ `POST /api/auth/signin` - User authentication  
- ✅ `GET /api/auth/me` - Get current user profile
- ✅ `GET /api/health` - Health check

## Notes

- All authentication is working correctly on the backend
- CORS is properly configured for development
- JWT tokens are generated and validated correctly
- Password hashing with bcryptjs is working properly