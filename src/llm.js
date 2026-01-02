const VERCEL_API_URL = "https://leetcode-chrome-extension.vercel.app";

export async function generateCode(
  apiKey,
  userPrompt,
  currentCode,
  chatHistory,
  model,
  onChunk
) {
  const response = await fetch(`${VERCEL_API_URL}/api/v1/generate-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey,
      userPrompt,
      currentCode,
      chatHistory,
      model,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "API request failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullCode = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Keep the last incomplete line

    for (const line of lines) {
      if (!line.trim()) continue;
      const jsonLine = line.startsWith("data: ") ? line.slice(6) : line;

      try {
        const chunk = JSON.parse(jsonLine);

        if (chunk.type === "text-delta") {
          fullCode += chunk.delta;
          if (onChunk) onChunk({ type: "text", content: chunk.delta });
        } else if (chunk.type === "reasoning-delta") {
          if (onChunk) onChunk({ type: "reasoning", content: chunk.delta });
        }
      } catch (e) {
        console.warn("Failed to parse chunk:", line);
      }
    }
  }

  // remove markdown code blocks if present
  const cleanCode = fullCode
    .replace(/^```python\n/, "")
    .replace(/^```\n/, "")
    .replace(/^\n/, "")
    .replace(/\n```$/, "");

  return { code: cleanCode };
}

export async function generateTest(
  apiKey,
  currentCode,
  problemDetails,
  currentTestCases,
  model,
  onChunk
) {
  const response = await fetch(`${VERCEL_API_URL}/api/v1/generate-test`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      apiKey,
      currentCode,
      problemDetails,
      currentTestCases,
      model,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "API request failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;
      const jsonLine = line.startsWith("data: ") ? line.slice(6) : line;

      try {
        const chunk = JSON.parse(jsonLine);

        if (chunk.type === "text-delta") {
          fullText += chunk.delta;
          if (onChunk) onChunk({ type: "text", content: chunk.delta });
        } else if (chunk.type === "reasoning-delta") {
          if (onChunk) onChunk({ type: "reasoning", content: chunk.delta });
        }
      } catch (e) {
        console.warn("Failed to parse chunk:", line);
      }
    }
  }

  try {
    return JSON.parse(fullText);
  } catch (e) {
    // If parsing fails, return null or throw
    console.error("Failed to parse final JSON from stream", fullText);
    throw new Error("Invalid response format from server");
  }
}
