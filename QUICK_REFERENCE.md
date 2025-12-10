# 🚀 Quick Reference Guide

## Run the Project

```bash
cd frontend
npm install
npm run dev
```

Open: http://localhost:5173

---

## Key Files

### Configuration
- `vite.config.ts` - Vite config
- `tailwind.config.js` - Tailwind config
- `tsconfig.json` - TypeScript config
- `.env` - Environment variables
- `src/i18n.ts` - i18n configuration

### Main Entry
- `src/main.tsx` - App entry point
- `src/App.tsx` - Root component
- `src/routes/AppRoutes.tsx` - All routes

### Store
- `src/store/store.ts` - Redux store
- `src/store/slices/authSlice.ts` - Auth state

### Services
- `src/services/authService.ts` - Auth API calls
- `src/api/axios.config.ts` - Axios setup
- `src/api/interceptors.ts` - Request/response interceptors

---

## Routes

### Public
- `/` - Home/Dashboard (public)
- `/login` - Login page
- `/register` - Register page
- `/forgot-password` - Password reset

### Protected (Require Auth)
- `/dashboard` - Dashboard (same as home)
- `/profile` - User profile
- `/profile/edit` - Edit profile
- `/bookings` - My bookings
- `/settings` - Settings

### Public (With Layout)
- `/tours` - Tours listing
- `/destinations` - Destinations
- `/cultural` - Cultural experiences
- `/marketplace` - Marketplace

---

## Components

### Common
```typescript
import { Button } from '@components/common/Button'
import { Card } from '@components/common/Card'
import { Input } from '@components/common/Input'
import { Loader } from '@components/common/Loader'
import { LanguageSwitcher } from '@components/common/LanguageSwitcher'
```

### Layout
```typescript
import { Header } from '@components/layout/Header'
import { Footer } from '@components/layout/Footer'
import { Sidebar } from '@components/layout/Sidebar'
import { MobileNav } from '@components/layout/MobileNav'
import { MainLayout } from '@components/layout'
```

---

## Hooks

### useAuth
```typescript
import { useAuth } from '@hooks/useAuth'

const { user, isAuthenticated, isLoading, login, logout } = useAuth()
```

### useTranslation
```typescript
import { useTranslation } from 'react-i18next'

const { t, i18n } = useTranslation()
const text = t('nav.home')
i18n.changeLanguage('am')
```

---

## Translation Keys

### Navigation
```typescript
t('nav.home')
t('nav.tours')
t('nav.destinations')
t('nav.culture')
t('nav.marketplace')
t('nav.profile')
t('nav.signIn')
t('nav.signOut')
```

### Auth
```typescript
t('auth.login.title')
t('auth.register.title')
t('auth.errors.invalidEmail')
```

### Profile
```typescript
t('profile.title')
t('profile.edit')
t('profile.personalInfo')
```

---

## API Endpoints (Backend)

### Needed
```
GET  /api/users/:id          - Get user profile
PUT  /api/users/:id          - Update profile
PUT  /api/users/:id/avatar   - Update avatar
```

### Existing
```
POST /api/auth/login         - Login
POST /api/auth/register      - Register
POST /api/auth/forgot-password - Reset password
GET  /api/auth/me            - Get current user
```

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Common Tasks

### Add New Route
```typescript
// src/routes/AppRoutes.tsx
<Route path="/new-page" element={<NewPage />} />
```

### Add Protected Route
```typescript
<Route
  path="/protected"
  element={
    <PrivateRoute>
      <ProtectedPage />
    </PrivateRoute>
  }
/>
```

### Add Translation
```json
// public/locales/en/translation.json
{
  "newSection": {
    "key": "English text"
  }
}
```

### Create New Component
```typescript
// src/components/MyComponent.tsx
export const MyComponent = () => {
  return <div>My Component</div>
}

// src/components/index.ts
export { MyComponent } from './MyComponent'
```

---

## Styling

### Tailwind Classes
```typescript
// Common patterns
className="container"           // Max-width container
className="text-gradient-ethiopian"  // Ethiopian gradient text
className="hover-lift"          // Lift on hover
className="btn"                 // Button base
```

### Custom Gradients
```typescript
className="bg-gradient-primary"     // Orange gradient
className="bg-gradient-ethiopian"   // Ethiopian colors
className="from-orange-500 to-red-500"  // Custom gradient
```

---

## Redux Store

### Dispatch Action
```typescript
import { useDispatch } from 'react-redux'
import { loginAsync } from '@store/slices/authSlice'

const dispatch = useDispatch()
dispatch(loginAsync({ email, password }))
```

### Select State
```typescript
import { useSelector } from 'react-redux'
import type { RootState } from '@store/store'

const user = useSelector((state: RootState) => state.auth.user)
```

---

## Form Validation

### Zod Schema
```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})
```

### React Hook Form
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
})
```

---

## Debugging

### Check Auth State
```typescript
console.log('User:', user)
console.log('Authenticated:', isAuthenticated)
console.log('Token:', localStorage.getItem('auth_token'))
```

### Check Language
```typescript
console.log('Current language:', i18n.language)
console.log('Translations:', i18n.store.data)
```

### Check Redux Store
```typescript
import { store } from '@store/store'
console.log('Store state:', store.getState())
```

---

## Build & Deploy

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
npm run lint:fix
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### Clear Cache
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run type-check
```

### Build Errors
```bash
npm run build
# Check output for errors
```

---

## Documentation

- `DELIVERABLES_SUMMARY.md` - Complete overview
- `API_REQUIREMENTS.md` - Backend API specs
- `WEEK2_COMPLETE.md` - Layout features
- `I18N_COMPLETE.md` - i18n setup
- `DASHBOARD_COMPLETE.md` - Dashboard features
- `WEEK3_READY.md` - Current status

---

## Support

- GitHub Issues: [URL]
- Slack: #ethioai-tourism
- Docs: See markdown files in `/frontend`

---

**Last Updated:** December 6, 2025
