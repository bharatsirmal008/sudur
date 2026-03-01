// In-memory store for demonstration purposes.
// REPLACE THIS WITH YOUR DATABASE (e.g., Prisma, Mongoose) in production.

export type DonationRecord = {
    transaction_uuid: string;
    amount: number;
    status: "PENDING" | "PAID" | "FAILED";
    donor_info: any;
    payload?: any;
};

// Use a global variable to persist across hot reloads in Next.js development
declare global {
    var donationStore: Map<string, DonationRecord>;
}

if (!global.donationStore) {
    global.donationStore = new Map();
}

export const dbStore = global.donationStore;
