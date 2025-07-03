"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Landmark, BedDouble, Lightbulb, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TripDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [trip, setTrip] = useState<TripRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // types/trip.ts
 type TripPlan = {
  tripName: string;
  overview: string;
  estimatedLocalTravelCharges: string;
  proTips: string[];
  dailyItinerary: {
    day: number;
    theme: string;
    activities: {
      time: string;
      description: string;
      placeName: string;
    }[];
  }[];
  accommodations: {
    hotels: {
      name: string;
      description: string;
      priceRange: string;
      googleMapsLink: string;
    }[];
    hostels: {
      name: string;
      description: string;
      priceRange: string;
      googleMapsLink: string;
    }[];
  };
};

 type TripRecord = {
  id: string;
  userId: string;
  destination: string;
  groupType: string;
  numberOfPeople: number;
  days: number;
  budget: number;
  result: TripPlan;
  createdAt: string;
};


  useEffect(() => {
    if (!session) {
      router.replace("/api/auth/signin");
    }
    
    async function fetchTrip() {
      const res = await fetch(`/api/trips/${params.id}`);
      const data = await res.json();
      setTrip(data);
      setLoading(false);
    }
    if (params?.id) fetchTrip();
  }, [params , session, router]);

  if (loading || !trip) {
    return <div className="flex items-center justify-center pt-24 text-center text-blue-600"><Loader2 className="animate-spin" size={30}/></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 space-y-6">
      <Card className="border-blue-100 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            {trip.result.tripName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{trip.result.overview}</p>
          <Separator className="my-3" />
          <div className="text-sm text-muted-foreground flex flex-wrap gap-4">
            <Badge variant="outline">{trip.days} days</Badge>
            <Badge variant="outline">{trip.numberOfPeople} {trip.groupType}</Badge>
            <Badge variant="outline">₹{trip.budget.toLocaleString()}</Badge>
          </div>
        </CardContent>
      </Card>

      {trip.result.dailyItinerary.map((day) => (
        <Card key={day.day} className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Landmark className="h-5 w-5 text-blue-500" />
              Day {day.day}: {day.theme}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {day.activities.map((activity, i: number) => (
              <div key={i} className="p-3 rounded-md bg-white shadow-sm">
                <p className="text-sm font-semibold text-blue-600">{activity.time}</p>
                <p className="text-base font-medium">{activity.placeName}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {trip.result.accommodations && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <BedDouble className="h-5 w-5 text-green-500" />
              Accommodation Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trip?.result?.accommodations?.hostels?.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-1 text-green-600">Hostels</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  {trip?.result?.accommodations?.hostels?.map((h, i: number) => (
                    <li key={i}>
                      <a href={h.googleMapsLink} target="_blank" className="text-green-700 underline">
                        {h.name}
                      </a>: {h.priceRange} — <span className="text-muted-foreground">{h.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {trip?.result?.accommodations?.hotels?.length > 0 && (
              <div>
                <h3 className="text-md font-semibold mb-1 text-green-600">Hotels</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm">
                  {trip?.result?.accommodations?.hotels?.map((h, i: number) => (
                    <li key={i}>
                      <a href={h.googleMapsLink} target="_blank" className="text-green-700 underline">
                        {h.name}
                      </a>: {h.priceRange} — <span className="text-muted-foreground">{h.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {trip.result.proTips?.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              Pro Travel Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
              {trip.result.proTips.map((tip: string, i: number) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}