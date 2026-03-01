import { NextResponse } from "next/server";
import { dbStore } from "../store";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tx = searchParams.get("tx");

        if (!tx) {
            return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
        }

        // Fetch from DB (In-memory for demo)
        const record = dbStore.get(tx);

        if (!record || !record.payload) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        return NextResponse.json(record.payload);

    } catch (error) {
        console.error("Error fetching eSewa payload:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
