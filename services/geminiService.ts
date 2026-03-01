import { VerificationResult, AnalysisVerdict } from "../types";

export const analyzeContent = async (
  text: string | null,
  fileData: { mimeType: string; data: string } | null
): Promise<VerificationResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        fileData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Analysis failed");
    }

    const result = await response.json();

    return {
      score: result.score,
      verdict: result.verdict as AnalysisVerdict,
      explanation: result.explanation,
      reasoning: result.reasoning,
      timestamp: new Date().toISOString()
    };

  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "Verification protocol failed. System unresponsive.");
  }
};
