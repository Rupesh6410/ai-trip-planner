"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MultiStepLoader as Loader } from "../../components/ui/multi-step-loader";
import { IconSquareRoundedX } from "@tabler/icons-react";

export default function GenerateTripPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loadingStates = [
    { text: "Wait" },
    { text: "Planning your trip" },
    { text: "Generating itinerary" },
    { text: "Fetching Hotels and Hostels" },
    { text: "Good things take time" },
    { text: "Remember pro tips" },
    { text: "Almost there" },
    { text: "Hope you will enjoy it" },
  ];

  useEffect(() => {
    if (!session) {
      router.replace("/api/auth/signin");
    }
  }, [session, router]);

  const [form, setForm] = useState<{
    destination: string;
    groupType: string;
    numberOfPeople?: number;
    days?: number;
    budget?: number;
  }>({
    destination: "",
    groupType: "solo",
    numberOfPeople: 1, // default for solo
  });

  useEffect(() => {
    if (form.groupType === "solo" && !form.numberOfPeople) {
      setForm((prev) => ({ ...prev, numberOfPeople: 1 }));
    }
    if (form.groupType !== "solo" && form.numberOfPeople === 1) {
      setForm((prev) => ({ ...prev, numberOfPeople: undefined }));
    }
  }, [form.groupType]);

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "budget" || name === "numberOfPeople" || name === "days"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await res.json(); // Don't need the result now
        router.push("/trips");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to generate trip");
      }
    } catch {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto p-6 pt-24"
    >
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-blue-600">
            Generate Your AI Trip Plan 🌍
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                name="destination"
                placeholder="e.g. Paris"
                value={form.destination}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupType">Group Type</Label>
              <Select
                value={form.groupType}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, groupType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select group type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Number of People</Label>
              <Input
                type="number"
                name="numberOfPeople"
                value={form.numberOfPeople ?? ""}
                placeholder="e.g. 2"
                min={1}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Number of Days</Label>
              <Input
                type="number"
                name="days"
                value={form.days ?? ""}
                placeholder="e.g. 4"
                min={1}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (in ₹)</Label>
              <Input
                type="number"
                name="budget"
                value={form.budget ?? ""}
                placeholder="e.g. 15000"
                min={0}
                step={100}
                onChange={handleChange}
              />
            </div>

            <Separator />

            <Loader
              loadingStates={loadingStates}
              loading={loading}
              duration={2000}
            />

            <Button
              onClick={() => setLoading(true)}
              className="bg-[#39C3EF] hover:bg-[#39C3EF]/90 text-black mx-auto text-sm md:text-base transition font-medium duration-200 h-10 rounded-lg px-8 flex items-center justify-center"
              style={{
                boxShadow:
                  "0px -1px 0px 0px #ffffff40 inset, 0px 1px 0px 0px #ffffff40 inset",
              }}
              type="submit"
            >
              Generate Itinerary
            </Button>

            {loading && (
              <button
                className="fixed top-4 right-4 text-black dark:text-white z-[120]"
                onClick={() => setLoading(false)}
              >
                <IconSquareRoundedX className="h-10 w-10" />
              </button>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
