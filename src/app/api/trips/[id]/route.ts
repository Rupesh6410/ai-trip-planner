// app/api/trips/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json({"error": "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!trip || trip.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Trip not found or access denied" },
        { status: 403 }
      );
    }

    await prisma.trip.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
