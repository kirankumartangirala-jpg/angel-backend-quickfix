import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { question, profile } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not set");
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `You are in an interview. Your profile: ${profile}. Answer like a human candidate in simple sentences.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const answer = completion.choices[0]?.message?.content || "No answer found.";
    res.status(200).json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
