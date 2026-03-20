const WH = "https://discord.com/api/webhooks/1484633036036378796/61Z2qS_QHJ6Q3A7dUE1bns6eAMk5vKmbcIL__EysmnnDsmekvFs13J6wENKp_ooVD8Po";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ message: "Método não permitido." });

  const { nome, discord, idade, personagem, historia, experiencia, motivacao, chatlog } = req.body;

  if (!nome || !discord || !idade || !personagem || !historia || !experiencia || !motivacao || !chatlog)
    return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
  if (Number(idade) < 16)
    return res.status(400).json({ message: "Você precisa ter pelo menos 16 anos." });
  if (historia.length < 100)
    return res.status(400).json({ message: "A história precisa ter pelo menos 100 caracteres." });
  if (chatlog.length < 80)
    return res.status(400).json({ message: "O chatlog precisa ser mais detalhado." });

  const embed = {
    title: "🏙️ Nova Candidatura — Allow-List",
    color: 0xf5c500,
    fields: [
      { name: "👤 Nome Real",           value: nome,                      inline: true  },
      { name: "💬 Discord",             value: discord,                   inline: true  },
      { name: "🎂 Idade",               value: String(idade),             inline: true  },
      { name: "🎭 Personagem",          value: personagem,                inline: false },
      { name: "📖 História",            value: historia.slice(0, 1024),   inline: false },
      { name: "🎮 Experiência com RP",  value: experiencia.slice(0, 1024),inline: false },
      { name: "✍️ Motivação",           value: motivacao.slice(0, 1024),  inline: false },
      { name: "💬 Chatlog da Cena",     value: "```\n" + chatlog.slice(0, 990) + "\n```", inline: false },
    ],
    footer: { text: "Chicago Roleplay — Allow-List System" },
    timestamp: new Date().toISOString(),
  };

  try {
    const r = await fetch(WH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "Chicago RP | Allow-List", embeds: [embed] }),
    });
    if (!r.ok) {
      const txt = await r.text();
      console.error("Discord error:", txt);
      return res.status(500).json({ message: "Erro ao enviar para o Discord: " + txt });
    }
    return res.status(200).json({ message: "Candidatura enviada!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno: " + err.message });
  }
};
