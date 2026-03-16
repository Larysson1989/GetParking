export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {

    const response = await fetch("1bQsBDXYog6He-a6mkMNYdUtNIe8wbhqpa7MIAi8ld9k", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    return res.status(200).json(data);

  } catch (error) {

    return res.status(500).json({
      success:false,
      message:"Erro ao conectar com servidor"
    });

  }

}
