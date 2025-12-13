# 🇪🇹 EthioAI Tourism Platform

A modern, AI-powered tourism platform for Ethiopia featuring multilingual chat, tour booking, and integrated payment processing.

## ✨ Features

### 🤖 AI-Powered Chat
- Multilingual support (English, Amharic, Oromo)
- Intelligent tour recommendations
- Real-time voice input and responses
- Rich message types (tours, locations, itineraries)

### 🎫 Tour Booking System
- Interactive tour discovery
- Real-time availability checking
- Multi-step booking process
- Waitlist functionality for popular tours

### 💳 Payment Integration
- **International**: Stripe (Credit/Debit cards)
- **Local Ethiopian**: Chapa (Telebirr, CBE Birr, Bank transfers)
- **Direct**: Telebirr integration with QR codes
- Secure PCI DSS compliant processing

### 🗺️ Interactive Maps
- Mapbox integration for tour locations
- Route visualization and meeting points
- Location-based recommendations

### 🌍 Internationalization
- Full i18n support with react-i18next
- Dynamic language switching
- Localized content and currency

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Fikre-M/EthioAI.git
cd EthioAI/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# Payment Gateways
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_CHAPA_PUBLIC_KEY=CHAPA_...

# Map Services
VITE_MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# AI Services
VITE_OPENAI_API_KEY=sk-...
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Maps**: Mapbox GL JS
- **Payments**: Stripe + Chapa APIs
- **i18n**: react-i18next

### Project Structure
```
frontend/
├── src/
│   ├── features/           # Feature-based modules
│   │   ├── auth/          # Authentication
│   │   ├── booking/       # Tour booking
│   │   ├── chat/          # AI chat interface
│   │   ├── cultural/      # Cultural content
│   │   ├── itinerary/     # Trip planning
│   │   ├── marketplace/   # Product marketplace
│   │   ├── payment/       # Payment processing
│   │   ├── reviews/       # Social reviews
│   │   └── transport/     # Transportation
│   ├── components/        # Reusable UI components
│   ├── services/          # API integrations
│   ├── store/            # Redux state management
│   └── utils/            # Utility functions
├── public/               # Static assets
└── package.json         # Dependencies and scripts
```

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Code Quality
- ESLint + Prettier for code formatting
- TypeScript strict mode
- Husky pre-commit hooks
- Conventional commit messages

### Testing
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## 🔧 Configuration

### Payment Gateways

#### Stripe Setup
1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get publishable key from dashboard
3. Add to `.env` as `VITE_STRIPE_PUBLIC_KEY`

#### Chapa Setup
1. Register at [chapa.co](https://chapa.co)
2. Get API keys from dashboard
3. Add to `.env` as `VITE_CHAPA_PUBLIC_KEY`

### Map Integration
1. Create Mapbox account at [mapbox.com](https://mapbox.com)
2. Generate access token
3. Add to `.env` as `VITE_MAPBOX_ACCESS_TOKEN`

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

### Environment Setup
- Configure production API endpoints
- Set up SSL certificates
- Configure payment gateway webhooks
- Set up monitoring and logging

### Deployment Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS**: Full cloud deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Coding Standards
- Follow TypeScript best practices
- Use functional components with hooks
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ethiopian tourism industry partners
- Open source community
- AI and machine learning researchers
- Beta testers and early adopters

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/Fikre-M/EthioAI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Fikre-M/EthioAI/discussions)
- **Email**: support@ethioai.com

---

**Built with ❤️ for Ethiopian Tourism**