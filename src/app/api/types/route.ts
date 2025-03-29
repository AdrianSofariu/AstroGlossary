import { types } from "@/app/data/types";
import { NextResponse } from "next/server";

export async function GET() {
  // Fetch types from the API
  return NextResponse.json(types, {
    status: 200,
  });
}
