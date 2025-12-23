import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3001',
  credentials: true,
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'EthioAI Tourism Server is running',
    timestamp: new Date().toISOString()
  })
})

// Mock authentication endpoints for development
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Mock validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // Mock user authentication (for development only)
    if (email === 'demo@example.com' && password === 'Demo123!') {
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: null,
        role: 'user',
        emailVerified: true,
        createdAt: new Date().toISOString(),
      }

      const mockToken = 'mock-jwt-token-' + Date.now()

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: mockUser,
        token: mockToken,
      })
    }

    // Invalid credentials
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    // Mock validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      })
    }

    // Check if user already exists (mock)
    if (email === 'demo@example.com') {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      })
    }

    // Mock user creation
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      avatar: null,
      role: 'user',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    }

    const mockToken = 'mock-jwt-token-' + Date.now()

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: mockUser,
      token: mockToken,
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

app.get('/api/auth/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      })
    }

    // Mock user data (in real app, verify JWT and get user from DB)
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      avatar: null,
      role: 'user',
      emailVerified: true,
      createdAt: new Date().toISOString(),
    }

    return res.status(200).json(mockUser)

  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

app.post('/api/auth/logout', async (req: Request, res: Response) => {
  try {
    // In a real app, you might invalidate the token here
    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    // Mock password reset (in real app, send email)
    return res.status(200).json({
      success: true,
      message: 'Password reset instructions sent to your email'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', error)
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EthioAI Tourism Server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/*`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app