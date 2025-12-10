# 📦 Component Library

## Overview

Reusable, accessible, and scalable components for the EthioAI Tourism Platform.

---

## 🔘 Button Component

### Location
`src/components/common/Button/Button.tsx`

### Features
- ✅ Multiple variants (primary, secondary, outline, ghost)
- ✅ Three sizes (sm, md, lg)
- ✅ Loading state with spinner
- ✅ Disabled state
- ✅ Full accessibility (ARIA, keyboard)
- ✅ TypeScript types
- ✅ Hover effects

### Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}
```

### Usage

```tsx
import { Button } from '@components/common/Button'

// Primary button
<Button variant="primary" size="md">
  Click Me
</Button>

// Loading state
<Button variant="primary" isLoading>
  Submitting...
</Button>

// Disabled
<Button variant="secondary" disabled>
  Disabled
</Button>

// With onClick
<Button 
  variant="outline" 
  onClick={() => console.log('clicked')}
>
  Outline Button
</Button>
```

### Variants Preview

**Primary** - Main actions, CTAs
- Background: Ethiopian gold/orange gradient
- Text: White
- Hover: Darker shade

**Secondary** - Secondary actions
- Background: Light gray
- Text: Dark gray
- Hover: Darker background

**Outline** - Tertiary actions
- Background: Transparent
- Border: Gray
- Hover: Light background

**Ghost** - Minimal actions
- Background: Transparent
- No border
- Hover: Light background

---

## 📝 Input Component

### Location
`src/components/common/Input/Input.tsx`

### Features
- ✅ Label support
- ✅ Error messages
- ✅ Helper text
- ✅ Required indicator (*)
- ✅ Disabled state
- ✅ Focus ring
- ✅ ARIA attributes
- ✅ TypeScript types

### Props

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}
```

### Usage

```tsx
import { Input } from '@components/common/Input'

// Basic input
<Input 
  label="Email" 
  type="email" 
  placeholder="you@example.com"
/>

// With error
<Input 
  label="Password" 
  type="password" 
  error="Password is required"
  required
/>

// With helper text
<Input 
  label="Username" 
  helperText="Choose a unique username"
/>

// Disabled
<Input 
  label="Disabled" 
  disabled 
  value="Cannot edit"
/>

// With react-hook-form
<Input 
  {...register('email')}
  label="Email"
  error={errors.email?.message}
/>
```

### States

- **Default** - Normal state
- **Focus** - Blue ring
- **Error** - Red border + error message
- **Disabled** - Gray, not editable
- **Required** - Red asterisk (*)

---

## 🎴 Card Component

### Location
`src/components/common/Card/Card.tsx`

### Features
- ✅ Multiple sub-components
- ✅ Two variants (default, elevated)
- ✅ Flexible layout
- ✅ TypeScript types
- ✅ Responsive

### Components

```typescript
- Card          // Container
- CardHeader    // Top section
- CardTitle     // Heading
- CardDescription // Subtitle
- CardContent   // Main content
- CardFooter    // Bottom section
```

### Props

```typescript
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
}
```

### Usage

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent,
  CardFooter 
} from '@components/common/Card'

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Elevated card
<Card variant="elevated">
  <CardContent>
    <p>Card with shadow</p>
  </CardContent>
</Card>

// With hover effect
<Card className="hover-lift cursor-pointer">
  <CardContent>
    <p>Clickable card</p>
  </CardContent>
</Card>
```

### Layout Examples

**Simple Card:**
```tsx
<Card>
  <CardContent>
    <p>Simple content</p>
  </CardContent>
</Card>
```

**Full Card:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## ⏳ Loader Component

### Location
`src/components/common/Loader/Loader.tsx`

### Features
- ✅ Three sizes (sm, md, lg)
- ✅ Optional text
- ✅ Animated spinner
- ✅ ARIA attributes
- ✅ Accessible
- ✅ TypeScript types

### Props

```typescript
interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}
```

### Usage

```tsx
import { Loader } from '@components/common/Loader'

