# 🎨 EthioAI Design System

## Overview

A professional, scalable design system inspired by Ethiopian culture and colors, built for the EthioAI Tourism Platform.

## 🌈 Color Palette

### Primary - Ethiopian Gold/Orange
Represents warmth, hospitality, and the Ethiopian sun.

```
primary-50:  #fef7ee
primary-100: #fdecd3
primary-200: #fad6a5
primary-300: #f7b96d
primary-400: #f39133
primary-500: #f0730c  ← Main
primary-600: #e15607
primary-700: #ba3f09
primary-800: #94320e
primary-900: #782b0f
```

**Usage:**
- Primary buttons
- Call-to-action elements
- Important highlights
- Brand elements

### Secondary - Ethiopian Green
Represents nature, growth, and Ethiopian landscapes.

```
secondary-50:  #f0fdf4
secondary-100: #dcfce7
secondary-200: #bbf7d0
secondary-300: #86efac
secondary-400: #4ade80
secondary-500: #22c55e  ← Main
secondary-600: #16a34a
secondary-700: #15803d
secondary-800: #166534
secondary-900: #14532d
```

**Usage:**
- Success states
- Positive actions
- Nature-related content
- Secondary buttons

### Accent - Ethiopian Red
Represents passion, energy, and Ethiopian flag.

```
accent-50:  #fef2f2
accent-100: #fee2e2
accent-200: #fecaca
accent-300: #fca5a5
accent-400: #f87171
accent-500: #ef4444  ← Main
accent-600: #dc2626
accent-700: #b91c1c
accent-800: #991b1b
accent-900: #7f1d1d
```

**Usage:**
- Error states
- Destructive actions
- Important warnings
- Accent elements

### Neutral - Grays
For text, backgrounds, and UI elements.

```
neutral-50:  #fafafa
neutral-100: #f5f5f5
neutral-200: #e5e5e5
neutral-300: #d4d4d4
neutral-400: #a3a3a3
neutral-500: #737373
neutral-600: #525252
neutral-700: #404040
neutral-800: #262626
neutral-900: #171717
```

## 🔤 Typography

### Font Family
- **Primary:** Inter
- **Display:** Inter
- **Fallback:** system-ui, sans-serif

### Font Sizes

| Size | Value | Line Height | Usage |
|------|-------|-------------|-------|
| xs | 0.75rem | 1rem | Small labels, captions |
| sm | 0.875rem | 1.25rem | Secondary text |
| base | 1rem | 1.5rem | Body text |
| lg | 1.125rem | 1.75rem | Large body text |
| xl | 1.25rem | 1.75rem | Small headings |
| 2xl | 1.5rem | 2rem | H4 |
| 3xl | 1.875rem | 2.25rem | H3 |
| 4xl | 2.25rem | 2.5rem | H2 |
| 5xl | 3rem | 1 | H1 |

### Font Weights
- **Regular:** 400
- **Medium:** 500
- **Semibold:** 600
- **Bold:** 700

## 📦 Components

### Button

**Variants:**
- `primary` - Main actions (orange gradient)
- `secondary` - Secondary actions (green)
- `outline` - Tertiary actions
- `ghost` - Minimal actions
- `destructive` - Delete/remove actions (red)

**Sizes:**
- `sm` - Small (h-9, px-3)
- `md` - Medium (h-10, px-4) ← Default
- `lg` - Large (h-11, px-8)

**States:**
- Default
- Hover (lift effect)
- Focus (ring)
- Active
- Disabled (50% opacity)
- Loading (spinner)

**Example:**
```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

### Input

**Features:**
- Label support
- Error messages
- Helper text
- Required indicator
- Disabled state
- Focus ring
- ARIA attributes

**Example:**
```tsx
<Input
  label="Email"
  type="email"
  error="Invalid email"
  required
/>
```

### Card

**Variants:**
- `default` - Standard card
- `elevated` - With shadow

**Sub-components:**
- `CardHeader` - Top section
- `CardTitle` - Heading
- `CardDescription` - Subtitle
- `CardContent` - Main content
- `CardFooter` - Bottom section

**Example:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Loader

**Sizes:**
- `sm` - 16px
- `md` - 32px ← Default
- `lg` - 48px

**Features:**
- Animated spinner
- Optional text
- ARIA attributes
- Accessible

**Example:**
```tsx
<Loader size="md" text="Loading..." />
```

## 🎭 Effects

### Shadows

```css
sm:      0 1px 2px 0 rgb(0 0 0 / 0.05)
default: 0 1px 3px 0 rgb(0 0 0 / 0.1)
md:      0 4px 6px -1px rgb(0 0 0 / 0.1)
lg:      0 10px 15px -3px rgb(0 0 0 / 0.1)
xl:      0 20px 25px -5px rgb(0 0 0 / 0.1)
2xl:     0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### Border Radius

