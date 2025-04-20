const apiKey = "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";
const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  showMessage("Du", userMessage);
  input.value = "";

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Testa stabil modell
        messages: [
          { role: "system", content: "Du är en vänlig AI som svarar på frågor om Bibeln på svenska." },
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
    showMessage("Bibelstudion AI", aiReply);

  } catch (error) {
    console.error("Nätverks-/kodfel:", error);
    showMessage("Bibelstudion AI", "⚠️ Jag kunde tyvärr inte svara just nu. Kontrollera din API-nyckel eller internetanslutning.");
  }
});

function showMessage(sender, message, bg = "bg-gray-100") {
  const div = document.createElement("div");
  div.className = `p-3 rounded ${bg}`;
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
