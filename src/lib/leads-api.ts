import { getApiUrl } from "./api-url";

export interface CreateLeadData {
  name: string;
  email: string;
  phone: string;
  gender?: string;
  profileKey?: string;
  resultCode?: string;
  profileName?: string;
  resultProfile?: string;
  matchedProduct?: string;
  answers?: Record<number, string>;
  source?: string;
  status?: string;
  notes?: string;
}

export interface UpdateLeadResultData {
  leadId: number | string;
  resultCode: string;
  resultProfile: string;
  matchedProduct?: string;
  answers: Record<number, string>;
}

export async function submitLeadDetails(data: CreateLeadData): Promise<number | null> {
  try {
    const res = await fetch(getApiUrl("api/leads"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.error || "Failed to submit details");
    }

    const json = await res.json();
    return json.leadId ?? null;
  } catch (err) {
    console.error("Error submitting lead details:", err);
    throw err;
  }
}

export async function submitQuizResult(data: UpdateLeadResultData): Promise<boolean> {
  try {
    const res = await fetch(getApiUrl("api/leads/result"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return res.ok;
  } catch (err) {
    console.error("Error submitting quiz results to database:", err);
    return false;
  }
}
