# 🇪🇹 EthioAI Tourism Platform

A modern, AI-powered tourism platform for Ethiopia featuring multilingual chat, tour booking, and integrated payment processing.

## 📁 Project Structure

```
EthioAI/
├── client/                 # Frontend React application
│   ├── src/               # React source code
│   ├── public/            # Static assets
│   ├── docs/              # Frontend documentation
│   └── package.json       # Frontend dependencies
├── server/                 # Backend Node.js application
│   ├── src/               # Server source code
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   └── package.json       # Backend dependencies
└── README.md              # This file
```

## 🚀 Getting Started

### Frontend (Client)
```bash
cd client
npm install
npm run dev
```

### Backend (Server)
```bash
cd server
npm install
npm run dev
```

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
- **Local**: Chapa (Ethiopian payment gateway)

### 🗺️ Interactive Maps
- Mapbox integration for location visualization
- Tour route mapping
- Point of interest markers

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **i18next** for internationalization

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** for database
- **JWT** for authentication
- **Stripe & Chapa** for payments

## 📖 Documentation

Detailed documentation can be found in the `client/docs/` folder:

- [Project Structure](client/docs/PROJECT_STRUCTURE.md)
- [API Documentation](server/README.md)
- [Feature Specifications](client/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.