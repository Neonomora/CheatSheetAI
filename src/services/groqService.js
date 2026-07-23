const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

export const getRecommendation = async ({ category, filters, search }) => {
  try {
    // Susun prompt berdasarkan input user
    const categoryLabel = category === "food" ? "makanan" : "minuman";
    const filterLabels = filters.map((f) => f.label).join(", ");
    // Tambah random seed di prompt
    const randomSeed = Math.floor(Math.random() * 1000);

    const prompt = search
      ? `Rekomendasikan ${categoryLabel} Indonesia dengan nama "${search}". 
     Berikan 5 rekomendasi yang berbeda-beda (seed: ${randomSeed}).`
      : `Rekomendasikan 5 ${categoryLabel} Indonesia berdasarkan selera: ${filterLabels}. 
     Berikan rekomendasi yang bervariasi dan berbeda dari sebelumnya (seed: ${randomSeed}).`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content: `Kamu adalah asisten rekomendasi makanan dan minuman Indonesia. 
            Selalu jawab dalam format JSON array dengan struktur:
            [{ "name": "nama", "description": "deskripsi singkat", "price": "estimasi harga", "location": "lokasi umum" }]
            Jangan tambahkan teks apapun selain JSON.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();
    const content = data.choices[0].message.content;
    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Groq error:", error);
    return [];
  }
};
