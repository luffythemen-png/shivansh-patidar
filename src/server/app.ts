import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

// Determine path for inquiries.json (Netlify functions run read-only, we can use /tmp or memory)
const INQUIRIES_FILE = process.env.NETLIFY
  ? "/tmp/inquiries.json"
  : path.join(process.cwd(), "inquiries.json");

// Helper to initialize Gemini Client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// In-memory fallback if file system operations fail
let memoryInquiries: any[] = [];

// Helpers for reading/writing inquiries
function readInquiries() {
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf8");
      return [];
    }
    const data = fs.readFileSync(INQUIRIES_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.warn("Using in-memory fallback for inquiries read:", err);
    return memoryInquiries;
  }
}

function writeInquiries(inquiries: any[]) {
  try {
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf8");
  } catch (err) {
    console.warn("Using in-memory fallback for inquiries write:", err);
    memoryInquiries = inquiries;
  }
}

const app = express();
app.use(express.json());

// API Route: Submit an inquiry
app.post("/api/inquiries", (req: any, res: any) => {
  try {
    const { name, email, phone, address, message, monthlyBill, roofAreaSqFt, calculation } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email, and phone are required." });
    }

    const inquiries = readInquiries();
    const newInquiry = {
      id: "inq_" + Date.now(),
      name,
      email,
      phone,
      address,
      message,
      monthlyBill: monthlyBill ? Number(monthlyBill) : undefined,
      roofAreaSqFt: roofAreaSqFt ? Number(roofAreaSqFt) : undefined,
      calculation,
      status: "new",
      timestamp: new Date().toISOString(),
    };

    inquiries.push(newInquiry);
    writeInquiries(inquiries);

    res.status(201).json({ success: true, inquiry: newInquiry });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Route: Get inquiries (for dashboard view)
app.get("/api/inquiries", (req: any, res: any) => {
  try {
    const inquiries = readInquiries();
    res.json(inquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Route: Update inquiry status
app.patch("/api/inquiries/:id", (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const inquiries = readInquiries();
    const index = inquiries.findIndex((inq: any) => inq.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Inquiry not found." });
    }

    inquiries[index].status = status;
    writeInquiries(inquiries);

    res.json({ success: true, inquiry: inquiries[index] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Route: Gemini Solar Consulting / Advisor Report
app.post("/api/gemini/calculate", async (req: any, res: any) => {
  try {
    const { monthlyBill, roofAreaSqFt, systemType } = req.body;

    // Base mathematical estimation for Indore context
    const avgRateInr = 7.5;
    const monthlyUnits = (Number(monthlyBill) || 2000) / avgRateInr;
    const requiredCapacityKw = Math.max(1, Math.round((monthlyUnits / 120) * 10) / 10);
    const panelsNeeded = Math.ceil(requiredCapacityKw / 0.4);
    const costPerKw = systemType === "off-grid" ? 90000 : systemType === "hybrid" ? 110000 : 60000;
    const estimatedCost = Math.round(requiredCapacityKw * costPerKw);
    
    let subsidyInr = 0;
    if (systemType === "on-grid" || systemType === "hybrid") {
      if (requiredCapacityKw >= 3) subsidyInr = 78000;
      else if (requiredCapacityKw >= 2) subsidyInr = 60000;
      else if (requiredCapacityKw >= 1) subsidyInr = 30000;
    }
    
    const netCost = Math.max(15000, estimatedCost - subsidyInr);
    const annualSavings = Math.round(monthlyUnits * 12 * avgRateInr * 0.9);
    const payback = Math.round((netCost / (annualSavings || 1)) * 10) / 10;
    const co2OffsetKg = Math.round(requiredCapacityKw * 120 * 12 * 0.85);

    const mathResult = {
      recommendedCapacityKw: requiredCapacityKw,
      estimatedPanels: panelsNeeded,
      estimatedCostInr: estimatedCost,
      subsidyInr,
      netCostInr: netCost,
      estimatedAnnualSavingsInr: annualSavings,
      paybackYears: payback,
      carbonOffsetKg: co2OffsetKg,
      systemType: systemType || "on-grid",
    };

    let customAiReport = "";
    try {
      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a professional, highly encouraging Solar Feasibility and Savings Report for a client in Vijay Nagar, Indore, Madhya Pradesh.
        
        Input details:
        - Monthly Electricity Bill: ₹${monthlyBill}
        - Estimated monthly usage: ${Math.round(monthlyUnits)} kWh (units)
        - Rooftop Area: ${roofAreaSqFt || "Not specified"} sq ft
        - Recommended System Size: ${requiredCapacityKw} kW (${systemType || "on-grid"})
        - Estimated Panel Count: ${panelsNeeded} panels (400W each)
        - Total Estimated Cost: ₹${estimatedCost}
        - Central Subsidy (PM Surya Ghar): ₹${subsidyInr}
        - Net Investment: ₹${netCost}
        - Estimated Annual Savings: ₹${annualSavings}
        - Payback Period: ${payback} years
        - CO2 Saved annually: ${co2OffsetKg} kg
        
        Structure the response cleanly using markdown:
        1. **Overview & Analysis**: Explain how their current Indore electricity bill converts to solar requirements. Mention specific Madhya Pradesh climate suitability (with 300+ sunny days in Indore).
        2. **Subsidy Scheme Benefits**: Detail the PM Surya Ghar Muft Bijli Yojana Central Subsidy benefits applied to their recommendation (specifically mentioning Madhya Pradesh West Discom / MPPKVVCL rules if applicable).
        3. **Financial & Environmental Impact**: Highlight the long-term ROI over 25 years (typical panel lifespan) and their contribution to Indore's clean energy goals.
        4. **Next Steps**: Advise visiting Infinity Solar Power System in Vijay Nagar, Indore or arranging a physical site inspection.
        
        Keep the tone professional, authoritative, warm, and highly persuasive. Write directly to the customer. Do not include internal details.`,
      });
      customAiReport = response.text || "";
    } catch (geminiError: any) {
      console.warn("Gemini calculation report failed, falling back to static report:", geminiError);
      customAiReport = `### Solar Suitability Report for Vijay Nagar, Indore

Thank you for calculating your solar potential with **Infinity Solar Power System**! Based on your monthly bill of **₹${monthlyBill}**, we have estimated your ideal solar setup.

#### Recommended System Configuration:
- **System Capacity**: **${requiredCapacityKw} kW** (${systemType || "on-grid"})
- **Number of Panels**: **${panelsNeeded}** high-efficiency monocrystalline panels
- **Space Required**: Approximately **${requiredCapacityKw * 100} sq ft** of shadow-free rooftop space

#### Savings & Investment:
- **Gross Estimated Cost**: ₹${estimatedCost.toLocaleString("en-IN")}
- **PM Surya Ghar Subsidy**: ₹${subsidyInr.toLocaleString("en-IN")} (Central subsidy scheme)
- **Net Investment**: **₹${netCost.toLocaleString("en-IN")}**
- **Estimated Annual Savings**: **₹${annualSavings.toLocaleString("en-IN")}**
- **Payback Period**: **${payback} years** (Thereafter, your electricity is virtually FREE!)

#### Why Indore is Perfect for Solar:
Indore receives an exceptional 300+ days of bright sunshine annually. Moving to solar will shield you from rising commercial or residential electricity tariffs from West Discom (MPPKVVCL). Under the **PM Surya Ghar Muft Bijli Yojana**, the subsidy is credited directly to your bank account post-commissioning. 

**Next Steps**:
Please visit our dealership in **Vijay Nagar, Indore** or fill out our contact form below to schedule a free site survey by Infinity Solar's engineers!`;
    }

    res.json({
      calculation: mathResult,
      report: customAiReport,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Route: Gemini Solar Consultation Assistant (Chatbot)
app.post("/api/gemini/chat", async (req: any, res: any) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemInstruction = `You are "Surya", the official AI Solar Consultant for "Infinity Solar Power System", a leading solar panel installation company and dealership based in Vijay Nagar, Indore, Madhya Pradesh.
    
    Your personality:
    - Extremely knowledgeable about solar technology, setups (on-grid, off-grid, hybrid), inverters, net metering, and solar batteries.
    - Highly focused on Indore, Vijay Nagar, and Madhya Pradesh state policies.
    - Up-to-date with PM Surya Ghar Muft Bijli Yojana (Central Subsidy: up to ₹30k for 1kW, ₹60k for 2kW, max ₹78k for 3kW+).
    - Courteous, encouraging, and clear. Avoid jargon where possible, or explain it simply.
    - Always recommend Infinity Solar's professional installation services in Indore. Mention their 8+ years of trusted experience, Vijay Nagar location, and round-the-clock (24/7) support.
    
    When discussing costs:
    - Residential On-grid systems range roughly ₹55k to ₹65k per kW (gross, before subsidy).
    - Off-grid systems with batteries are around ₹85k to ₹1L+ per kW.
    - Mention that Infinity Solar provides free on-site physical inspection and custom designing in Indore.
    
    Answer the user's questions directly and concisely. Ensure formatting uses clean markdown. Keep answers friendly.`;

    const contents = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    try {
      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
        },
      });

      res.json({
        reply: response.text || "I am here to help you switch to solar. How can I assist you today?",
      });
    } catch (geminiError: any) {
      console.warn("Gemini Chat failed, falling back to smart rule replies:", geminiError);
      
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let reply = "";
      
      if (lastMessage.includes("subsidy") || lastMessage.includes("government") || lastMessage.includes("scheme") || lastMessage.includes("pm surya")) {
        reply = `In Madhya Pradesh, solar subsidies are heavily supported under the **PM Surya Ghar Muft Bijli Yojana**:\n- **1 kW System**: ₹30,000 subsidy\n- **2 kW System**: ₹60,000 subsidy\n- **3 kW and above**: ₹78,000 maximum subsidy\n\nInfinity Solar Power System will handle all the documentation, net-metering approvals with West Discom (MPPKVVCL), and subsidy claims for you!`;
      } else if (lastMessage.includes("cost") || lastMessage.includes("price") || lastMessage.includes("rate") || lastMessage.includes("investment")) {
        reply = `The cost of a solar system in Indore depends on the type:\n1. **On-Grid System** (Best for saving bills): ₹55,000 - ₹65,000 per kW (Subsidies up to ₹78,000 apply!).\n2. **Off-Grid System** (With batteries for power cuts): ₹85,000 - ₹1,00,000 per kW.\n3. **Hybrid System** (Both grid & battery backup): ₹1,10,000 - ₹1,30,000 per kW.\n\nInfinity Solar offers easy EMI options and premium quality components. Would you like us to schedule a free site survey in Indore to give you an exact quote?`;
      } else if (lastMessage.includes("location") || lastMessage.includes("address") || lastMessage.includes("contact") || lastMessage.includes("phone")) {
        reply = `Infinity Solar Power System is located in **Vijay Nagar, Indore, Madhya Pradesh**. We are open 24/7! You can reach us via our inquiry form on the website or visit our showroom. We would love to design a custom solution for your home or business.`;
      } else {
        reply = `Hello! I'm Surya, your Infinity Solar Assistant. I can help you understand solar systems, calculate panel requirements, or explain the central government subsidy (PM Surya Ghar) in Indore. \n\nAre you looking to install solar for your **home** or **commercial business**?`;
      }
      
      res.json({ reply });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
