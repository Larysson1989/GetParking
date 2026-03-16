export default function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { phone, password } = req.body;

  // exemplo simples
  if (phone === "41997015424" && password === "123456") {
    return res.status(200).json({
      success: true,
      message: "Login realizado"
    });
  }

  return res.status(401).json({
    success: false,
    message: "Credenciais inválidas"
  });
}
