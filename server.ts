import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || "1bQsBDXYog6He-a6mkMNYdUtNIe8wbhqpa7MIAi8ld9k";

// Google Sheets Auth
const getGoogleAuth = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  
  if (!privateKey) {
    console.error("GOOGLE_PRIVATE_KEY is missing");
    return new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  // Check if the user pasted the entire JSON credentials into the private key field
  if (privateKey.trim().startsWith("{")) {
    try {
      const credentials = JSON.parse(privateKey);
      return new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } catch (e) {
      console.error("Failed to parse GOOGLE_PRIVATE_KEY as JSON, attempting string cleanup");
    }
  }

  // Standard string cleanup
  // Remove potential wrapping quotes
  privateKey = privateKey.trim().replace(/^"(.*)"$/, "$1");
  // Handle escaped newlines (literal \n)
  privateKey = privateKey.replace(/\\n/g, "\n");
  
  // Ensure the key has the correct PEM format
  if (privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
    const header = "-----BEGIN PRIVATE KEY-----";
    const footer = "-----END PRIVATE KEY-----";
    
    let body = privateKey
      .replace(header, "")
      .replace(footer, "")
      .trim();
    
    // If the body has no newlines but has spaces, it's likely flattened
    if (!body.includes("\n") && body.includes(" ")) {
      body = body.replace(/\s+/g, "\n");
    }
    
    // Reconstruct with proper newlines
    privateKey = `${header}\n${body}\n${footer}`;
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

const auth = getGoogleAuth();
const sheets = google.sheets({ version: "v4", auth });

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // Get Stats
  app.get("/api/stats", async (req, res) => {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Base de Dados'!A:A",
      });
      const rows = response.data.values || [];
      const count = rows.length > 0 ? rows.length - 1 : 0; // Subtract header
      res.json({ vehicleCount: count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get All Vehicles
  app.get("/api/vehicles", async (req, res) => {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Base de Dados'!A:F",
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: "Nenhum dado encontrado." });
      }

      // Skip header row if it exists (assuming first row is header)
      const dataRows = rows.slice(1);

      const results = dataRows.map(vehicle => {
        const modelFull = vehicle[4] || "";
        let manufacturer = "";
        let vehicleName = "";

        if (modelFull.includes(" - ")) {
          [manufacturer, vehicleName] = modelFull.split(" - ");
        } else {
          const parts = modelFull.split(" ");
          manufacturer = parts[0] || "";
          vehicleName = parts.slice(1).join(" ") || manufacturer;
        }

        return {
          id: vehicle[0],
          owner: vehicle[1],
          phone: vehicle[2],
          plate: (vehicle[3] || "").toString().toUpperCase(),
          manufacturer: manufacturer.trim(),
          vehicleName: vehicleName.trim(),
          whatsapp: vehicle[5],
        };
      });

      res.json(results);
    } catch (error: any) {
      console.error("Sheets API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Register New Vehicle
  app.post("/api/vehicles", async (req, res) => {
    try {
      const { ownerName, phone, plate, model } = req.body;
      
      // Basic validation
      if (!ownerName || !phone || !plate || !model) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
      }

      const cleanPhone = phone.replace(/\D/g, "");
      const whatsappLink = `https://wa.me/55${cleanPhone}`;
      const id = Date.now().toString();

      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Base de Dados'!A:F",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[id, ownerName, phone, plate, model, whatsappLink]],
        },
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Sheets API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Search Vehicle by Plate or Name
  app.get("/api/vehicle/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      
      // First, try to get the spreadsheet data
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Base de Dados'!A:F",
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: "Nenhum dado encontrado." });
      }

      // Find vehicles by plate (Column D index 3) or Name (Column B index 1)
      const cleanString = (p: string) => p.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      const searchQuery = cleanString(query);
      
      const matchingRows = rows.filter(row => {
        const rowPlate = row[3] ? cleanString(row[3].toString()) : "";
        const rowName = row[1] ? row[1].toString().toLowerCase() : "";
        
        return rowPlate.includes(searchQuery) || rowName.includes(query.toLowerCase());
      });

      if (matchingRows.length === 0) {
        return res.status(404).json({ message: "Veículo ou Proprietário não localizado." });
      }

      const results = matchingRows.map(vehicle => {
        // Split model into manufacturer and vehicle name
        const modelFull = vehicle[4] || "";
        let manufacturer = "";
        let vehicleName = "";

        if (modelFull.includes(" - ")) {
          [manufacturer, vehicleName] = modelFull.split(" - ");
        } else {
          const parts = modelFull.split(" ");
          manufacturer = parts[0] || "";
          vehicleName = parts.slice(1).join(" ") || manufacturer;
        }

        return {
          id: vehicle[0],
          owner: vehicle[1],
          phone: vehicle[2],
          plate: (vehicle[3] || "").toString().toUpperCase(),
          manufacturer: manufacturer.trim(),
          vehicleName: vehicleName.trim(),
          whatsapp: vehicle[5],
        };
      });

      res.json(results);
    } catch (error: any) {
      console.error("Sheets API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Register New Volunteer
  app.post("/api/register", async (req, res) => {
    try {
      const { name, phone, password, birthDate } = req.body;
      
      // Validate password format (6 digits numeric)
      if (!/^\d{6}$/.test(password)) {
        return res.status(400).json({ message: "A senha deve ter exatamente 6 dígitos numéricos." });
      }
      
      // Check if user already exists
      const checkResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Usuários'!A:E",
      });
      
      const rows = checkResponse.data.values || [];
      const userExists = rows.some(row => row[2]?.toString() === phone);
      
      if (userExists) {
        return res.status(400).json({ message: "Este número já está cadastrado." });
      }
      
      // Check if password is unique among all users
      const passwordExists = rows.some(row => row[4]?.toString() === password);
      if (passwordExists) {
        return res.status(400).json({ message: "Esta senha já está em uso. Por favor, escolha outra." });
      }
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Usuários'!A:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[Date.now().toString(), name, phone, birthDate || "", password]],
        },
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Sheets API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Login
  app.post("/api/login", async (req, res) => {
    try {
      const { phone, password } = req.body;
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "'Usuários'!A:E",
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return res.status(401).json({ message: "Usuário não encontrado." });
      }

      // Find user by phone (Column C index 2) and check password (Column E index 4)
      const user = rows.find(row => 
        row[2]?.toString() === phone && 
        row[4]?.toString() === password
      );

      if (!user) {
        // Check if phone exists but password wrong
        const phoneExists = rows.some(row => row[2]?.toString() === phone);
        if (phoneExists) {
          return res.status(401).json({ message: "Senha incorreta." });
        }
        return res.status(401).json({ message: "Número não cadastrado." });
      }

      // Log successful login
      try {
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: "'Log'!A:E",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[
              new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
              user[0], // ID
              user[1], // Name
              user[2], // Phone
              "LOGIN"
            ]],
          },
        });
      } catch (logError) {
        console.error("Failed to log login:", logError);
        // Don't fail the login if logging fails, but it's good to know
      }

      res.json({ 
        success: true, 
        user: { 
          id: user[0], 
          name: user[1], 
          phone: user[2],
          birthDate: user[3] || "" // Assuming column D (index 3) is birth date
        } 
      });
    } catch (error: any) {
      console.error("Sheets API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Validate Google Sheets Connection on startup
    try {
      const auth = getGoogleAuth();
      const sheets = google.sheets({ version: "v4", auth });
      const response = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });
      console.log(`Successfully connected to Google Sheets: ${response.data.properties?.title}`);
    } catch (error) {
      console.error("Failed to connect to Google Sheets on startup:");
      if (error instanceof Error) {
        console.error(error.message);
        if (error.message.includes("unsupported")) {
          console.error("TIP: The private key format is still invalid. Ensure it's a proper PEM key.");
        }
      }
    }
  });
}

startServer();
