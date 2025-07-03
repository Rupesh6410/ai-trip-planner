// app/api/trips/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";

// Define an interface for the route parameters to ensure correct typing
interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  req: NextRequest, // The incoming request object
  { params }: RouteParams // Destructure params from the context object, using our defined interface
) {
  const session = await auth();

  // Check if the user is authenticated
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the trip by its ID
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
    });

    // If no trip is found, return a 404 error
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Return the trip data
    return NextResponse.json(trip);
  } catch (error) {
    // Log the error and return a 500 status code for server errors
    console.error("Error fetching trip:", error);
    return NextResponse.json({"error": "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest, // The incoming request object (added for consistency)
  { params }: RouteParams // Destructure params from the context object, using our defined interface
) {
  const session = await auth();

  // Check if the user is authenticated
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the trip by its ID and include the associated user
    const trip = await prisma.trip.findUnique({
      where: { id: params.id },
      include: { user: true }, // Include user to check ownership
    });

    // If no trip is found, or the trip's user email doesn't match the session user's email,
    // return a 403 (Forbidden) error
    if (!trip || trip.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Trip not found or access denied" },
        { status: 403 }
      );
    }

    // Delete the trip from the database
    await prisma.trip.delete({
      where: { id: params.id },
    });

    // Return a success message
    return NextResponse.json({ message: "Trip deleted successfully" });
  } catch (error) {
    // Log the error and return a 500 status code for server errors
    console.error("Error deleting trip:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}