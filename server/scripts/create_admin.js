const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

async function createAdmin() {
    // Manually parse .env.local
    let uri = "";
    let email = "admin@gmail.com";
    let password = "admin@2000";

    try {
        const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');

        const matchUri = envContent.match(/MONGODB_URI=["']?([^"']+)["']?/);
        if (matchUri) uri = matchUri[1];

        const matchEmail = envContent.match(/ADMIN_EMAIL=["']?([^"']+)["']?/);
        if (matchEmail) email = matchEmail[1];

        const matchPass = envContent.match(/ADMIN_PASSWORD=["']?([^"']+)["']?/);
        if (matchPass) password = matchPass[1];

    } catch (e) {
        console.error("Could not read .env.local", e);
    }

    if (!uri) {
        console.error("MONGODB_URI not found");
        return;
    }

    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('sudur');
        const users = db.collection('users');

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update or insert admin
        const result = await users.updateOne(
            { email },
            {
                $set: {
                    name: "Admin",
                    email,
                    password: hashedPassword,
                    role: "admin",
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log(`Admin user ${email} created successfully.`);
        } else {
            console.log(`Admin user ${email} updated successfully.`);
        }
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        await client.close();
    }
}

createAdmin();
