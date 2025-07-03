// app/api/trips/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid trip ID" }, { status: 400 });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid trip ID" }, { status: 400 });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!trip || trip.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Trip not found or access denied" },
        { status: 403 }
      );
    }

    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
