# 🇪🇹 EthioAI - Ethiopian Tourism Platform

An AI-powered tourism platform for Ethiopia featuring intelligent chat assistance, multi-language support, and rich interactive experiences.

## 🌟 Features

### ✅ Completed Features (Weeks 1-5)

#### Week 1-2: Foundation & Authentication
- ✅ Modern React + TypeScript setup
- ✅ Tailwind CSS styling with Ethiopian theme
- ✅ Redux Toolkit state management
- ✅ Authentication system (Login, Register, Profile)
- ✅ Protected routes and navigation
- ✅ Responsive layout (Header, Sidebar, Footer)

#### Week 3: AI Chat Interface
- ✅ Real-time chat with AI assistant
- ✅ Markdown support for rich text
- ✅ Typing indicators and animations
- ✅ Suggested questions
- ✅ Message history
- ✅ Error handling

#### Week 4: Voice Features
- ✅ Voice input (Speech-to-Text)
- ✅ Voice output (Text-to-Speech)
- ✅ Multi-language voice support
- ✅ Animated microphone button
- ✅ Stop/pause controls

#### Week 5: Advanced Chat Features
- ✅ **Multi-Language Support**
  - 6 languages: English, Amharic (አማርኛ), Afaan Oromoo, Tigrinya (ትግርኛ), Somali (Soomaali), Arabic (العربية)
  - Automatic language detection
  - Translation service integration
  - Language selector dropdown

- ✅ **Quick Action Buttons**
  - Plan my trip
  - Find tours
  - Cultural info
  - Emergency help

- ✅ **Chat History Sidebar**
  - List of previous conversations
  - Real-time search
  - Delete with confirmation
  - Slide-in animation

- ✅ **Rich Message Cards**
  - Image messages with captions
  - Tour card previews with pricing
  - Location sharing with maps
  - Itinerary previews with timelines

- ✅ **Tour Discovery & Search**
  - Advanced search with debouncing
  - Multi-criteria filtering (price, duration, difficulty, dates)
  - Sort options (price, rating, duration, popularity)
  - Date range picker for tour dates
  - Price range slider
  - Enhanced tour cards with ratings and reviews
  - Responsive tour grid layout
  - Tour detail pages

### 🚧 Upcoming Features (Weeks 6-8)
- Backend API integration
- Real AI model integration
- Tour booking system
- Payment integration
- User reviews and ratings
- Admin dashboard

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Build Tool:** Vite
- **UI Components:** Custom components
- **Internationalization:** i18next
- **Markdown:** React Markdown
- **Voice:** Web Speech API

### Backend (Coming Soon)
- Node.js + Express / Python + FastAPI
- PostgreSQL / MongoDB
- OpenAI API / Custom AI Model
- JWT Authentication
- File Upload (AWS S3)

## 📁 Project Structure

```
EthioAI/
├── frontend/
│   ├── src/
│   │   ├── api/              # API configuration
│   │   ├── components/       # Reusable components
│   │   │   ├── common/       # Button, Input, Card, etc.
│   │   │   └── layout/       # Header, Sidebar, Footer
│   │   ├── features/         # Feature modules
│   │   │   ├── auth/         # Authentication
│   │   │   ├── chat/         # AI Chat
│   │   │   ├── dashboard/    # Dashboard
│   │   │   └── tours/        # Tour Discovery & Search
│   │   ├── hooks/            # Custom hooks
│   │   ├── routes/           # Route configuration
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store
│   │   ├── styles/           # Global styles
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── public/
│   │   └── locales/          # Translation files
│   └── package.json
├── backend/                  # Coming soon
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/EthioAI.git
cd EthioAI
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 📖 Documentation

Detailed documentation for each feature:

- [Setup Guide](frontend/SETUP.md)
- [Quick Reference](frontend/QUICK_REFERENCE.md)
- [Week 3: Chat Features](frontend/WEEK3_CHAT_COMPLETE.md)
- [Week 4: Voice Features](frontend/WEEK4_VOICE_COMPLETE.md)
- [Week 5: Advanced Chat](frontend/WEEK5_ADVANCED_CHAT_COMPLETE.md)
- [Week 5: Tour Discovery](frontend/WEEK5_TOUR_DISCOVERY_COMPLETE.md)
- [Multi-Language Support](frontend/MULTILINGUAL_CHAT_COMPLETE.md)
- [Rich Messages](frontend/RICH_MESSAGES_COMPLETE.md)
- [Tour Search & Filters](frontend/TOUR_SEARCH_FILTERS_COMPLETE.md)
- [API Requirements](frontend/API_REQUIREMENTS.md)

## 🌍 Supported Languages

- 🇬🇧 English
- 🇪🇹 Amharic (አማርኛ)
- 🇪🇹 Afaan Oromoo
- 🇪🇹 Tigrinya (ትግርኛ)
- 🇸🇴 Somali (Soomaali)
- 🇸🇦 Arabic (العربية)

## 🎨 Design System

### Colors
- **Primary:** Orange (#F97316) - Ethiopian flag inspired
- **Secondary:** Green (#10B981) - Ethiopian flag inspired
- **Accent:** Yellow (#FCD34D) - Ethiopian flag inspired
- **Text:** Gray scale for light/dark modes

### Typography
- **Font:** Inter (system font fallback)
- **Sizes:** Responsive scale from xs to 4xl

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📦 Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer:** Fikre
- **Project:** EthioAI Tourism Platform
- **Year:** 2025

## 🙏 Acknowledgments

- Ethiopian tourism industry
- Open source community
- All contributors

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for Ethiopia 🇪🇹**
