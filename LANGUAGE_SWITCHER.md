# 🌍 Language Switcher Feature

## Overview
Multi-language support with English, Amharic (አማርኛ), and Afaan Oromoo translations.

## Features
- ✅ Language dropdown in header
- ✅ Persistent language selection (localStorage)
- ✅ Auto-detection of browser language
- ✅ Three languages: English, Amharic, Afaan Oromoo
- ✅ Translated navigation, footer, and UI elements
- ✅ Flag emojis for visual identification

## Languages Supported

### English (en) 🇬🇧
Default language for the application.

### Amharic (am) 🇪🇹
አማርኛ - Official language of Ethiopia

### Afaan Oromoo (om) 🇪🇹
Afaan Oromoo - Widely spoken in Ethiopia

## Implementation

### i18n Configuration
**File:** `src/i18n.ts`

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'am', 'om'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })
```

### Translation Files
**Location:** `public/locales/{language}/translation.json`

Structure:
```
public/locales/
├── en/
│   └── translation.json
├── am/
│   └── translation.json
└── om/
    └── translation.json
```

### LanguageSwitcher Component
**File:** `src/components/common/LanguageSwitcher/LanguageSwitcher.tsx`

Features:
- Dropdown menu with language options
- Current language indicator
- Flag emojis for visual identification
- Click outside to close
- Checkmark for selected language
- Responsive design (hides language name on mobile)

## Usage

### In Components
```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('nav.home')}</h1>
      <p>{t('footer.brand.tagline')}</p>
    </div>
  )
}
```

### Change Language Programmatically
```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { i18n } = useTranslation()
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }
  
  return (
    <button onClick={() => changeLanguage('am')}>
      Switch to Amharic
    </button>
  )
}
```

## Translation Keys

### Navigation (`nav`)
- `home` - Home
- `tours` - Tours
- `destinations` - Destinations
- `culture` - Culture
- `marketplace` - Marketplace
- `about` - About
- `contact` - Contact
- `dashboard` - Dashboard
- `profile` - Profile
- `bookings` - My Bookings
- `settings` - Settings
- `signIn` - Sign In
- `signUp` - Sign Up
- `signOut` - Sign Out

### Footer (`footer`)
- `footer.brand.tagline` - Brand tagline
- `footer.brand.madeWith` - Made with ❤️ in Ethiopia
- `footer.explore.title` - Explore section title
- `footer.explore.tours` - Tours link
- `footer.explore.destinations` - Destinations link
- `footer.explore.culture` - Culture link
- `footer.explore.marketplace` - Marketplace link
- `footer.company.title` - Company section title
- `footer.company.about` - About Us
- `footer.company.careers` - Careers
- `footer.company.press` - Press
- `footer.company.blog` - Blog
- `footer.support.title` - Support section title
- `footer.support.help` - Help Center
- `footer.support.safety` - Safety
- `footer.support.terms` - Terms of Service
- `footer.support.privacy` - Privacy Policy
- `footer.copyright` - Copyright notice

### Authentication (`auth`)
- `auth.login.*` - Login form fields and messages
- `auth.register.*` - Registration form fields
- `auth.forgotPassword.*` - Password reset form
- `auth.errors.*` - Error messages

### Profile (`profile`)
- `profile.title` - My Profile
- `profile.edit` - Edit Profile
- `profile.changePassword` - Change Password
- `profile.personalInfo` - Personal Information
- `profile.accountSettings` - Account Settings
- `profile.emailVerified` - Email Verified
- `profile.emailNotVerified` - Email Not Verified
- `profile.notifications` - Email Notifications
- `profile.marketing` - Marketing Emails
- `profile.dangerZone` - Danger Zone
- `profile.deleteAccount` - Delete Account
- `profile.deleteWarning` - Warning message

## Components Updated

### Header
- ✅ Language switcher added
- ✅ Navigation links translated
- ✅ User menu items translated
- ✅ Sign In/Sign Up buttons translated

### Footer
- ✅ All sections translated
- ✅ Links translated
- ✅ Copyright notice translated
- ✅ Brand tagline translated

### Sidebar
- ✅ Navigation items translated
- ✅ Footer text translated

### MobileNav
- ✅ Navigation labels translated

## Adding New Translations

### 1. Add to English file
```json
{
  "newSection": {
    "key": "English text"
  }
}
```

### 2. Add to Amharic file
```json
{
  "newSection": {
    "key": "የአማርኛ ጽሑፍ"
  }
}
```

### 3. Add to Afaan Oromoo file
```json
{
  "newSection": {
    "key": "Barreeffama Afaan Oromoo"
  }
}
```

### 4. Use in component
```tsx
const { t } = useTranslation()
return <div>{t('newSection.key')}</div>
```

## Browser Language Detection

The app automatically detects the user's browser language and sets it if supported:
- If browser language is `am` → Sets Amharic
- If browser language is `om` → Sets Afaan Oromoo
- Otherwise → Defaults to English

## Persistence

Language selection is saved to `localStorage` and persists across sessions.

**Storage Key:** `i18nextLng`

## Dependencies

```json
{
  "i18next": "^23.16.8",
  "react-i18next": "^13.5.0",
  "i18next-http-backend": "^2.x.x",
  "i18next-browser-languagedetector": "^7.x.x"
}
```

## Testing

### Manual Testing
1. Click language switcher in header
2. Select different language
3. Verify all text changes
4. Refresh page - language should persist
5. Check localStorage for `i18nextLng` key

### Browser Language Test
1. Change browser language to Amharic
2. Clear localStorage
3. Reload app
4. Should default to Amharic

## Future Enhancements

- [ ] Add more languages (Tigrinya, Somali, etc.)
- [ ] Add language-specific date/time formatting
- [ ] Add RTL support for Arabic
- [ ] Add translation management UI
- [ ] Add missing translation warnings in dev mode
- [ ] Add translation coverage reports

## Accessibility

- ✅ ARIA labels on language switcher
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Clear visual indicators

## Performance

- ✅ Lazy loading of translation files
- ✅ Caching in localStorage
- ✅ Only loads selected language
- ✅ No impact on initial bundle size

---

**Status:** ✅ Complete  
**Last Updated:** December 6, 2025
