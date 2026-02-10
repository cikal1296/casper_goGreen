// api/casper.js - ES Modules Version
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Get API key from environment variables
    const key = process.env.GEMINI_API_KEY;
    
    if (!key) {
      console.error("GEMINI_API_KEY not found in environment variables");
      return res.status(500).json({ 
        error: "Server configuration error" 
      });
    }

    // Forward request to Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(req.body),
      }
    );

    // Get response data
    const data = await response.json();
    
    // If Gemini API returns an error
    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(response.status).json({ 
        error: data.error?.message || "Gemini API error" 
      });
    }
    
    // Return successful response
    return res.status(200).json(data);
    
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
}
