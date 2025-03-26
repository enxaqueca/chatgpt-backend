const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/perguntar", async (req, res) => {
  const pergunta = req.body.pergunta;
  if (!pergunta) {
    return res.status(400).json({ resposta: "Pergunta não recebida." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é uma IA médica criada pelo Dr. Alexandre Feldman para fornecer informações genéricas sobre efeitos colaterais de medicamentos e interações medicamentosas. Sempre deixe claro que a informação não substitui consulta médica.",
          },
          {
            role: "user",
            content: pergunta,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const resposta = response.data.choices[0].message.content;
    res.json({ resposta });
  } catch (error) {
    console.error("Erro na API da OpenAI:", error.response?.data || error.message);
    res.status(500).json({ resposta: "Erro ao consultar a IA. Tente novamente." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
