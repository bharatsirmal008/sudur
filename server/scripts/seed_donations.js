const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://sudur01:sudur01@cluster0.wulpqr6.mongodb.net/sudur?appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const db = client.db('sudur'); // NextAuth default or sudur
        const donationsCollection = db.collection('donations');

        const sampleDonations = [
            {
                amount: 250,
                currency: "USD",
                donorName: "Alice Smith",
                donorEmail: "alice@example.com",
                phone: "555-0101",
                address: { street: "123 Elm St", city: "New York", state: "NY", zip: "10001", country: "USA" },
                purpose: "Education",
                message: "Keep up the great work!",
                paymentMethod: "Credit Card",
                status: "Completed",
                createdAt: new Date()
            },
            {
                amount: 50,
                currency: "USD",
                donorName: "Bob Jones",
                donorEmail: "bob@example.com",
                phone: "555-0102",
                address: { street: "456 Oak Ave", city: "Los Angeles", state: "CA", zip: "90001", country: "USA" },
                purpose: "Environment",
                message: "",
                paymentMethod: "PayPal",
                status: "Completed",
                createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
            },
            {
                amount: 1000,
                currency: "USD",
                donorName: "Anonymous",
                donorEmail: "anon@example.com",
                address: { street: "Unknown", city: "Miami", state: "FL", zip: "33101", country: "USA" },
                purpose: "Healthcare",
                message: "In memory of John.",
                paymentMethod: "Bank Transfer",
                status: "Completed",
                createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
            }
        ];

        await donationsCollection.insertMany(sampleDonations);
        console.log("Seeded 3 donations successfully.");
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
