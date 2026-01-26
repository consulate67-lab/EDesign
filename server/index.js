import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDb } from './db.js';

const app = express();
const PORT = 3002;
const SECRET_KEY = 'super-secret-key-dev-only';

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

let db;

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Start Server
initDb().then(_db => {
    db = _db;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
    const { username, password, full_name, company_name, phone_number } = req.body;

    if (!username || !password || !full_name || !company_name) {
        return res.status(400).json({ error: 'Lütfen tüm zorunlu alanları doldurunuz (E-posta, Şifre, Ad Soyad, Firma)' });
    }

    try {
        // Öncelikli kontrol: Kullanıcı zaten var mı?
        const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser) {
            return res.status(400).json({ error: 'Bu e-posta adresi zaten kayıtlı.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.run(
            'INSERT INTO users (username, password, full_name, company_name, phone_number) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, full_name, company_name, phone_number]
        );

        res.json({ message: 'User created', userId: result.lastID });
    } catch (e) {
        console.error("Kayıt Hatası:", e);
        if (e.message.includes('UNIQUE constraint') || e.message.includes('already exists')) {
            return res.status(400).json({ error: 'Bu e-posta adresi zaten kayıtlı.' });
        }
        res.status(500).json({ error: e.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
        if (!user) return res.status(400).json({ error: 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.' });

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY);
        res.json({ token, user: { id: user.id, username: user.username, role: user.role, credits: user.credits } });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Get User Info (Credits)
app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT id, username, role, credits, free_design_used, full_name, company_name, phone_number FROM users WHERE id = ?', [req.user.id]);
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Mock Payment (Add Credits) - Commission based logic placeholder
// In real world, this would be a webhook from Stripe/Iyzico
app.post('/api/payment/mock', authenticateToken, async (req, res) => {
    const { amount } = req.body;
    let creditsToAdd = 0;

    if (amount === 2500) creditsToAdd = 10;
    else if (amount === 10000) creditsToAdd = 50;
    else if (amount === 15000) creditsToAdd = 100;
    else creditsToAdd = Math.floor(amount / 250); // Fallover

    try {
        await db.run('UPDATE users SET credits = credits + ? WHERE id = ?', [creditsToAdd, req.user.id]);
        const updatedUser = await db.get('SELECT credits FROM users WHERE id = ?', [req.user.id]);
        res.json({ success: true, credits: updatedUser.credits });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Consume Credit (Design Save/Export)
app.post('/api/design/consume-credit', authenticateToken, async (req, res) => {
    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?', [req.user.id]);

        if (user.role === 'admin') {
            return res.json({ success: true, message: 'Admin bypass', credits: user.credits });
        }

        if (!user.free_design_used) {
            // Use free trial
            await db.run('UPDATE users SET free_design_used = 1 WHERE id = ?', [req.user.id]);
            return res.json({ success: true, message: 'Free trial used', credits: user.credits });
        }

        if (user.credits > 0) {
            await db.run('UPDATE users SET credits = credits - 1 WHERE id = ?', [req.user.id]);
            const updated = await db.get('SELECT credits FROM users WHERE id = ?', [req.user.id]);
            return res.json({ success: true, message: 'Credit consumed', credits: updated.credits });
        }

        res.status(403).json({ error: 'İşlem için yeterli krediniz bulunmamaktadır.', paymentRequired: true });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Admin: Make me rich
app.post('/api/admin/add-credits', authenticateToken, async (req, res) => {
    // Determine admin by simple check or strictly via DB role. 
    // To allow "self-promotion" for dev environment:
    // Any logged in user can call this in DEV mode.
    try {
        await db.run('UPDATE users SET credits = credits + 1000 WHERE id = ?', [req.user.id]);
        res.json({ success: true, message: 'Dev credits added' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
