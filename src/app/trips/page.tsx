"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

interface Trip {
  id: string;
  destination: string;
  groupType: string;
  numberOfPeople: number;
  days: number;
  budget: number;
  createdAt: string;
}

export default function TripsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session && status !== "loading") {
      router.replace("/api/auth/signin");
    } else if (status === "authenticated") {
      fetchTrips();
    }
  }, [router, session, status]);
  

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/trips");
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      console.error("Error fetching trips", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTrips((prev) => prev.filter((trip) => trip.id !== id));
      } else {
        alert("Failed to delete trip.");
      }
    } catch (err) {
      console.error("Failed to delete trip", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-blue-500">Loading trips...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Your Saved Trips ✈️
      </h1>

      {trips.length === 0 ? (
        <p className="text-center text-muted-foreground">No trips found.</p>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <Card key={trip.id} 
            className="cursor-pointer hover:shadow-md transition"
            onClick={() => router.push(`/trips/${trip.id}`)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-blue-700">
                  {trip.destination}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {trip.groupType} • {trip.numberOfPeople} people • {trip.days} days
                  </p>
                  <p className="text-sm mt-1 text-gray-600">
                    Budget: ₹{trip.budget.toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(trip.id)}
                  disabled={deletingId === trip.id}
                >
                  {deletingId === trip.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

