
import type { StrategicPlan } from '../types';

export async function generateStrategicPlan(mission: string, vision: string): Promise<StrategicPlan> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mission, vision }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    const plan: StrategicPlan = await response.json();
    return plan;

  } catch (error) {
    console.error("Error calling backend function:", error);
    throw new Error("Failed to generate strategic plan.");
  }
}