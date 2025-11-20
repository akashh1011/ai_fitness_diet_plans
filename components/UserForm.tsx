"use client";

import { useState } from "react";
import type {
  UserInput,
  FitnessGoal,
  FitnessLevel,
  WorkoutLocation,
  DietType,
  StressLevel,
} from "@/lib/types";

interface Props {
  onSubmit: (data: UserInput) => void;
  loading: boolean;
}

export default function UserForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<UserInput>({
    name: "",
    age: 22,
    gender: "male",
    heightCm: 170,
    weightKg: 70,
    goal: "weight_loss",
    fitnessLevel: "beginner",
    workoutLocation: "home",
    dietType: "veg",
    medicalHistory: "",
    stressLevel: "medium",
  });

  // ✅ Generic handleChange – yahan koi `any` nahi hai
  const handleChange = <K extends keyof UserInput>(
    key: K,
    value: UserInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid gap-3 md:grid-cols-2"
    >
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Name</label>
        <input
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      {/* Age */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Age</label>
        <input
          type="number"
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.age}
          onChange={(e) => handleChange("age", Number(e.target.value))}
          required
        />
      </div>

      {/* Gender (simple string) */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Gender</label>
        <select
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Height */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Height (cm)</label>
        <input
          type="number"
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.heightCm}
          onChange={(e) => handleChange("heightCm", Number(e.target.value))}
        />
      </div>

      {/* Weight */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Weight (kg)</label>
        <input
          type="number"
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.weightKg}
          onChange={(e) => handleChange("weightKg", Number(e.target.value))}
        />
      </div>

      {/* Fitness Goal */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Fitness Goal</label>
        <select
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.goal}
          onChange={(e) =>
            handleChange("goal", e.target.value as FitnessGoal)
          }
        >
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="general_fitness">General Fitness</option>
        </select>
      </div>

      {/* Fitness Level */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Current Fitness Level</label>
        <select
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.fitnessLevel}
          onChange={(e) =>
            handleChange("fitnessLevel", e.target.value as FitnessLevel)
          }
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Workout Location */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Workout Location</label>
        <select
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.workoutLocation}
          onChange={(e) =>
            handleChange(
              "workoutLocation",
              e.target.value as WorkoutLocation
            )
          }
        >
          <option value="home">Home</option>
          <option value="gym">Gym</option>
          <option value="outdoor">Outdoor</option>
        </select>
      </div>

      {/* Diet Type */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">Diet Type</label>
        <select
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.dietType}
          onChange={(e) =>
            handleChange("dietType", e.target.value as DietType)
          }
        >
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
          <option value="vegan">Vegan</option>
          <option value="keto">Keto</option>
        </select>
      </div>

      {/* Stress Level */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-slate-400">
          Stress Level <span className="text-slate-500">(Optional)</span>
        </label>
        <select
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm"
          value={form.stressLevel}
          onChange={(e) =>
            handleChange("stressLevel", e.target.value as StressLevel)
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Medical History */}
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="text-xs text-slate-400">
          Medical History <span className="text-slate-500">(Optional)</span>
        </label>
        <textarea
          className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm min-h-[60px]"
          value={form.medicalHistory}
          onChange={(e) => handleChange("medicalHistory", e.target.value)}
          placeholder="E.g. knee pain, diabetes, BP, etc."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 md:col-span-2 bg-indigo-600 hover:bg-indigo-500 transition rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? "Generating your AI plan..." : "Generate My AI Plan ⚡"}
      </button>
    </form>
  );
}
