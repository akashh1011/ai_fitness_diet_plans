# 🏋️‍♂️ AI Fitness Coach – Next.js + Gemini 2.0

An AI-powered fitness assistant built with **Next.js 14**, **TypeScript**, and **Tailwind CSS** that generates **personalized workout & diet plans** using **LLMs (Gemini 2.0 via OpenRouter)**.

It also supports:

- 💬 AI-generated tips & motivation  
- 🎙️ Voice playback (reads out your plans)  
- 🖼️ AI-style exercise & meal images  
- ⬇️ One-click **download** of your full fitness plan as a text file  

---

## 🚀 Features

### 1. Smart User Input Form

Users can enter detailed fitness information:

- **Basic info**: Name, Age, Gender  
- **Body metrics**: Height (cm), Weight (kg)  
- **Fitness goal**:
  - `Weight Loss`
  - `Muscle Gain`
  - `General Fitness`
- **Current fitness level**:
  - `Beginner`, `Intermediate`, `Advanced`
- **Workout location**:
  - `Home`, `Gym`, `Outdoor`
- **Diet type**:
  - `Veg`, `Non-Veg`, `Vegan`, `Keto`
- **Optional fields**:
  - Medical history (injuries, conditions)
  - Stress level (`Low`, `Medium`, `High`)

All of this data is sent to the AI to generate a tailored plan.

---

### 2. AI-Powered Plan Generation (Gemini 2.0 via OpenRouter)

The backend exposes an API route:

- `POST /api/generate-plan`

It uses:

- **Model**: `google/gemini-2.0-flash-exp:free` (configurable)  
- **Provider**: [OpenRouter](https://openrouter.ai/)

For each user, it generates:

- 🏋️ **Workout Plan**:  
  - 7-day structured workout  
  - Exercises, sets, reps, rest times  
  - Full body, cardio, strength, and mobility days
- 🥗 **Diet Plan**:  
  - Sample Indian-style meals  
  - Breakfast, lunch, dinner, snacks  
  - Hydration guidelines
- 💬 **Tips & Motivation**:
  - Lifestyle advice  
  - Posture & form tips  
  - Sleep & stress management  
  - Motivational lines

The prompt is designed to return **strict JSON**:

```json
{
  "workoutPlan": "...",
  "dietPlan": "...",
  "tips": "..."
}


I TRIED A LOT TO FIND AI APY KEY BUT I COULDN.T FOUND IT THATS WHY I USED FREE GEMINI API KEY BUT SOMETIME IT FAILED THATS WHY I ALSO USED THE MOCK DATA WITH ALL THE 