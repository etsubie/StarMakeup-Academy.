import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './src/config/dbConnect.js';

dotenv.config();

dbConnect();

const app = express();
const port = process.env.PORT;

app.use(express.json());
// app.use('/api', authRouter);
// app.use('/api/roles', roleRoute);
// app.use('/api/permissions', permissionRoute);
// app.use('/api/users', userRoute);

app.listen(port, () => { 
    console.log(`Server is running on port: ${port}`);
});
