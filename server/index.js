const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection management
let db;
const { ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    try {
        if (!db) {
            await client.connect();
            db = client.db('sudur');
            console.log("Connected to MongoDB via middleware");
        }
        next();
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        res.status(500).json({ message: "Database connection failed" });
    }
});

// Local server startup
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

// Email Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        await transporter.sendMail({ from: `"Youth Association Of Purbichauki" <${process.env.GMAIL_USER}>`, to, subject, text, html });
    } catch (error) {
        console.error("Email failed:", error);
    }
};

// ====================== ROUTES ========================
app.post('/api/login', async (req, res) => {
    const { email, password, isFirebase } = req.body;

    if (isFirebase === "true") {
        try {
            // Find or Create user in database
            let user = await db.collection("users").findOne({ email: email.toLowerCase() });
            if (!user) {
                const result = await db.collection("users").insertOne({
                    email: email.toLowerCase(),
                    name: email.split('@')[0],
                    role: "user",
                    authProvider: "firebase_google",
                    createdAt: new Date()
                });
                user = await db.collection("users").findOne({ _id: result.insertedId });
            }
            return res.json({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            });
        } catch (err) {
            console.error("Firebase Sync Error:", err);
            return res.status(500).json({ message: "Database error during login" });
        }
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin@2000";

    if (email === adminEmail && password === adminPassword) {
        return res.json({
            id: "admin-id",
            name: "System Admin",
            email: adminEmail,
            role: "admin"
        });
    }

    res.status(401).json({ message: "Invalid credentials" });
});

// Dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const volunteerCount = await db.collection("volunteers").countDocuments();
        const events = await db.collection("events").find({}).toArray();
        const upcomingEventsCount = events.filter(e => new Date(e.date) >= new Date()).length;
        const userCount = await db.collection("users").countDocuments();

        const recentEvents = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

        const activities = [
            ...recentEvents.map(e => ({ id: e._id.toString(), type: "event", title: "New Event", date: e.createdAt }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

        res.json({ stats: { totalDonations: 0, volunteerCount, upcomingEventsCount, userCount }, recentActivity: activities });
    } catch (e) {
        console.error("Dashboard error:", e);
        res.status(500).json({ message: "Failed" });
    }
});

// Stats
app.get('/api/stats', async (req, res) => {
    try {
        const activeVolunteers = await db.collection("volunteers").countDocuments();
        const eventsCompleted = await db.collection("events").countDocuments({ date: { $lt: new Date() } });

        res.json({
            totalFunds: "Dynamic",
            activeVolunteers: activeVolunteers.toString(),
            eventsCompleted: eventsCompleted.toString(),
            partnerOrgs: "12"
        });
    } catch (e) {
        res.status(500).json({ message: "Failed API" });
    }
});

// Events
app.get('/api/events', async (req, res) => {
    try {
        const events = await db.collection("events").find({}).sort({ date: 1 }).toArray();
        res.json(events);
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.post('/api/events', async (req, res) => {
    try {
        const { title, description, date, location, image } = req.body;
        const result = await db.collection("events").insertOne({ title, description, date: new Date(date), location, image, createdAt: new Date() });
        res.status(201).json({ message: "Event created", id: result.insertedId });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.put('/api/events', async (req, res) => {
    try {
        const { id, _id, date, ...updateData } = req.body;
        await db.collection("events").updateOne({ _id: new ObjectId(id || _id) }, { $set: { ...updateData, date: new Date(date) } });
        res.json({ message: "Event updated" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.delete('/api/events', async (req, res) => {
    try {
        await db.collection("events").deleteOne({ _id: new ObjectId(req.query.id) });
        res.json({ message: "Event deleted" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// Volunteers
app.get('/api/volunteers', async (req, res) => {
    try {
        res.json(await db.collection("volunteers").find({}).toArray());
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.post('/api/volunteers', async (req, res) => {
    try {
        const result = await db.collection("volunteers").insertOne({ ...req.body, createdAt: new Date() });
        res.status(201).json({ message: "Added", id: result.insertedId });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.put('/api/volunteers', async (req, res) => {
    try {
        const { id, _id, ...updateData } = req.body;
        await db.collection("volunteers").updateOne({ _id: new ObjectId(id || _id) }, { $set: updateData });
        res.json({ message: "Updated" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.delete('/api/volunteers', async (req, res) => {
    try {
        await db.collection("volunteers").deleteOne({ _id: new ObjectId(req.query.id) });
        res.json({ message: "Deleted" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// Contact
app.post('/api/contact', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;
        await sendEmail(process.env.ADMIN_EMAIL, "New Contact", `From: ${firstName} ${lastName}\n\n${message}`);
        res.json({ message: "Sent successfully" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// Upload Image to Cloudinary
app.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.image;
        if (!fileStr) {
            return res.status(400).json({ message: "No image provided" });
        }

        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            folder: 'yaop_assets', // Optional: groups uploads into a specific folder
        });

        res.json({ url: uploadResponse.secure_url });
    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        res.status(500).json({ message: "Image upload failed" });
    }
});
// Transparency Stats
app.get('/api/transparency', async (req, res) => {
    try {
        const stats = await db.collection("transparency").findOne({ _id: "current_stats" });
        if (!stats) {
            // Default stats if none exist
            const defaultStats = {
                _id: "current_stats",
                fundsReceived: 224786190,
                kindsReceived: 70382390,
                totalSpent: 191128460,
                totalAmount: 549817120,
                remainingAmount: 6352008,
                updatedAt: new Date()
            };
            await db.collection("transparency").insertOne(defaultStats);
            return res.json(defaultStats);
        }
        res.json(stats);
    } catch (e) {
        res.status(500).json({ message: "Error" });
    }
});

app.post('/api/transparency', async (req, res) => {
    try {
        const { fundsReceived, kindsReceived, totalSpent, totalAmount, remainingAmount } = req.body;
        await db.collection("transparency").updateOne(
            { _id: "current_stats" },
            { 
                $set: { 
                    fundsReceived: parseFloat(fundsReceived), 
                    kindsReceived: parseFloat(kindsReceived), 
                    totalSpent: parseFloat(totalSpent), 
                    totalAmount: parseFloat(totalAmount), 
                    remainingAmount: parseFloat(remainingAmount),
                    updatedAt: new Date()
                } 
            },
            { upsert: true }
        );
        res.json({ message: "Transparency stats updated" });
    } catch (e) {
        res.status(500).json({ message: "Error updating stats" });
    }
});

// END OF ROUTES

app.get('/', (req, res) => {
    res.send('Youth Association Of Purbichauki Backend API is running!');
});

module.exports = app;
