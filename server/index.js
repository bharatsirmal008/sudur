const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const { jsPDF } = require("jspdf");
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://yaop.vercel.app',
    'https://sudurapi.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

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
            
            // Infrastructure: Enforce unique email for accounts
            try {
                await db.collection("users").createIndex({ email: 1 }, { unique: true });
                console.log("Unique email index ensured on users collection");
            } catch (indexErr) {
                console.log("Index already exists or failed to create:", indexErr.code);
            }
            
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

// Email Transporter Config
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("[MAIL] SMTP Connection Error. Check GMAIL_USER/PASS or App Password:", error);
    } else {
        console.log("[MAIL] SMTP Server is ready to deliver notifications");
    }
});

const sendEmail = async (to, subject, text, html, attachments = []) => {
    try {
        await transporter.sendMail({ 
            from: `"Youth Association Of Purbichauki" <${process.env.GMAIL_USER}>`, 
            to, 
            subject, 
            text, 
            html,
            attachments
        });
        console.log(`[MAIL] Email sent successfully to ${to}`);
    } catch (error) {
        console.error("[MAIL] Dispatch failed:", error);
    }
};

// PDF Generation Helper for Donations
const generateDonationPDF = (donation) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(22, 163, 74); // #16A34A Primary Green
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Youth Association of Purbichauki", 105, 25, { align: "center" });

    // Title
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(26);
    doc.text("DONATION RECEIPT", 105, 60, { align: "center" });
    
    // Content Block
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Receipt Date: ${dateStr}`, 20, 80);
    doc.text(`Transaction ID: ${donation.transactionId || 'N/A'}`, 140, 80);

    doc.setDrawColor(229, 231, 235);
    doc.line(20, 85, 190, 85);

    // Details Table-like Layout
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.text("Donor Information", 20, 100);
    
    doc.setFontSize(12);
    doc.text(`Full Name: ${donation.fullName || 'N/A'}`, 25, 110);
    doc.text(`Email: ${donation.email || 'N/A'}`, 25, 120);
    doc.text(`Phone: ${donation.phoneNumber || 'N/A'}`, 25, 130);
    doc.text(`Purpose: ${donation.purpose || 'General Support'}`, 25, 140);
    doc.text(`Payment Method: ${donation.paymentMethod || 'N/A'}`, 25, 150);

    // Amount Box
    doc.setFillColor(240, 253, 244);
    doc.rect(20, 165, 170, 30, 'F');
    doc.setTextColor(21, 128, 61);
    doc.setFontSize(20);
    doc.text(`Total Contribution: NPR ${donation.amount || '0'}`, 105, 184, { align: "center" });

    // Footer
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(10);
    doc.text("This is an electronically generated receipt verified by YAOP Administration.", 105, 220, { align: "center" });
    doc.text("Thank you for choosing to make a difference.", 105, 226, { align: "center" });

    // Signature Area
    doc.setDrawColor(209, 213, 219);
    doc.line(130, 260, 180, 260);
    doc.text("Authorized Signature", 155, 268, { align: "center" });

    return Buffer.from(doc.output('arraybuffer'));
};

// Slug Generator
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

// ====================== ROUTES ========================
app.post('/api/login', async (req, res) => {
    const { email, password, isFirebase } = req.body;

    if (isFirebase === "true") {
        try {
            // Find or Create user in database
            let user = await db.collection("users").findOne({ email: email.toLowerCase() });
            const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
            
            // If user exists, but is the admin email, ensure they have admin role
            if (user && user.email.toLowerCase() === adminEmail.toLowerCase() && user.role !== "admin") {
                await db.collection("users").updateOne(
                    { _id: user._id },
                    { $set: { role: "admin" } }
                );
                user.role = "admin";
            }

            if (!user) {
                const role = email.toLowerCase() === adminEmail.toLowerCase() ? "admin" : "supporter";
                const result = await db.collection("users").insertOne({
                    email: email.toLowerCase(),
                    name: email.split('@')[0],
                    role: role,
                    authProvider: "firebase_google",
                    createdAt: new Date()
                });
                user = await db.collection("users").findOne({ _id: result.insertedId });
            }
            return res.json({
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,image: user.image
            });
        } catch (err) {
            console.error("Firebase Sync Error:", err);
            return res.status(500).json({ message: "Database error during login" });
        }
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin@2000";

    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanAdminEmail = adminEmail.toLowerCase().trim();

    if (cleanEmail === cleanAdminEmail && password === adminPassword) {
        try {
            let adminUser = await db.collection("users").findOne({ email: cleanAdminEmail });
            if (!adminUser) {
                const result = await db.collection("users").insertOne({
                    email: cleanAdminEmail,
                    name: "System Admin",
                    role: "admin",
                    authProvider: "credentials",
                    createdAt: new Date()
                });
                adminUser = await db.collection("users").findOne({ _id: result.insertedId });
            } else if (adminUser.role !== "admin") {
                await db.collection("users").updateOne(
                    { _id: adminUser._id },
                    { $set: { role: "admin" } }
                );
                adminUser.role = "admin";
            }
            
            return res.json({
                id: adminUser._id.toString(),
                name: adminUser.name || "System Admin",
                email: adminUser.email,
                role: adminUser.role,
                image: adminUser.image
            });
        } catch (err) {
            console.error("Admin DB Sync Error:", err);
            // Fallback to static id if DB fails
            return res.json({
                id: "admin-id",
                name: "System Admin",
                email: adminEmail,
                role: "admin"
            });
        }
    }

    res.status(401).json({ message: "Invalid credentials" });
});

// Update Profile API
app.put('/api/user/profile', async (req, res) => {
    try {
        const { email, name, image } = req.body;
        if (!email) return res.status(400).json({ message: "Email required for profile update" });
        
        await db.collection("users").updateOne(
            { email: email.toLowerCase() },
            { $set: { name, image } }
        );
        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});

// Dashboard
app.get('/api/dashboard', async (req, res) => {
    try {
        const volunteerCount = await db.collection("volunteers").countDocuments();
        const pendingVolunteerCount = await db.collection("volunteer_applications").countDocuments({ status: 'pending' });
        const events = await db.collection("events").find({}).toArray();
        const upcomingEventsCount = events.filter(e => new Date(e.date) >= new Date()).length;
        const userCount = await db.collection("users").countDocuments();

        const recentEvents = [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
        const recentApps = await db.collection("volunteer_applications").find({ status: 'pending' }).sort({ createdAt: -1 }).limit(3).toArray();

        // Donation stats
        const pendingDonationCount = await db.collection("donations").countDocuments({ status: 'pending' });
        const donationData = await db.collection("donations").find({ status: 'verified' }).toArray();
        const autoTotalDonations = donationData.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
        const finances = await db.collection("finances").findOne({ type: 'summary' }) || {};

        const totalDonations = finances.totalReceived !== undefined ? finances.totalReceived : autoTotalDonations;
        const totalSpent = finances.totalSpent || 0;
        const remainingBalance = finances.remainAmount !== undefined ? finances.remainAmount : (totalDonations - totalSpent);
        const recentDonations = await db.collection("donations").find({}).sort({ createdAt: -1 }).limit(3).toArray();

        const activities = [
            ...recentEvents.map(e => ({ id: e._id.toString(), type: "event", title: "New Event: " + e.title, description: "Scheduled for " + new Date(e.date).toLocaleDateString(), date: e.createdAt })),
            ...recentApps.map(a => ({ id: a._id.toString(), type: "application", title: "New Volunteer App: " + a.name, description: "Pending review", date: a.createdAt })),
            ...recentDonations.map(d => ({ id: d._id.toString(), type: "donation", title: "New Donation: NPR " + d.amount, description: "By " + d.fullName, date: d.createdAt }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

        res.json({ 
            stats: { 
                totalDonations,
                totalSpent,
                remainingBalance,
                pendingDonationCount,
                volunteerCount, 
                pendingVolunteerCount, 
                upcomingEventsCount, 
                userCount 
            }, 
            recentActivity: activities 
        });
    } catch (e) {
        console.error("Dashboard error:", e);
        res.status(500).json({ message: "Failed" });
    }
});

// Financial Overview & Expenditures
app.get('/api/finances', async (req, res) => {
    try {
        let finances = await db.collection("finances").findOne({ type: 'summary' });
        if (!finances) {
            finances = { type: 'summary', totalSpent: 0 };
            await db.collection("finances").insertOne(finances);
        }
        res.json(finances);
    } catch (e) { res.status(500).json({ message: "Failed" }); }
});

app.patch('/api/finances', async (req, res) => {
    try {
        const updateFields = { updatedAt: new Date() };
        if (req.body.totalSpent !== undefined) updateFields.totalSpent = req.body.totalSpent;
        if (req.body.totalReceived !== undefined) updateFields.totalReceived = req.body.totalReceived;
        if (req.body.remainAmount !== undefined) updateFields.remainAmount = req.body.remainAmount;

        await db.collection("finances").updateOne({ type: 'summary' }, { $set: updateFields }, { upsert: true });
        res.json({ message: "Finances updated" });
    } catch (e) { res.status(500).json({ message: "Failed" }); }
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

app.get('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const cleanId = id.trim();
        console.log(`[API] Fetching event with ID/Slug: "${cleanId}"`);
        
        let query;
        if (ObjectId.isValid(cleanId) && cleanId.length === 24) {
            // Support database where _id might be ObjectId OR a raw string
            query = { 
                $or: [
                    { _id: new ObjectId(cleanId) }, 
                    { _id: cleanId },
                    { slug: cleanId.toLowerCase() }
                ] 
            };
        } else {
            // Support case-insensitive slug lookup
            query = { slug: cleanId.toLowerCase() };
        }

        const event = await db.collection("events").findOne(query);
        if (!event) {
            console.warn(`[API] Event not found in DB: "${cleanId}"`);
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (e) {
        console.error("[API] Critical error fetching event:", e);
        res.status(500).json({ message: "Internal server error", error: e.message });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        console.log("[API] Creating event:", req.body.title);
        const { 
            title, description, shortDescription, date, location, image, qrCode,
            registrationLink, activities, impactPoints, organizer, 
            startTime, endTime, terms, criteria, feedbackLink, otherInfo,
            joinButtonText, donateButtonText
        } = req.body;
        
        const slug = generateSlug(title);
        const result = await db.collection("events").insertOne({ 
            title, 
            description, 
            shortDescription,
            date: date ? new Date(date) : new Date(), 
            location, 
            image, 
            qrCode,
            registrationLink, 
            slug,
            activities,
            impactPoints: Array.isArray(impactPoints) ? impactPoints : (impactPoints ? impactPoints.split('\n').filter(p => p.trim()) : []),
            organizer,
            startTime,
            endTime,
            terms,
            criteria,
            feedbackLink,
            otherInfo,
            joinButtonText,
            donateButtonText,
            status: req.body.status || 'scheduled',
            createdAt: new Date() 
        });
        console.log("[API] Event created successfully:", result.insertedId);
        res.status(201).json({ message: "Event created", id: result.insertedId, slug });
    } catch (e) { 
        console.error("[API] Create error:", e);
        res.status(500).json({ message: "Error" }); 
    }
});

app.put('/api/events', async (req, res) => {
    try {
        const { id, _id, date, title, activities, impactPoints, organizer, startTime, endTime, terms, criteria, feedbackLink, otherInfo, status, qrCode, ...updateData } = req.body;
        const updatePayload = { 
            ...updateData, 
            date: new Date(date),
            activities,
            impactPoints: Array.isArray(impactPoints) ? impactPoints : (impactPoints ? impactPoints.split('\n').filter(p => p.trim()) : []),
            organizer,
            startTime,
            endTime,
            terms,
            criteria,
            feedbackLink,
            otherInfo,
            qrCode,
            status: status || 'scheduled'
        };
        if (title) {
            updatePayload.title = title;
            updatePayload.slug = generateSlug(title);
        }
        await db.collection("events").updateOne({ _id: new ObjectId(id || _id) }, { $set: updatePayload });
        res.json({ message: "Event updated" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.delete('/api/events', async (req, res) => {
    try {
        await db.collection("events").deleteOne({ _id: new ObjectId(req.query.id) });
        res.json({ message: "Event deleted" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// Gallery
app.get('/api/gallery', async (req, res) => {
    try {
        const images = await db.collection("gallery").find().sort({ createdAt: -1 }).toArray();
        res.json(images);
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.post('/api/gallery', async (req, res) => {
    try {
        const { url, caption } = req.body;
        const result = await db.collection("gallery").insertOne({ url, caption, createdAt: new Date() });
        res.status(201).json({ message: "Added", id: result.insertedId });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try {
        await db.collection("gallery").deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Deleted" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// Volunteers
app.get('/api/volunteers', async (req, res) => {
    try {
        const isAdmin = req.query.admin === 'true';
        let filter = {};
        
        // Public API only returns members that are visible
        if (!isAdmin) {
            filter = { isVisible: { $ne: false } };
        }
        
        res.json(await db.collection("volunteers").find(filter).toArray());
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

// Volunteer Applications Workflow
app.post('/api/volunteer-applications', async (req, res) => {
    try {
        const application = {
            ...req.body,
            status: 'pending',
            createdAt: new Date()
        };
        const result = await db.collection("volunteer_applications").insertOne(application);
        res.status(201).json({ message: "Application submitted successfully", id: result.insertedId });
    } catch (e) {
        console.error("Application submission error:", e);
        res.status(500).json({ message: "Failed to submit application" });
    }
});

app.get('/api/volunteer-applications', async (req, res) => {
    try {
        const applications = await db.collection("volunteer_applications").find({}).sort({ createdAt: -1 }).toArray();
        res.json(applications);
    } catch (e) { res.status(500).json({ message: "Failed to fetch applications" }); }
});

app.get('/api/volunteer-applications/:id', async (req, res) => {
    try {
        const application = await db.collection("volunteer_applications").findOne({ _id: new ObjectId(req.params.id) });
        if (!application) return res.status(404).json({ message: "Application not found" });
        res.json(application);
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.put('/api/volunteer-applications/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, createdAt, ...updateData } = req.body;
        await db.collection("volunteer_applications").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );
        res.json({ message: "Application updated successfully" });
    } catch (e) {
        console.error("Update error:", e);
        res.status(500).json({ message: "Update failed" });
    }
});

app.patch('/api/volunteer-applications/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`[ADMIN] Approving volunteer application: ${id}`);
        
        const appData = await db.collection("volunteer_applications").findOne({ _id: new ObjectId(id) });
        
        if (!appData) {
            console.error(`[ADMIN] Application not found for ID: ${id}`);
            return res.status(404).json({ message: "Application not found" });
        }

        const volunteerEmail = appData.email || appData.Email;
        if (!volunteerEmail) {
            console.error(`[ADMIN] No email found for application: ${id}`);
            return res.status(400).json({ message: "Cannot approve: Application missing email address" });
        }

        // 1. Update Application Status
        await db.collection("volunteer_applications").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'approved', processedAt: new Date() } }
        );

        // 2. Add to Volunteers (Team) Collection
        const newVolunteer = {
            name: appData.name,
            role: "Volunteer",
            location: appData.temporaryAddress?.split(',')?.pop()?.trim() || "Local",
            image: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
            skills: appData.skills,
            contact: appData.contact,
            email: volunteerEmail,
            socials: {},
            isVisible: true,
            createdAt: new Date()
        };
        await db.collection("volunteers").insertOne(newVolunteer);

        // 3. Send Success Email
        console.log(`[MAIL] Attempting to send approval email to: ${volunteerEmail}`);
        await sendEmail(
            volunteerEmail,
            "Welcome to YAOP - Volunteer Application Approved!",
            `Hi ${appData.name},\n\nCongratulations! Your application to volunteer with Youth Association of Purbichauki has been approved. Welcome to the team!\n\nWe will reach out soon with next steps.`,
            `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
                <h2 style="color: #16a34a;">Welcome to the Team, ${appData.name}!</h2>
                <p>Congratulations! Your application to volunteer with <b>Youth Association of Purbichauki (YAOP)</b> has been approved.</p>
                <p>We are excited to have you on board. Our team will contact you shortly with further details and onboarding materials.</p>
                <div style="margin-top: 30px; padding: 20px; background-color: #f0fdf4; border-radius: 12px; border: 1px solid #dcfce7;">
                    <p style="margin: 0; font-weight: bold; color: #15803d;">Your next steps:</p>
                    <ul style="margin-top: 10px; color: #166534;">
                        <li>Wait for our coordinator to reach out</li>
                        <li>Check your dashboard for upcoming events</li>
                        <li>Spread the word about our mission!</li>
                    </ul>
                </div>
                <br/>
                <p>Best regards,<br/><b>The YAOP Administrative Team</b></p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
                <p style="font-size: 12px; color: #6b7280;">Youth Association of Purbichauki - Connecting Hearts, Building Futures.</p>
            </div>
            `
        );

        res.json({ message: "Application approved successfully, volunteer added to team, and notification email sent." });
    } catch (e) {
        console.error("[ADMIN] Approval error:", e);
        res.status(500).json({ message: "Approval failed", error: e.message });
    }
});

app.patch('/api/volunteer-applications/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        console.log(`[ADMIN] Rejecting volunteer application: ${id}`);
        
        const appData = await db.collection("volunteer_applications").findOne({ _id: new ObjectId(id) });

        if (!appData) {
            console.error(`[ADMIN] Application not found for rejection: ${id}`);
            return res.status(404).json({ message: "Application not found" });
        }

        const volunteerEmail = appData.email || appData.Email;
        if (!volunteerEmail) {
            console.error(`[ADMIN] No email found for rejection application: ${id}`);
            return res.status(400).json({ message: "Application missing email address" });
        }

        await db.collection("volunteer_applications").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'rejected', rejectionReason: reason, processedAt: new Date() } }
        );

        // Send Professional Rejection Email
        console.log(`[MAIL] Attempting to send rejection email to: ${volunteerEmail}`);
        await sendEmail(
            volunteerEmail,
            "Status Update: Volunteer Application - Youth Association of Purbichauki",
            `Hi ${appData.name},\n\nThank you for your interest in volunteering with YAOP. We have reviewed your application and provided feedback.\n\nFeedback: ${reason}`,
            `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.6;">
                <div style="background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px;">
                    <h2 style="color: #0f172a; font-weight: 800; margin-bottom: 24px; text-align: center;">Application Update</h2>
                    <p>Hi <b>${appData.name}</b>,</p>
                    <p>Thank you for your interest in joining the Youth Association of Purbichauki (YAOP). Our team has carefully reviewed your profile.</p>
                    
                    <div style="background-color: #fff1f2; border-left: 4px solid #f43f5e; padding: 24px; margin: 32px 0; border-radius: 8px;">
                        <span style="display: block; font-size: 11px; font-weight: 800; color: #be123e; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Message from our Coordinator</span>
                        <p style="margin: 0; color: #9f1239; font-style: italic;">
                            "${reason || "While we cannot move forward with your profile at this time, we appreciate your interest. Keep improving your community impact and reach out to us again in the future!"}"
                        </p>
                    </div>

                    <p>While we are unable to accept your application for this specific period, we encourage you to stay active in our community programs and follow our updates on social media.</p>
                    <p>We wish you the very best in your future endeavors.</p>
                    
                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 13px;">
                        <p style="margin: 0;"><b>Best regards,</b></p>
                        <p style="margin: 4px 0 0 0; color: #64748b;">The Administrative Team</p>
                        <p style="margin: 0; font-weight: bold; color: #1e293b;">Youth Association of Purbichauki (YAOP)</p>
                    </div>
                </div>
                <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px;">This is an automated notification from our administrative portal.</p>
            </div>
            `
        );

        res.json({ message: "Application rejected successfully and user notified." });
    } catch (e) { 
        console.error("[ADMIN] Rejection error:", e);
        res.status(500).json({ message: "Rejection failed", error: e.message }); 
    }
});

// Donations Workflow
app.post('/api/donations', async (req, res) => {
    try {
        const donation = {
            ...req.body,
            status: 'pending',
            createdAt: new Date()
        };
        const result = await db.collection("donations").insertOne(donation);
        res.status(201).json({ message: "Donation details submitted! We will verify and update our records.", id: result.insertedId });
    } catch (e) {
        console.error("Donation submission error:", e);
        res.status(500).json({ message: "Failed to submit donation" });
    }
});

app.get('/api/donations', async (req, res) => {
    try {
        const { email } = req.query;
        let filter = {};
        if (email) filter.email = email;
        const donations = await db.collection("donations").find(filter).sort({ createdAt: -1 }).toArray();
        res.json(donations);
    } catch (e) { res.status(500).json({ message: "Failed to fetch donations" }); }
});

app.patch('/api/donations/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        console.log(`[ADMIN] Updating donation status for ID: ${id} to ${status}`);
        
        // 1. Fetch current donation for email processing
        const donation = await db.collection("donations").findOne({ _id: new ObjectId(id) });
        if (!donation) return res.status(404).json({ message: "Donation not found" });

        // 2. Perform the update
        const { _id, createdAt, verifiedAt, lastModifiedAt, ...updateData } = req.body;
        const result = await db.collection("donations").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, lastModifiedAt: new Date() } }
        );

        // 3. Trigger Email if verified
        if (status === 'verified' && donation.status !== 'verified') {
            
            // 4. Update Financial Summary Automatically
            const donationData = await db.collection("donations").find({ status: 'verified' }).toArray();
            const newTotalReceived = donationData.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
            
            let finances = await db.collection("finances").findOne({ type: 'summary' });
            if (!finances) finances = { type: 'summary', totalSpent: 0 };
            
            const totalSpent = finances.totalSpent || 0;
            const newRemainAmount = newTotalReceived - totalSpent;

            await db.collection("finances").updateOne(
                { type: 'summary' },
                { 
                    $set: { 
                        totalReceived: newTotalReceived, 
                        remainAmount: newRemainAmount,
                        updatedAt: new Date() 
                    } 
                },
                { upsert: true }
            );

            console.log(`[FINANCE] Summary updated: Total NPR ${newTotalReceived}, Remaining NPR ${newRemainAmount}`);

            const donorEmail = donation.email || donation.Email;
            if (donorEmail) {
                console.log(`[MAIL] Preparing verified donation receipt for: ${donorEmail}`);
                const pdfBuffer = generateDonationPDF(donation);
                
                await sendEmail(
                    donorEmail,
                    "Official Donation Receipt - Youth Association of Purbichauki",
                    `Hi ${donation.fullName},\n\nThank you for your generous contribution of NPR ${donation.amount}. Your donation has been verified.\n\nPlease find your official receipt attached to this email.`,
                    `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
                        <div style="background-color: #f0fdf4; padding: 40px; border-radius: 20px; border: 1px solid #dcfce7;">
                            <h2 style="color: #16a34a; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Thank You for Your Support!</h2>
                            <p style="font-size: 16px; line-height: 1.6;">Dear <b>${donation.fullName}</b>,</p>
                            <p style="font-size: 16px; line-height: 1.6;">We have successfully verified your donation of <b>NPR ${donation.amount}</b>. Your contribution is vital to our mission of building a brighter future for the community.</p>
                            
                            <div style="margin: 30px 0; padding: 20px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
                                <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Transaction Summary</p>
                                <p style="margin: 8px 0 0 0; font-size: 15px;"><b>ID:</b> ${donation.transactionId}</p>
                                <p style="margin: 4px 0 0 0; font-size: 15px;"><b>Method:</b> ${donation.paymentMethod}</p>
                            </div>

                            <p style="font-size: 15px; color: #4b5563;">Please find your official donation receipt attached to this email for your records.</p>
                            <br/>
                            <p style="margin: 0;">Warm regards,<br/><b>The Finance Team</b></p>
                            <p style="margin: 0; font-weight: bold; color: #16a34a;">Youth Association of Purbichauki</p>
                        </div>
                    </div>
                    `,
                    [{
                        filename: `YAOP_Receipt_${donation.transactionId || 'Donation'}.pdf`,
                        content: pdfBuffer
                    }]
                );
            }
        }

        res.json({ message: "Donation record updated and receipt sent if verified." });
    } catch (e) {
        console.error("[ADMIN] Donation update error:", e);
        res.status(500).json({ message: "Update failed", error: e.message }); 
    }
});

app.delete('/api/donations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection("donations").deleteOne({ _id: new ObjectId(id) });
        res.json({ message: "Donation deleted successfully" });
    } catch (e) {
        console.error("Donation delete error:", e);
        res.status(500).json({ message: "Failed to delete donation" });
    }
});

app.delete('/api/donations', async (req, res) => {
    try {
        await db.collection("donations").deleteMany({});
        res.json({ message: "All donation records cleared successfully" });
    } catch (e) {
        console.error("Bulk donation delete error:", e);
        res.status(500).json({ message: "Failed to clear donations" });
    }
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
        const donationData = await db.collection("donations").find({ status: 'verified' }).toArray();
        const autoTotalDonations = donationData.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
        const finances = await db.collection("finances").findOne({ type: 'summary' }) || {};

        const totalDonations = finances.totalReceived !== undefined ? finances.totalReceived : autoTotalDonations;
        const totalSpent = finances.totalSpent || 0;
        const remainingBalance = finances.remainAmount !== undefined ? finances.remainAmount : (totalDonations - totalSpent);

        res.json({
            fundsReceived: totalDonations,
            kindsReceived: 0,
            totalSpent: totalSpent,
            totalAmount: totalDonations,
            remainingAmount: remainingBalance
        });
    } catch (e) {
        res.status(500).json({ message: "Error fetch transparency API" });
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

// Site Settings
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await db.collection("settings").findOne({ type: 'global' });
        if (!settings) {
            const defaultSettings = { 
                type: 'global',
                adminName: 'Super Admin',
                logoUrl: '',
                orgName: 'Youth Association Of Purbichauki',
                adminEmail: 'admin@yaop.org',
                esewaId: '',
                esewaQrCode: '',
                bankDetails: '',
                bankQrCode: '',
                donationPurposes: []
            };
            await db.collection("settings").insertOne(defaultSettings);
            return res.json(defaultSettings);
        }
        res.json(settings);
    } catch (e) {
        res.status(500).json({ message: "Error fetching settings" });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const { adminName, logoUrl, orgName, adminEmail, esewaId, esewaQrCode, bankDetails, bankQrCode, donationPurposes } = req.body;
        await db.collection("settings").updateOne(
            { type: 'global' },
            { $set: { 
                adminName, logoUrl, orgName, adminEmail, 
                esewaId, esewaQrCode, bankDetails, bankQrCode, donationPurposes,
                updatedAt: new Date() 
            } },
            { upsert: true }
        );
        res.json({ message: "Settings updated successfully" });
    } catch (e) {
        res.status(500).json({ message: "Error updating settings" });
    }
});

// END OF ROUTES

app.get('/', (req, res) => {
    res.send('Youth Association Of Purbichauki Backend API is running!');
});

module.exports = app;
