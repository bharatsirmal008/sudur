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
            if (!user) {
                const result = await db.collection("users").insertOne({
                    email: email.toLowerCase(),
                    name: email.split('@')[0],
                    role: "supporter",
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
            title, description, shortDescription, date, location, image, 
            registrationLink, activities, impactPoints, organizer, 
            startTime, endTime, terms, criteria, feedbackLink, otherInfo 
        } = req.body;
        
        const slug = generateSlug(title);
        const result = await db.collection("events").insertOne({ 
            title, 
            description, 
            shortDescription,
            date: date ? new Date(date) : new Date(), 
            location, 
            image, 
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
        const { id, _id, date, title, activities, impactPoints, organizer, startTime, endTime, terms, criteria, feedbackLink, otherInfo, status, ...updateData } = req.body;
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
        const appData = await db.collection("volunteer_applications").findOne({ _id: new ObjectId(id) });
        
        if (!appData) return res.status(404).json({ message: "Application not found" });

        // 1. Update Application Status
        await db.collection("volunteer_applications").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'approved', processedAt: new Date() } }
        );

        // 2. Add to Volunteers (Team) Collection
        const newVolunteer = {
            name: appData.name,
            role: "Volunteer", // Default role
            location: appData.temporaryAddress?.split(',')?.pop()?.trim() || "Local",
            image: "https://cdn-icons-png.flaticon.com/512/1144/1144760.png", // Default placeholder
            skills: appData.skills,
            contact: appData.contact,
            email: appData.email,
            socials: {},
            isVisible: true,
            createdAt: new Date()
        };
        await db.collection("volunteers").insertOne(newVolunteer);

        // 3. Send Success Email
        await sendEmail(
            appData.email,
            "Welcome to YAOP - Volunteer Application Approved!",
            `Hi ${appData.name},\n\nCongratulations! Your application to volunteer with Youth Association of Purbichauki has been approved. Welcome to the team!\n\nWe will reach out soon with next steps.`,
            `<h2>Welcome to the Team, ${appData.name}!</h2><p>Congratulations! Your application to volunteer with <b>Youth Association of Purbichauki (YAOP)</b> has been approved.</p><p>We are excited to have you on board. Our team will contact you shortly with further details and onboarding materials.</p><br/><p>Best regards,<br/>The YAOP Team</p>`
        );

        res.json({ message: "Application approved and volunteer added" });
    } catch (e) {
        console.error("Approval error:", e);
        res.status(500).json({ message: "Approval failed" });
    }
});

app.patch('/api/volunteer-applications/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const appData = await db.collection("volunteer_applications").findOne({ _id: new ObjectId(id) });

        if (!appData) return res.status(404).json({ message: "Application not found" });

        await db.collection("volunteer_applications").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'rejected', rejectionReason: reason, processedAt: new Date() } }
        );

        // Send Professional Rejection Email with Suggestions
        await sendEmail(
            appData.email,
            "Status Update: Volunteer Application - Youth Association of Purbichauki",
            `Hi ${appData.name},\n\nThank you for your interest in volunteering with YAOP. After carefully reviewing your application, we have some feedback and suggestions for you.\n\nSuggestions: ${reason || "Keep improving your skills and apply for future events!"}\n\nWe appreciate your spirit of service.`,
            `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1f5f9; rounded-lg: 16px;">
                <h2 style="color: #0f172a; font-weight: 800; tracking-tight: -0.025em; margin-bottom: 24px;">Application Update</h2>
                <p style="color: #475569; line-height: 1.6;">Hi <b>${appData.name}</b>,</p>
                <p style="color: #475569; line-height: 1.6;">Thank you so much for taking the time to apply for a volunteer position with our association. We truly value your passion for community service.</p>
                
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <h4 style="color: #991b1b; margin-top: 0; margin-bottom: 8px; font-weight: 700; text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em;">Suggestions from our Team</h4>
                    <p style="color: #b91c1c; margin: 0; font-size: 15px; line-height: 1.5; font-style: italic;">
                        "${reason || "We encourage you to continue developing your local leadership skills and re-apply for our upcoming specialized community events."}"
                    </p>
                </div>

                <p style="color: #475569; line-height: 1.6;">While we cannot proceed with your profile for this specific role right now, we encourage you to stay connected through our social media and workshops.</p>
                <p style="color: #475569; line-height: 1.6;">We wish you the very best in all your future endeavors.</p>
                <br/>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #64748b; font-size: 13px;">Best regards,<br/><b>Administrative Team</b><br/>Youth Association of Purbichauki (YAOP)</p>
            </div>
            `
        );

        res.json({ message: "Application rejected and user notified" });
    } catch (e) { res.status(500).json({ message: "Rejection failed" }); }
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
        const { _id, createdAt, verifiedAt, ...updateData } = req.body;
        
        await db.collection("donations").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, lastModifiedAt: new Date() } }
        );
        res.json({ message: "Donation record updated successfully" });
    } catch (e) {
        console.error("Donation patch error:", e);
        res.status(500).json({ message: "Failed to update donation record" }); 
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
                adminEmail: 'admin@yaop.org'
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
        const { adminName, logoUrl, orgName, adminEmail } = req.body;
        await db.collection("settings").updateOne(
            { type: 'global' },
            { $set: { adminName, logoUrl, orgName, adminEmail, updatedAt: new Date() } },
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
