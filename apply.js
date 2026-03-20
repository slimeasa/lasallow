const https = require("https");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.status(200).end("{}");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).end(JSON.stringify({ ok: false, msg: "Metodo nao permitido" }));
    return;
  }

  // Pega o body — funciona com ou sem parse automático do Vercel
  let data = req.body;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch { data = {}; }
  }
  if (!data) data = {};

  const { nome, discord, idade, personagem, historia, experiencia, motivacao, chatlog } = data;

  if (!nome || !discord || !idade || !personagem || !historia || !experiencia || !motivacao || !chatlog) {
    res.status(400).end(JSON.stringify({ ok: false, msg: "Preencha todos os campos." }));
    return;
  }

  const embed = {
    title: "Nova Candidatura — Allow-List",
    color: 16042240,
    fields: [
      { name: "Nome Real",   value: String(nome),    inline: true },
      { name: "Discord",     value: String(discord), inline: true },
      { name: "Idade",       value: String(idade),   inline: true },
      { name: "Personagem",  value: String(personagem) },
      { name: "Historia",    value: String(historia).slice(0, 1024) },
      { name: "Experiencia", value: String(experiencia).slice(0, 1024) },
      { name: "Motivacao",   value: String(motivacao).slice(0, 1024) },
      { name: "Chatlog",     value: "```\n" + String(chatlog).slice(0, 990) + "\n```" },
    ],
    footer: { text: "Chicago Roleplay — Allow-List" },
    timestamp: new Date().toISOString(),
  };

  const body = JSON.stringify({ username: "Chicago RP", embeds: [embed] });

  await new Promise((resolve) => {
    const req2 = https.request({
      hostname: "discord.com",
      path: "/api/webhooks/1484680088820646060/q1_JsYzc-1ympYhjq07zL4VAoHqcDxFqqNJtrmgTMv7tIzt81uQcsOyyyjmGwpQhkRDC",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    }, (r) => {
      r.on("data", () => {});
      r.on("end", resolve);
    });
    req2.on("error", resolve);
    req2.write(body);
    req2.end();
  });

  res.status(200).end(JSON.stringify({ ok: true, msg: "Candidatura enviada!" }));
};
