// lib/types.ts

export type FitnessGoal = "weight_loss" | "muscle_gain" | "general_fitness";
export type FitnessLevel = "beginner" | "intermediate" | "advanced";
export type WorkoutLocation = "home" | "gym" | "outdoor";
export type DietType = "veg" | "non-veg" | "vegan" | "keto";
export type StressLevel = "low" | "medium" | "high";

export interface UserInput {
  name: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  goal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  workoutLocation: WorkoutLocation;
  dietType: DietType;
  medicalHistory?: string;
  stressLevel?: StressLevel;
}

export interface GeneratedPlan {
  workoutPlan: unknown; // AI kabhi string, kabhi JSON object de sakta hai
  dietPlan: unknown;
  tips: string;
}
