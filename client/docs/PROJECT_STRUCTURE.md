# EthioAI Tourism Platform - Project Structure

## 📁 Directory Structure

```
EthioAI/
├── .ai/                          # AI specifications and Kiro configs
│   └── specs/
│       └── payment-gateway/      # Payment feature specifications
├── .git/                         # Git repository data
├── .vscode/                      # VS Code settings
├── docs/                         # Project documentation
├── public/                       # Static assets
│   └── locales/                  # Translation files
├── src/                          # Source code
│   ├── api/                      # API configuration
│   ├── components/               # Reusable UI components
│   │   ├── common/               # Generic components
│   │   ├── layout/               # Layout components
│   │   └── map/                  # Map-related components
│   ├── features/                 # Feature-based modules
│   │   ├── auth/                 # Authentication
│   │   ├── booking/              # Tour booking
│   │   ├── chat/                 # AI chat interface
│   │   ├── dashboard/            # Dashboard/home
│   │   ├── payment/              # Payment processing
│   │   ├── tours/                # Tour management
│   │   └── user/                 # User management
│   ├── hooks/                    # Custom React hooks
│   ├── routes/                   # Routing configuration
│   ├── services/                 # External service integrations
│   ├── store/                    # Redux state management
│   ├── styles/                   # Global styles
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
├── node_modules/                 # Dependencies (gitignored)
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── package.json                  # Project dependencies
├── README.md                     # Project overview
├── tailwind.config.js            # Tailwind CSS config
├── tsconfig.json                 # TypeScript config
└── vite.config.ts                # Vite build config
```

## 🎯 Key Principles

### 1. **No Duplication**
- Single source of truth for all code and assets
- Consolidated node_modules in project root
- Documentation organized in `docs/` folder
- Specifications in `.ai/specs/` for AI-driven development

### 2. **Feature-Based Architecture**
- Each feature is self-contained in `src/features/`
- Components, pages, hooks, and types organized by feature
- Clear separation of concerns

### 3. **Clean Git History**
- Meaningful commit messages
- No duplicate files in version control
- Proper .gitignore to prevent unnecessary files

### 4. **TypeScript First**
- Strong typing throughout the application
- Shared types in `src/types/`
- Proper interface definitions

## 🚀 Development Workflow

### Adding New Features
1. Create feature folder in `src/features/`
2. Add specifications in `.ai/specs/` if using AI assistance
3. Implement components, pages, and services
4. Add tests and documentation
5. Update routing and exports

### Avoiding Duplications
1. Check existing components before creating new ones
2. Use shared utilities and types
3. Follow the established folder structure
4. Regular cleanup of unused files

## 📋 Quality Standards

### Code Quality
- ESLint and Prettier for code formatting
- TypeScript strict mode enabled
- Component and function documentation
- Consistent naming conventions

### Project Quality
- No duplicate dependencies
- Clean folder structure
- Proper environment configuration
- Regular dependency updates

## 🔧 Build and Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Setup
- Copy `.env.example` to `.env`
- Configure API keys and endpoints
- Set up payment gateway credentials

## 📚 Documentation Standards

### Code Documentation
- JSDoc comments for functions and components
- README files for complex features
- Inline comments for business logic

### Project Documentation
- Keep documentation in `docs/` folder
- Update documentation with feature changes
- Include setup and deployment guides

## 🛡️ Security Considerations

### Payment Security
- PCI DSS compliance for payment processing
- Secure API key management
- Input validation and sanitization

### Data Protection
- Environment variable security
- Secure authentication flows
- HTTPS enforcement in production

---

**Last Updated:** December 2025  
**Maintained By:** EthioAI Development Team