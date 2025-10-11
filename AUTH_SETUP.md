# Mothers Aura - Authentication System Setup

## 🚀 Complete Authentication Solution

This guide provides a complete authentication system with:
- ✅ **Signup/Signin** with email/password
- ✅ **Google OAuth** integration
- ✅ **Protected routes** with middleware
- ✅ **Dashboard** with Diamond Search UI
- ✅ **Profile management**
- ✅ **Responsive design** with dark/light mode

## 📋 Prerequisites

1. **PostgreSQL Database** running locally or cloud
2. **Google Cloud Console** project for OAuth
3. **Node.js 18+** and npm

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mothers_aura_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-a-random-string"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Application type** to "Web application"
6. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the **Client ID** and **Client Secret** to your `.env.local`

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# OR run migrations (for production)
npx prisma migrate dev --name init
```

### 4. Install Dependencies

All required dependencies are already installed:
- `next-auth` - Authentication framework
- `@auth/prisma-adapter` - Prisma adapter for NextAuth
- `bcryptjs` - Password hashing
- `@types/bcryptjs` - TypeScript types

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📁 File Structure

```
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts    # NextAuth configuration
│   │   ├── signup/route.ts           # User registration
│   │   └── logout/route.ts           # Logout endpoint
│   ├── dashboard/page.tsx            # Protected dashboard
│   ├── signin/page.tsx               # Sign in page
│   ├── signup/page.tsx               # Sign up page
│   └── profile/page.tsx              # User profile
├── components/
│   ├── AuthenticatedHeader.tsx       # Header for logged-in users
│   ├── DiamondSearch.tsx            # Diamond search UI
│   └── Providers.tsx                # NextAuth provider wrapper
├── lib/
│   └── auth.ts                      # NextAuth configuration
├── prisma/
│   └── schema.prisma                # Database schema
└── middleware.ts                    # Route protection
```

## 🔐 Authentication Features

### User Registration
- **Form validation** with real-time feedback
- **Password strength** requirements
- **Email uniqueness** validation
- **Phone number** optional field
- **Bcrypt password hashing**

### User Sign In
- **Email/password** authentication
- **Google OAuth** with one-click signin
- **Form validation** and error handling
- **Automatic redirect** to dashboard

### Route Protection
- **Middleware-based** protection
- **Automatic redirects** for unauthenticated users
- **Session management** with NextAuth

### Dashboard Features
- **Diamond Search UI** with advanced filters
- **Responsive design** matching landing page
- **User profile** integration
- **Dark/light mode** support

## 🎨 UI Components

### Responsive Design
- **Mobile-first** approach
- **Tailwind CSS** styling
- **shadcn/ui** components
- **Consistent theming** with landing page

### Form Components
- **Input validation** with visual feedback
- **Loading states** during submission
- **Error handling** with user-friendly messages
- **Accessibility** features (ARIA labels, focus management)

## 🚦 Authentication Flow

### New User Journey
1. Visit landing page
2. Click "Sign Up" → `/signup`
3. Fill registration form
4. Redirect to `/signin` with success message
5. Sign in → Redirect to `/dashboard`

### Existing User Journey
1. Visit `/signin` or protected route
2. Sign in with email/password or Google
3. Redirect to `/dashboard`
4. Access protected features

### Google OAuth Flow
1. Click "Sign in with Google"
2. Google consent screen
3. Automatic account creation/login
4. Redirect to `/dashboard`

## 🛡️ Security Features

### Password Security
- **Bcrypt hashing** with salt rounds
- **Minimum length** requirements
- **No plaintext** storage

### Session Management
- **JWT tokens** with NextAuth
- **Secure cookie** handling
- **Automatic expiration**

### Route Protection
- **Middleware-based** authentication
- **API route** protection
- **Client-side** guards

## 🎯 Next Steps

### Database Integration
```bash
# Run database migrations
npx prisma migrate deploy

# View data in Prisma Studio
npx prisma studio
```

### Production Deployment
1. Set up production database
2. Configure production environment variables
3. Deploy to Vercel/Netlify
4. Update Google OAuth redirect URIs

### Additional Features
- Email verification
- Password reset
- Profile picture upload
- Two-factor authentication
- Social login (Facebook, Twitter)

## 🐛 Troubleshooting

### Common Issues

1. **"Database connection failed"**
   - Check DATABASE_URL in `.env.local`
   - Ensure PostgreSQL is running
   - Run `npx prisma db push`

2. **"Google OAuth not working"**
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Check redirect URIs in Google Console
   - Ensure NEXTAUTH_URL is correct

3. **"NextAuth session undefined"**
   - Verify NEXTAUTH_SECRET is set
   - Check Providers wrapper in layout
   - Ensure middleware is configured

### Debug Commands
```bash
# Check database connection
npx prisma db ping

# View generated Prisma client
npx prisma generate --debug

# Check NextAuth configuration
npm run dev -- --debug
```

## 📞 Support

If you encounter any issues:
1. Check this documentation
2. Review the code comments
3. Check Next.js and NextAuth documentation
4. Contact the development team

---

**🎉 Your authentication system is now ready!**

Test the complete flow:
1. Register a new account
2. Sign in with credentials
3. Try Google OAuth
4. Access the dashboard
5. View your profile
6. Sign out and verify redirects










