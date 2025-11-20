// lib/prompts.ts
import type { UserInput } from "./types";

export const buildPlanPrompt = (user: UserInput): string => `
You are an expert personal trainer and nutritionist.

Generate a personalised 7-day fitness plan for this user:

Name: ${user.name}
Age: ${user.age}
Gender: ${user.gender}
Height: ${user.heightCm} cm
Weight: ${user.weightKg} kg
Goal: ${user.goal}
Fitness Level: ${user.fitnessLevel}
Workout Location: ${user.workoutLocation}
Diet Type: ${user.dietType}
Medical History: ${user.medicalHistory || "Not provided"}
Stress Level: ${user.stressLevel || "Not provided"}

Return STRICTLY in this JSON format:

{
  "workoutPlan": "detailed 7-day workout plan with days, exercises, sets, reps, and rest times",
  "dietPlan": "detailed 7-day diet plan with breakfast, lunch, dinner, and snacks",
  "tips": "short bullet points with lifestyle advice, posture tips, stress management and motivational lines"
}

Do not include any markdown, comments, or extra text. Only valid JSON.
`;
