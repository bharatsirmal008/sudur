const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://sudur01:sudur01@cluster0.wulpqr6.mongodb.net/sudur?appName=Cluster0";
const client = new MongoClient(uri);

async function seed() {
    try {
        await client.connect();
        const db = client.db('sudur');
        const volunteers = db.collection('volunteers');

        // Clear existing
        await volunteers.deleteMany({});

        const initialVolunteers = [
            {
                name: "ANIL BANIYA",
                role: "Volunteer",
                location: "Kathmandu",
                image: "/team_member_1.png",
                socials: { facebook: "#", instagram: "#", linkedin: "#" },
                createdAt: new Date()
            },
            {
                name: "ANJAL MANANDAR",
                role: "Volunteer",
                location: "Nepalgunj",
                image: "/team_member_2.png",
                socials: { facebook: "#", instagram: "#", linkedin: "#" },
                createdAt: new Date()
            },
            {
                name: "APSON G.C.",
                role: "Volunteer",
                location: "Pokhara",
                image: "/team_member_3.png",
                socials: { facebook: "#", instagram: "#", linkedin: "#" },
                createdAt: new Date()
            },
            {
                name: "SARAH JENKINS",
                role: "Volunteer",
                location: "Dharan",
                image: "/team_member_4.png",
                socials: { facebook: "#", instagram: "#", linkedin: "#" },
                createdAt: new Date()
            }
        ];

        await volunteers.insertMany(initialVolunteers);
        console.log("Seeded 4 volunteers successfully.");
    } finally {
        await client.close();
    }
}

seed().catch(console.error);
