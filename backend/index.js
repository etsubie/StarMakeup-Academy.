import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './src/config/dbConnect.js';
import roleRoute from './src/routes/roleRoute.js';
import authRouter from './src/routes/authRoute.js';
import cookieParser from 'cookie-parser';
import userRoute from './src/routes/userRoute.js';
import permissionRoute from './src/routes/permissionRoute.js';

dotenv.config();

dbConnect();

const app = express();
const port = process.env.PORT;

// Middleware to parse cookies
app.use(cookieParser());  // Add this line before any routes
app.use(express.json());
app.use('/api', authRouter);
app.use('/api/roles', roleRoute);
app.use('/api/permissions', permissionRoute);
app.use('/api/users', userRoute);

app.listen(port, () => { 
    console.log(`Server is running on port: ${port}`);
});
