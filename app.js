import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import mainRouter from './src/main';
import { callbackStrategy, loginStrategy, logoutStrategy } from './src/utils/strategy';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: process.env.SESSION_SECRET || 'secret', 
    resave: false, 
    saveUninitialized: true 
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('login', loginStrategy);
passport.use('callback', callbackStrategy);
passport.use('logout', logoutStrategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// CORS configuration
let corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:4200'],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Static files
const staticPath = path.join(__dirname, 'client', 'dist/client/browser');
app.use(express.static(staticPath));

// Routes
app.get('/server', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});

app.use('/api/v1', mainRouter);

app.use((error, req, res, next) => {
    const errorStatus = error.status || 500;
    const errorMessage = error.message || 'Something went Wrong on Server';
    return res.status(errorStatus).json({
        error: true,
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: error.stack
    });
});

app.get('/*', (req, res) => {
    return res.sendFile(path.join(staticPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`|--- Server is Running at PORT: ${PORT} ---|`);
});

export default app;
