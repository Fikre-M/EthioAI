import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { redisClient } from "@/config/redis";

let mongod: MongoMemoryServer;

// Increase timeout for setup
jest.setTimeout(30000);

// Mock Redis
jest.mock("@/config/redis", () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    incr: jest.fn(),
    lrange: jest.fn(),
    expire: jest.fn(),
  },
}));

// Mock email service
jest.mock("@/services/EmailService", () => ({
  EmailService: {
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
    sendAppointmentConfirmation: jest.fn().mockResolvedValue(true),
    sendCancellationNotification: jest.fn().mockResolvedValue(true),
    sendRescheduleNotification: jest.fn().mockResolvedValue(true),
  },
}));

// Mock notification service
jest.mock("@/services/NotificationService", () => ({
  NotificationService: {
    sendAppointmentConfirmation: jest.fn().mockResolvedValue(true),
    sendCancellationNotification: jest.fn().mockResolvedValue(true),
    sendRescheduleNotification: jest.fn().mockResolvedValue(true),
    sendReminder: jest.fn().mockResolvedValue(true),
  },
}));

// Setup before all tests
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Clear all data after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  jest.clearAllMocks();
});

// Close connections after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
