const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB tracking
let db;
const { ServerApiVersion } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function startServer() {
    try {
        const connectedClient = await client.connect();
        db = connectedClient.db('sudur');
        console.log("Connected to MongoDB");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}
startServer();

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
        await transporter.sendMail({ from: `"SUDUR" <${process.env.GMAIL_USER}>`, to, subject, text, html });
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
        const donations = await db.collection("donations").find({}).toArray();
        const totalDonations = donations.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const volunteerCount = await db.collection("volunteers").countDocuments();
        const events = await db.collection("events").find({}).toArray();
        const upcomingEventsCount = events.filter(e => new Date(e.date) >= new Date()).length;
        const userCount = await db.collection("users").countDocuments();

        const recentDonations = await db.collection("donations").find({}).sort({ createdAt: -1 }).limit(3).toArray();
        const recentEvents = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

        const activities = [
            ...recentDonations.map(d => ({ id: d._id.toString(), type: "donation", title: "New Donation", date: d.createdAt })),
            ...recentEvents.map(e => ({ id: e._id.toString(), type: "event", title: "New Event", date: e.createdAt }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);

        res.json({ stats: { totalDonations, volunteerCount, upcomingEventsCount, userCount }, recentActivity: activities });
    } catch (e) {
        console.error("Dashboard error:", e);
        res.status(500).json({ message: "Failed" });
    }
});

// Stats
app.get('/api/stats', async (req, res) => {
    try {
        const donations = await db.collection("donations").find({}).toArray();
        const totalFunds = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
        const activeVolunteers = await db.collection("volunteers").countDocuments();
        const eventsCompleted = await db.collection("events").countDocuments({ date: { $lt: new Date() } });

        res.json({
            totalFunds: totalFunds.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
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

// Donations
app.get('/api/donations', async (req, res) => {
    try {
        res.json(await db.collection("donations").find({}).sort({ createdAt: -1 }).toArray());
    } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.get('/api/user/donations', async (req, res) => {
    try {
        res.json(await db.collection("donations").find({ donorEmail: req.query.email }).sort({ createdAt: -1 }).toArray());
    } catch (e) { res.status(500).json({ message: "Error" }); }
});
app.delete('/api/donations', async (req, res) => {
    try {
        await db.collection("donations").deleteOne({ _id: new ObjectId(req.query.id) });
        res.json({ message: "Deleted" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.post('/api/donate', async (req, res) => {
    try {
        const { amount, name, email, purpose, paymentMethod } = req.body;
        const result = await db.collection("donations").insertOne({
            amount: parseFloat(amount), donorName: name, donorEmail: email, purpose, paymentMethod, status: "Completed", createdAt: new Date()
        });

        const receiptText = `Thank you ${name} for donating $${amount}.`;
        await sendEmail(email, "Donation Receipt", receiptText, `<p>${receiptText}</p>`);

        res.status(201).json({ message: "Donation recorded", donationId: result.insertedId });
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

// Upload Fake
app.post('/api/upload', (req, res) => {
    res.json({ url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" });
});
// END OF ROUTES

module.exports = app;
