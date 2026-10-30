const corsHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { ...corsHeaders, "Access-Control-Allow-Origin": "*" }, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "শুধু POST অনুরোধ গ্রহণযোগ্য।" }) };
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "সার্ভারে OPENAI_API_KEY সেট করা হয়নি।" }) };
  }
  try {
    const body = JSON.parse(event.body || "{}");
    const { image, mode, language, extra } = body;
    if (typeof image !== "string" || !/^data:image\/(jpeg|jpg|png|webp);base64,/.test(image)) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "সঠিক JPG, PNG অথবা WebP ছবি দিন।" }) };
    }
    if (image.length > 11_500_000) {
      return { statusCode: 413, headers: corsHeaders, body: JSON.stringify({ error: "ছবিটি অনেক বড়। ৮ MB-এর কম ছবি দিন।" }) };
    }
    const isFood = mode === "food";
    const lang = language === "en" ? "English" : "Bengali";
    const instructions = isFood
      ? `You are a careful food identification and nutrition estimation assistant for Bangladesh. Reply in ${lang}. Identify visible food and explain uncertainty. Estimate portion size only cautiously. Give approximate calories, protein, carbohydrates, fat, and fiber for the visible portion; list key vitamins/minerals only when reasonably inferable. Explain that values vary with portion and recipe. Mention relevant food safety/allergy cautions only when visible or reasonably relevant. Never diagnose disease or prescribe treatment. If it is not food, say so. Clearly label all nutrition numbers as estimates.`
      : `You are a careful visual product identification and price-estimation assistant for Bangladesh. Reply in ${lang}. Identify the object and any visible brand/model, but do not invent a model. Assess new/used condition only if visible. Give a cautious approximate Bangladesh market price range in BDT only if a reasonable estimate can be made; state assumptions and explain that exact model, authenticity, condition, location and current market listings can change the price. If price cannot be reliably estimated from the image, say what extra details are needed instead of fabricating a number. Do not claim to have checked live shop prices.`;
    const prompt = instructions + (extra ? `\nUser-provided context: ${String(extra).slice(0,300)}` : "");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [{
          role: "user",
          content: [
            { type: "input_text", text: prompt },
            { type: "input_image", image_url: image, detail: "high" }
          ]
        }],
        max_output_tokens: 900
      })
    });
    const result = await response.json();
    if (!response.ok) {
      const msg = result?.error?.message || "AI সার্ভিসে সমস্যা হয়েছে।";
      return { statusCode: response.status === 429 ? 429 : 502, headers: corsHeaders, body: JSON.stringify({ error: msg }) };
    }
    const output = (result.output || []).flatMap(x => x.content || []).filter(x => x.type === "output_text").map(x => x.text).join("\n");
    if (!output) throw new Error("AI থেকে লেখা ফলাফল পাওয়া যায়নি।");
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ result: output }) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message || "সার্ভার ত্রুটি।" }) };
  }
};
