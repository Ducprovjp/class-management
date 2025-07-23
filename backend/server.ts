import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import connectDatabase from './config/Database';
import classController from './controller/classController';
import classRegistrationController from './controller/classRegistrationController';
import parentController from './controller/parentController';
import studentController from './controller/studentController';
import subscriptionController from './controller/subscriptionController';
import userController from './controller/userController';
import { AppErrorResponse } from './types/errors';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.REACT_APP_FRONT_END_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

connectDatabase();

app.use('/api/parent', parentController);
app.use('/api/student', studentController);
app.use('/api/class', classController);
app.use('/api/class-registration', classRegistrationController);
app.use('/api/subscription', subscriptionController);
app.use('/api/user', userController);

// Middleware lỗi toàn cục
app.use((error: any, req: Request, res: Response<AppErrorResponse>, next: NextFunction) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: error.message || 'Server error',
    statusCode,
  });
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.REACT_APP_BACKEND_URL}`);
});

process.on('uncaughtException', (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server for handling UNCAUGHT EXCEPTION!');
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log('Shutting down the server for unhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});