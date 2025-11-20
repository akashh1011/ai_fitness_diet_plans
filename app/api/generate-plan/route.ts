
import { NextResponse } from "next/server";
import { buildPlanPrompt } from "@/lib/prompts";
import type { UserInput, GeneratedPlan } from "@/lib/types";

interface OpenRouterMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OpenRouterChoice {
  message: OpenRouterMessage;
}

interface OpenRouterResponse {
  choices: OpenRouterChoice[];
}

// JSON substring extractor
function extractJson(text: string): string | null {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return null;
  return text.slice(first, last + 1);
}

const modelName =
  process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-exp:free";

export async function POST(req: Request) {
  const body = (await req.json()) as UserInput;

  const apiKey = process.env.OPENROUTER_API_KEY;
  const siteUrl =
    process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000";
  const siteName =
    process.env.OPENROUTER_SITE_NAME ?? "AI Fitness Coach";

  const baseMock: GeneratedPlan = {
    workoutPlan: `Sample workout plan for ${body.name || "Athlete"}:

Day 1 – Full Body
- Bodyweight Squats – 3 x 12
- Push Ups – 3 x 10 (knee/incline if needed)
- Glute Bridges – 3 x 15
- Plank – 3 x 20–30 sec

Day 2 – Cardio + Core
- Brisk Walk / Jog – 20–25 min
- Mountain Climbers – 3 x 12 each side
- Side Plank – 3 x 20 sec

Day 3 – Upper Body
- Incline Push Ups – 4 x 8–10
- Row with water bottles – 3 x 12
- Shoulder Taps – 3 x 12

Day 4 – Rest & Mobility
- Light walk – 15–20 min
- Full body stretching – 10–15 min

Day 5 – Lower Body
- Squats / Chair Squats – 4 x 12
- Lunges – 3 x 10 each leg
- Calf Raises – 3 x 15

Day 6 – Cardio Intervals
- 5 min warmup walk
- 1 min fast walk + 1.5 min slow walk x 6–8 rounds
- Cooldown + stretching

Day 7 – Rest
- Easy movement + stretching`,
    dietPlan: `Generic ${body.dietType} diet plan:

Breakfast:
- Oats with milk/curd + nuts + 1 fruit
OR
- 2–3 boiled eggs / paneer bhurji + 1 multigrain roti

Mid-Morning:
- 1 seasonal fruit + handful of nuts

Lunch:
- 1–2 rotis OR 1.5 bowls rice
- Dal / Rajma / Chole / Sambar
- Seasonal sabzi
- Big salad bowl

Evening:
- Roasted chana / sprouts / makhana
- Green tea / lemon water

Dinner:
- Lighter than lunch
- Dal + sabzi + 1 roti
OR
- Paneer / Tofu / Chicken + veggies
OR
- Soup + salad + small portion of carbs

Hydration:
- 3–4L water through the day`,
    tips: `Hi ${body.name || "Athlete"} 👋

- Start slow but stay consistent – daily chhota effort >> random heavy workout.
- Focus on form, not just reps ya weight.
- Sleep 7–8 hours for better recovery.
- Har 45–60 min screen time ke baad thoda walk/stretch.
- Stress high ho to 5–10 min deep breathing ya light walk add karo.

You’ve got this 💪`,
  };

  if (!apiKey) {
    console.warn("[GENERATE_PLAN] No OPENROUTER_API_KEY, returning mock");
    return NextResponse.json(baseMock, { status: 200 });
  }

  try {
    const prompt = buildPlanPrompt(body);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": siteUrl,
          "X-Title": siteName,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ] as OpenRouterMessage[],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error(
        "[GENERATE_PLAN] OpenRouter non-200:",
        response.status,
        text
      );
      const extraTip = `\n\n(Note: OpenRouter error ${response.status}: fallback plan used.)`;
      return NextResponse.json(
        { ...baseMock, tips: baseMock.tips + extraTip },
        { status: 200 }
      );
    }

    const data = (await response.json()) as OpenRouterResponse;

    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      console.error("[GENERATE_PLAN] Empty content from Gemini/OpenRouter");
      const extraTip =
        "\n\n(Note: AI returned empty content. Showing fallback plan.)";
      return NextResponse.json(
        { ...baseMock, tips: baseMock.tips + extraTip },
        { status: 200 }
      );
    }

    let parsed: GeneratedPlan | null = null;

    // 1) direct parse
    try {
      parsed = JSON.parse(rawContent) as GeneratedPlan;
    } catch {
      // 2) extract JSON block
      const maybeJson = extractJson(rawContent);
      if (maybeJson) {
        try {
          parsed = JSON.parse(maybeJson) as GeneratedPlan;
        } catch (e) {
          console.error(
            "[GENERATE_PLAN_PARSE_ERROR] extractJson parse failed",
            e,
            "RAW:",
            rawContent
          );
        }
      } else {
        console.error(
          "[GENERATE_PLAN_PARSE_ERROR] No JSON-like block found in content",
          rawContent
        );
      }
    }

    if (!parsed) {
      return NextResponse.json(
        {
          ...baseMock,
          workoutPlan: rawContent,
          tips:
            baseMock.tips +
            "\n\n(Note: AI JSON parse failed, raw AI text shown in workout section.)",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : String(err ?? "Unknown error");

    console.error("[GENERATE_PLAN_OPENROUTER_ERROR]", message);

    const extraTip = `\n\n(Note: Gemini/OpenRouter call failed: ${message}. Showing fallback plan.)`;

    return NextResponse.json(
      { ...baseMock, tips: baseMock.tips + extraTip },
      { status: 200 }
    );
  }
}
