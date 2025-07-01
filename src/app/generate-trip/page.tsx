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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function GenerateTripPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/api/auth/signin");
    }
  }, [session, router]);

  const [form, setForm] = useState({
    destination: "",
    groupType: "solo",
    numberOfPeople: 1,
    days: 1,
    budget: 10000,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "budget" || name === "numberOfPeople" || name === "days"
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
        const data = await res.json();
        router.push("/trips");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to generate trip");
      }
    } catch (err) {
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
                onValueChange={(value) => setForm((prev) => ({ ...prev, groupType: value }))}
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
                value={form.numberOfPeople}
                min={1}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Number of Days</Label>
              <Input
                type="number"
                name="days"
                value={form.days}
                min={1}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (in ₹)</Label>
              <Input
                type="number"
                name="budget"
                value={form.budget}
                min={0}
                step={100}
                onChange={handleChange}
              />
            </div>

            <Separator />

            <Button className="w-full bg-blue-600" type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Itinerary"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
