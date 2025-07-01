// app/api/generate-trip/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "../../../../lib/prisma";
import { generateTripPlan } from "../../../../lib/gemini";

export async function POST(req: NextRequest) {
  // 1. Authentication Check
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { destination, groupType, numberOfPeople, days, budget } = body;

  // 2. Input Validation
  if (!destination || !groupType || !numberOfPeople || !days || !budget) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // 3. Generate Trip Itinerary
    console.log("Generating core trip plan with Gemini...");
    const generatedItinerary = await generateTripPlan({
      destination,
      groupType,
      numberOfPeople,
      days,
      budget,
    });
    console.log("Core trip plan generated.");

    const finalTripData = {
      ...generatedItinerary,
      inputDetails: { destination, groupType, numberOfPeople, days, budget },
    };

    // 4. Ensure User Exists or Create It
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found. Creating new user...");
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.image || null,
        },
      });
    }

    // 5. Save Trip to Database
    console.log("Saving trip to database...");
    const trip = await prisma.trip.create({
      data: {
        userId: user.id,
        destination,
        groupType,
        numberOfPeople,
        days,
        budget: parseInt(budget), // If budget is string
        result: finalTripData as any,
      },
    });

    console.log("Trip saved:", trip.id);
    return NextResponse.json(trip);
  } catch (err: any) {
    console.error("Error creating trip:", err);
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}
