export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {

    const scriptUrl = "https://script.google.com/macros/s/AKfycbxu0svGapuorHSB2q7gPvmTpTWiKJJZWbLsGnu08ls/dev";

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({
        success:false,
        message:"Apps Script não retornou JSON",
        raw:text
      });
    }

  } catch (error) {

    return res.status(500).json({
      success:false,
      message:"Erro ao conectar com Apps Script",
      error:String(error)
    });

  }

}
