import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const order = await req.json();

    const response = await fetch("http://localhost:3001/print", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) throw new Error("Printing failed");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Printing failed" }, { status: 500 });
  }
}
