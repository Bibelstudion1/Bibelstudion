const apiKey = "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";
const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const loading = document.getElementById("loading");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  showMessage("Du", userMessage);
  input.value = "";

  // Visa laddningsindikator
  loading.classList.remove("hidden");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          { 
            role: "system", 
            content: "Svar på alla frågor om Bibeln, tro, livet, människan, Gud, och samhället. Svara på djupare existentiella frågor relaterade till kristendom." 
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("API-fel:", errData);
      throw new Error(errData.error?.message || "Ett fel uppstod när API kontaktades.");
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "Inget svar från AI:n.";

    // Visa svaret från AI
    showMessage("Bibelstudion AI", aiReply);

  } catch (error) {
    console.error("Nätverks-/kodfel:", error);
    showMessage("Bibelstudion AI", "⚠️ Jag kunde tyvärr inte svara just nu. Kontrollera din API-nyckel eller internetanslutning.");
  } finally {
    // Dölja laddningsindikator när svaret kommer
    loading.classList.add("hidden");
  }
});

function showMessage(sender, message, bg = "bg-gray-100") {
  const div = document.createElement("div");
  div.className = `p-3 rounded ${bg}`;
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
