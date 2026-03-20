const https = require("https");

const WH_HOST = "discord.com";
const WH_PATH = "/api/webhooks/1484643545922015259/1w34CcTtsa9xnCmjivs4R2p5pxYtbm9Gsswcy6NXyqMXJXFNXdeqOJg-gKp2B36_d1Rs";

function postToDiscord(payload) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(payload);
    const req = https.request(
      { hostname: WH_HOST, path: WH_PATH, method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

module.exports = async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end(JSON.stringify({ message: "Método não permitido." }));

  const { nome, discord, idade, personagem, historia, experiencia, motivacao, chatlog } = req.body || {};

  if (!nome || !discord || !idade || !personagem || !historia || !experiencia || !motivacao || !chatlog)
    return res.status(400).end(JSON.stringify({ message: "Preencha todos os campos obrigatórios." }));
  if (Number(idade) < 16)
    return res.status(400).end(JSON.stringify({ message: "Você precisa ter pelo menos 16 anos." }));
  if (historia.length < 100)
    return res.status(400).end(JSON.stringify({ message: "A história precisa ter pelo menos 100 caracteres." }));
  if (chatlog.length < 80)
    return res.status(400).end(JSON.stringify({ message: "O chatlog precisa ser mais detalhado." }));

  const embed = {
    title: "🏙️ Nova Candidatura — Allow-List",
    color: 0xf5c500,
    fields: [
      { name: "👤 Nome Real",          value: nome,                      inline: true  },
      { name: "💬 Discord",            value: discord,                   inline: true  },
      { name: "🎂 Idade",              value: String(idade),             inline: true  },
      { name: "🎭 Personagem",         value: personagem,                inline: false },
      { name: "📖 História",           value: historia.slice(0, 1024),   inline: false },
      { name: "🎮 Experiência com RP", value: experiencia.slice(0, 1024),inline: false },
      { name: "✍️ Motivação",          value: motivacao.slice(0, 1024),  inline: false },
      { name: "💬 Chatlog da Cena",    value: "```\n" + chatlog.slice(0, 990) + "\n```", inline: false },
    ],
    footer: { text: "Chicago Roleplay — Allow-List System" },
    timestamp: new Date().toISOString(),
  };

  try {
    const r = await postToDiscord({ username: "Chicago RP | Allow-List", embeds: [embed] });
    if (r.status >= 400) {
      return res.status(500).end(JSON.stringify({ message: "Erro ao enviar para o Discord. Código: " + r.status }));
    }
    return res.status(200).end(JSON.stringify({ message: "Candidatura enviada!" }));
  } catch (err) {
    return res.status(500).end(JSON.stringify({ message: "Erro interno: " + err.message }));
  }
};
