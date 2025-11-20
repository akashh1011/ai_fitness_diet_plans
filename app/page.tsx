// app/page.tsx
"use client";

import { useState } from "react";
import UserForm from "@/components/UserForm";
import PlanSection from "@/components/PlanSection";
import ImagePreview from "@/components/ImagePreview";
import type { GeneratedPlan, UserInput } from "@/lib/types";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [lastUser, setLastUser] = useState<UserInput | null>(null);

  const downloadTextFile = (filename: string, content: string) => {
    if (typeof window === "undefined") return;
    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async (data: UserInput) => {
    setLoading(true);
    setPlan(null);
    setLastUser(data);

    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json()) as GeneratedPlan;
      setPlan(json);
    } catch (err) {
      console.error("Error calling /api/generate-plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (label: string, type: "exercise" | "meal") => {
    setSelectedLabel(label);
    setImageUrl(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, type }),
      });

      const json = (await res.json()) as { url?: string };
      if (json.url) {
        setImageUrl(json.url);
      } else {
        console.error("No image URL returned");
      }
    } catch (err) {
      console.error("Error calling /api/generate-image:", err);
    }
  };

  const handleReadSection = (section: "workout" | "diet") => {
    if (!plan) return;

    const text =
      section === "workout"
        ? typeof plan.workoutPlan === "string"
          ? plan.workoutPlan
          : JSON.stringify(plan.workoutPlan, null, 2)
        : typeof plan.dietPlan === "string"
        ? plan.dietPlan
        : JSON.stringify(plan.dietPlan, null, 2);

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech not supported in this browser.");
      return;
    }

    setTtsLoading(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => setTtsLoading(false);
    utterance.onerror = () => setTtsLoading(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadFullPlan = () => {
    if (!plan) return;

    const name = lastUser?.name?.trim() || "fitness-user";

    const workoutText =
      typeof plan.workoutPlan === "string"
        ? plan.workoutPlan
        : JSON.stringify(plan.workoutPlan, null, 2);

    const dietText =
      typeof plan.dietPlan === "string"
        ? plan.dietPlan
        : JSON.stringify(plan.dietPlan, null, 2);

    const fullText = [
      `AI Fitness Plan for ${name}`,
      "",
      "=== WORKOUT PLAN ===",
      workoutText,
      "",
      "=== DIET PLAN ===",
      dietText,
      "",
      "=== TIPS & MOTIVATION ===",
      plan.tips,
    ].join("\n");

    const safeName = name.toLowerCase().replace(/\s+/g, "-");
    const filename = `${safeName}-ai-fitness-plan.txt`;

    downloadTextFile(filename, fullText);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold">
            AI Fitness Coach 🏋️‍♂️
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Get personalised workout & diet plans powered by AI (Gemini),
            with voice, visuals & downloadable plan.
          </p>
        </header>

        <UserForm onSubmit={handleGenerate} loading={loading} />

        {plan && (
          <>
            {/* Voice + Download */}
            <div className="flex gap-4 flex-wrap items-center">
              <button
                disabled={ttsLoading}
                onClick={() => handleReadSection("workout")}
                className="px-4 py-2 rounded-lg bg-emerald-600 disabled:opacity-60 text-sm font-medium"
              >
                🔊 Read Workout Plan
              </button>
              <button
                disabled={ttsLoading}
                onClick={() => handleReadSection("diet")}
                className="px-4 py-2 rounded-lg bg-sky-600 disabled:opacity-60 text-sm font-medium"
              >
                🔊 Read Diet Plan
              </button>
              <button
                onClick={handleDownloadFullPlan}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-sm font-medium"
              >
                ⬇️ Download Full Plan
              </button>
              {ttsLoading && (
                <span className="text-xs text-slate-400">
                  Reading out loud...
                </span>
              )}
            </div>

            {/* Plans */}
            <div className="grid md:grid-cols-2 gap-6">
              <PlanSection
                title="Workout Plan"
                content={plan.workoutPlan}
                onItemClick={(label) => handleItemClick(label, "exercise")}
              />
              <PlanSection
                title="Diet Plan"
                content={plan.dietPlan}
                onItemClick={(label) => handleItemClick(label, "meal")}
              />
            </div>

            {/* Tips */}
            <section className="mt-4">
              <h2 className="font-semibold mb-2">AI Tips & Motivation 💬</h2>
              <pre className="whitespace-pre-wrap text-sm bg-slate-900 p-3 rounded-lg border border-slate-800">
                {plan.tips}
              </pre>
            </section>
          </>
        )}

        <ImagePreview label={selectedLabel} imageUrl={imageUrl} />
      </div>
    </main>
  );
}