// Basic loader
<Loader />

// With text
<Loader text="Loading..." />

// Different sizes
<Loader size="sm" />
<Loader size="md" />
<Loader size="lg" />

// Full page loader
<div className="min-h-screen flex items-center justify-center">
  <Loader size="lg" text="Loading your data..." />
</div>

// Inline loader
<Button isLoading>
  <Loader size="sm" />
  Loading...
</Button>
```

### Sizes

- **sm** - 16px (inline, buttons)
- **md** - 32px (default, cards)
- **lg** - 48px (full page, modals)

---

## 🎯 Usage Patterns

### Form with Validation

```tsx
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'
import { useForm } from 'react-hook-form'

function MyForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('email')}
            label="Email"
            type="email"
            error={errors.email?.message}
            required
          />
          
          <Input
            {...register('password')}
            label="Password"
            type="password"
            error={errors.password?.message}
            required
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            isLoading={isSubmitting}
            className="w-full"
          >
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Loading State

```tsx
import { Loader } from '@components/common/Loader'
import { Card } from '@components/common/Card'

function DataDisplay({ isLoading, data }) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <Loader size="lg" text="Loading data..." />
      </Card>
    )
  }

  return (
    <Card>
      {/* Display data */}
    </Card>
  )
}
```

### Card Grid

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@components/common/Card'

function TourGrid({ tours }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map(tour => (
        <Card key={tour.id} className="hover-lift cursor-pointer">
          <CardHeader>
            <CardTitle>{tour.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{tour.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

---

## 🎨 Styling Guidelines

### Using Tailwind Classes

```tsx
// ✅ Good - Use Tailwind utilities
<Button className="w-full mt-4">
  Full Width Button
</Button>

// ✅ Good - Combine with custom classes
<Card className="hover-lift gradient-primary">
  Special Card
</Card>

// ❌ Avoid - Inline styles
<Button style={{ width: '100%' }}>
  Button
</Button>
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Heading
</h1>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Content
</div>
```

### Dark Mode

```tsx
// Automatic dark mode support
<Card className="bg-white dark:bg-gray-800">
  <p className="text-gray-900 dark:text-gray-100">
    Text adapts to theme
  </p>
</Card>
```

---

## ♿ Accessibility

### Keyboard Navigation

All components support:
- **Tab** - Navigate between elements
- **Enter/Space** - Activate buttons
- **Escape** - Close modals/dropdowns

### Screen Readers

All components include:
- Semantic HTML
- ARIA labels
- Role attributes
- Error announcements

### Focus Management

```tsx
// Visible focus rings
<Button className="focus-visible:ring-2 focus-visible:ring-primary">
  Accessible Button
</Button>

// Focus trap in modals
<Modal>
  {/* Focus stays within modal */}
</Modal>
```

---

## 🧪 Testing

### Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@components/common/Button'

test('renders button with text', () => {
  render(<Button>Click Me</Button>)
  expect(screen.getByText('Click Me')).toBeInTheDocument()
})

test('shows loading state', () => {
  render(<Button isLoading>Submit</Button>)
  expect(screen.getByRole('button')).toBeDisabled()
})
```

---

## 📚 Best Practices

1. **Always use TypeScript types**
2. **Include ARIA attributes**
3. **Support keyboard navigation**
4. **Test on multiple devices**
5. **Follow design system colors**
6. **Use semantic HTML**
7. **Handle loading/error states**
8. **Make components reusable**
9. **Document props and usage**
10. **Test accessibility**

---

## 🔄 Component Lifecycle

### Creating New Components

1. Create folder in `src/components/common/`
2. Create `ComponentName.tsx`
3. Define TypeScript interface
4. Implement component
5. Add accessibility features
6. Create `index.ts` for exports
7. Document in this file
8. Write tests
9. Use in features

### Example Structure

```
src/components/common/
└── MyComponent/
    ├── MyComponent.tsx
    ├── MyComponent.test.tsx
    └── index.ts
```

---

**All components are production-ready and fully tested! 🎉**
