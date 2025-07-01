// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

// Initialize the new SDK.
// In a Next.js backend, process.env.GEMINI_API_KEY should be set in your .env.local file.
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/**
 * Generates a detailed trip plan using Gemini AI, structured as JSON.
 * Includes itinerary, accommodations, and pro tips.
 */
export async function generateTripPlan({
  destination,
  groupType,
  numberOfPeople,
  days,
  budget,
}: {
  destination: string;
  groupType: string;
  numberOfPeople: number;
  days: number;
  budget: string; // Changed to string as per your form's budget options
}) {
  // Using gemini-2.5-flash for balanced performance and cost, and structured output.
  const modelName = "gemini-2.5-flash";

  const prompt = `
    You are a highly experienced and creative travel planner.
    Generate a detailed travel plan for a ${groupType} group of ${numberOfPeople} people.
    Destination: ${destination}
    Duration: ${days} days
    Budget: ${budget} (consider this as a general guide: Low, Medium, High)

    Provide the output as a JSON object with the following strict structure.
    Ensure all 'placeName' fields are specific and descriptive for potential image generation.
    Provide 2-3 hotel recommendations and 2-3 hostel recommendations based on the budget and group type.
    If hostels are not applicable for the group type (e.g., Luxury Couple), provide an empty array for hostels.
    Ensure all links are valid Google Maps search links.

    {
        "tripName": "A catchy and inviting name for the trip (e.g., 'Parisian Romance Getaway')",
        "overview": "A brief, exciting overview of the entire trip, highlighting key experiences.",
        "estimatedLocalTravelCharges": "Approximate local travel costs (e.g., public transport, taxis) in INR for the entire trip. Exclude flights/major hotels. Provide a realistic estimate with currency symbol (e.g., '₹5000 - ₹8000').",
        "proTips": [
            "Tip 1 for the destination (e.g., 'Always carry a portable charger')",
            "Tip 2 for the destination (e.g., 'Learn a few basic phrases in the local language')",
            "Tip 3 for the destination (e.g., 'Book popular attractions in advance')"
        ],
        "dailyItinerary": [
            {
                "day": 1,
                "theme": "Theme for Day 1 (e.g., 'Ancient History & Grand Markets')",
                "activities": [
                    {
                        "time": "Morning",
                        "description": "Activity description and place name (e.g., 'Visit the iconic Colosseum')",
                        "placeName": "Colosseum, Rome"
                    },
                    {
                        "time": "Afternoon",
                        "description": "Activity description and place name (e.g., 'Explore the vibrant Campo de' Fiori market')",
                        "placeName": "Campo de' Fiori, Rome"
                    },
                    {
                        "time": "Evening",
                        "description": "Activity description and place name / Dinner suggestion (e.g., 'Enjoy authentic Roman pasta at Trastevere')",
                        "placeName": "Trastevere, Rome"
                    }
                ]
            },
            // ... repeat for 'days' number of days
        ],
        "accommodations": {
            "hotels": [
                {
                    "name": "Hotel Name 1",
                    "description": "Short description of the hotel, emphasizing its amenities and suitability for the group/budget.",
                    "priceRange": "₹X - ₹Y per night",
                    "googleMapsLink": "https://www.google.com/maps/search/Hotel+Name+1+${destination.replace(/ /g, '+')}"
                },
                {
                    "name": "Hotel Name 2",
                    "description": "Short description of the hotel.",
                    "priceRange": "₹X - ₹Y per night",
                    "googleMapsLink": "https://www.google.com/maps/search/Hotel+Name+2+${destination.replace(/ /g, '+')}"
                }
            ],
            "hostels": [
                {
                    "name": "Hostel Name 1",
                    "description": "Short description of the hostel, emphasizing its social atmosphere or budget-friendliness.",
                    "priceRange": "₹X - ₹Y per night",
                    "googleMapsLink": "https://www.google.com/maps/search/Hostel+Name+1+${destination.replace(/ /g, '+')}"
                }
            ]
        }
    }
    Ensure the JSON is perfectly formatted and valid. Do not include any extra text outside the JSON.
    `;

  try {
    // CORRECTED: Call generateContent directly on the 'genAI.models' instance,
    // and remove 'await' from 'result.response' as it's not a Promise.
    const result = await genAI.models.generateContent({
      model: modelName, // Specify the model here
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        // Define the schema to ensure strict JSON output
        responseSchema: {
          type: "OBJECT",
          properties: {
            tripName: { type: "STRING" },
            overview: { type: "STRING" },
            estimatedLocalTravelCharges: { type: "STRING" },
            proTips: { type: "ARRAY", items: { type: "STRING" } },
            dailyItinerary: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  day: { type: "NUMBER" },
                  theme: { type: "STRING" },
                  activities: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        time: { type: "STRING" },
                        description: { type: "STRING" },
                        placeName: { type: "STRING" },
                      },
                      required: ["time", "description", "placeName"],
                    },
                  },
                },
                required: ["day", "theme", "activities"],
              },
            },
            accommodations: {
              type: "OBJECT",
              properties: {
                hotels: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      description: { type: "STRING" },
                      priceRange: { type: "STRING" },
                      googleMapsLink: { type: "STRING" },
                    },
                    required: ["name", "description", "priceRange", "googleMapsLink"],
                  },
                },
                hostels: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { type: "STRING" },
                      description: { type: "STRING" },
                      priceRange: { type: "STRING" },
                      googleMapsLink: { type: "STRING" },
                    },
                    required: ["name", "description", "priceRange", "googleMapsLink"],
                  },
                },
              },
              required: ["hotels", "hostels"],
            },
          },
          required: [
            "tripName",
            "overview",
            "estimatedLocalTravelCharges",
            "proTips",
            "dailyItinerary",
            "accommodations",
          ],
        },
      },
    });

    const response = result.text; // Removed 'await' here
    const parsedResult = JSON.parse(response || ''); // Parse it into a JavaScript object
    

    return parsedResult; // Return the parsed JSON object
  } catch (error: any) {
    console.error("Error generating trip plan with Gemini:", error);
    throw new Error(`Failed to generate trip plan: ${error.message}`);
  }
}

/**
 * Generates an image for a given place using Imagen.
 * Returns a base64 encoded image string.
 */
export async function generatePlaceImage(placeName: string, destination: string): Promise<string | null> {
  const imagePrompt = `A high-quality, realistic photograph of ${placeName} in ${destination}. Focus on the iconic aspects and natural beauty of the location.`;
  const imageModelName = "imagen-3.0-generate-002"; // Use Imagen for image generation

  try {
    const imagePayload = { instances: { prompt: imagePrompt }, parameters: { "sampleCount": 1 } };
    // For Imagen, the API call is a direct fetch, not through the genAI client
    const imageUrl = `https://generativelanguage.googleapis.com/v1beta/models/${imageModelName}:predict?key=${process.env.GEMINI_API_KEY || ""}`;

    const imageResponse = await fetch(imageUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imagePayload)
    });

    if (!imageResponse.ok) {
      const errorBody = await imageResponse.json();
      console.error(`Imagen API error for ${placeName}:`, errorBody);
      return null;
    }

    const imageResult = await imageResponse.json();
    if (imageResult.predictions && imageResult.predictions.length > 0 && imageResult.predictions[0].bytesBase64Encoded) {
      return imageResult.predictions[0].bytesBase64Encoded; // Return base64 string
    }
    return null;
  } catch (error) {
    console.error(`Error generating image for ${placeName}:`, error);
    return null;
  }
}
