import { NextResponse } from "next/server";
import { dbStore } from "../store";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { amount, name, email, phone, purpose } = body;

        // Validate amount
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Generate unique transaction ID
        const transaction_uuid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // Save to DB (In-memory for demo)
        dbStore.set(transaction_uuid, {
            transaction_uuid,
            amount: parsedAmount,
            status: "PENDING",
            donor_info: { name, email, phone, purpose }
        });

        return NextResponse.json({
            transaction_uuid,
            success: true
        });

    } catch (error: any) {
        console.error("Error recording eSewa donation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