```css
sm: calc(var(--radius) - 4px)  // 4px
md: calc(var(--radius) - 2px)  // 6px
lg: var(--radius)               // 8px
```

### Gradients

**Primary Gradient:**
```css
.gradient-primary {
  background: linear-gradient(to right, #f0730c, #e15607);
}
```

**Ethiopian Gradient:**
```css
.gradient-ethiopian {
  background: linear-gradient(to bottom right, #f0730c, #22c55e, #ef4444);
}
```

**Text Gradient:**
```css
.text-gradient-ethiopian {
  background: linear-gradient(to right, #f0730c, #22c55e, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

## 🎬 Animations

### Fade
- `fade-in` - 0.3s ease-out
- `fade-out` - 0.3s ease-out

### Slide
- `slide-in-from-top`
- `slide-in-from-bottom`
- `slide-in-from-left`
- `slide-in-from-right`

### Pulse
- `pulse-slow` - 3s infinite

### Hover Effects

**Lift:**
```css
.hover-lift {
  transition: transform 0.2s;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

**Glow:**
```css
.hover-glow:hover {
  box-shadow: 0 20px 25px -5px rgba(240, 115, 12, 0.5);
}
```

## 📐 Spacing

Uses Tailwind's default spacing scale (4px base):

```
0:   0px
1:   4px
2:   8px
3:   12px
4:   16px
5:   20px
6:   24px
8:   32px
10:  40px
12:  48px
16:  64px
20:  80px
24:  96px
```

## 📱 Breakpoints

```
sm:  640px   // Mobile landscape
md:  768px   // Tablet
lg:  1024px  // Desktop
xl:  1280px  // Large desktop
2xl: 1536px  // Extra large
```

## ♿ Accessibility

### Focus States
All interactive elements have visible focus rings:
```css
focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
```

### ARIA Labels
All components include proper ARIA attributes:
- `aria-label`
- `aria-describedby`
- `aria-invalid`
- `role`

### Keyboard Navigation
- Tab order preserved
- Enter/Space for activation
- Escape for dismissal

### Color Contrast
All text meets WCAG AA standards:
- Normal text: 4.5:1
- Large text: 3:1

## 🎨 Usage Examples

### Hero Section
```tsx
<div className="gradient-ethiopian text-white p-12">
  <h1 className="text-5xl font-bold mb-4">
    Discover Ethiopia
  </h1>
  <p className="text-xl">
    Your AI-powered tourism companion
  </p>
</div>
```

### Card with Hover Effect
```tsx
<Card className="hover-lift cursor-pointer">
  <CardHeader>
    <CardTitle>Tour Package</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Explore the historic sites...</p>
  </CardContent>
</Card>
```

### Gradient Text
```tsx
<h2 className="text-4xl font-bold text-gradient-ethiopian">
  Welcome to Ethiopia
</h2>
```

### Glass Card
```tsx
<div className="glass p-6 rounded-lg">
  <h3>Featured Destination</h3>
  <p>Lalibela Rock Churches</p>
</div>
```

## 🔧 Customization

### Adding New Colors
Edit `tailwind.config.js`:
```js
colors: {
  custom: {
    500: '#your-color',
  }
}
```

### Adding New Components
1. Create in `src/components/common/`
2. Follow existing patterns
3. Include TypeScript types
4. Add accessibility features
5. Document in this file

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Ethiopian Flag Colors](https://en.wikipedia.org/wiki/Flag_of_Ethiopia)

## 🎯 Best Practices

1. **Consistency** - Use design tokens, not hardcoded values
2. **Accessibility** - Always include ARIA labels and focus states
3. **Performance** - Use CSS variables for theme switching
4. **Scalability** - Build reusable components
5. **Documentation** - Document all custom components
6. **Testing** - Test on multiple devices and browsers
7. **Responsiveness** - Mobile-first approach
8. **Dark Mode** - Support both light and dark themes

---

**Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Maintained by:** EthioAI Team
