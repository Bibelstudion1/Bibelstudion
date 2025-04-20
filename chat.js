const apiKey = "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";
const chat = document.getElementById("chat");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const welcomeMessage = document.getElementById("welcome-message");

// Lägg till händelselyssnare för förslagsknapparna
document.querySelectorAll('#welcome-message button').forEach(button => {
  button.addEventListener('click', (e) => {
    input.value = e.target.textContent.trim();
    input.focus();
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Dölj välkomstmeddelandet efter första frågan
  if (welcomeMessage) {
    welcomeMessage.style.display = 'none';
  }

  showMessage("user", userMessage);
  input.value = "";

  // Visa "skriver..."-indikator
  const typingIndicator = showTypingIndicator();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://bibelstudion.se",  // Krävs av OpenRouter
        "X-Title": "Bibelstudion AI"                // Krävs av OpenRouter
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "Du är en vänlig och kunnig AI som svarar på frågor om Bibeln, Gud och kristen tro på svenska. " +
                     "Var bibliskt korrekt, använd relevanta bibelverser och förklara på ett pedagogiskt sätt. " +
                     "Var ödmjuk och erkänn när du inte vet något säkert."
          },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7  // Balans mellan kreativitet och noggrannhet
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("API-fel:", errData);
      throw new Error(errData.error?.message || "Ett fel uppstod när API kontaktades.");
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "Jag kunde inte generera ett svar just nu.";
    removeTypingIndicator(typingIndicator);
    showMessage("ai", aiReply);

  } catch (error) {
    console.error("Nätverks-/kodfel:", error);
    removeTypingIndicator(typingIndicator);
    showMessage("ai", "⚠️ Ett fel uppstod: " + error.message);
  }
});

function showMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message-animation ${sender === 'user' ? 'ml-8' : 'mr-8'}`;
  
  messageDiv.innerHTML = `
    <div class="flex items-start ${sender === 'user' ? 'justify-end' : ''}">
      ${sender === 'ai' ? `
        <div class="bg-blue-100 p-2 rounded-full mr-3">
          <i class="fas fa-robot text-blue-600"></i>
        </div>
      ` : ''}
      
      <div class="${sender === 'user' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-gray-700'} rounded-lg p-3 max-w-[80%]">
        ${message}
      </div>
      
      ${sender === 'user' ? `
        <div class="bg-gray-200 p-2 rounded-full ml-3">
          <i class="fas fa-user text-gray-600"></i>
        </div>
      ` : ''}
    </div>
  `;
  
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
}

function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.id = "typing-indicator";
  typingDiv.className = "message-animation mr-8";
  typingDiv.innerHTML = `
    <div class="flex items-start">
      <div class="bg-blue-100 p-2 rounded-full mr-3">
        <i class="fas fa-robot text-blue-600"></i>
      </div>
      <div class="bg-blue-50 rounded-lg p-3 max-w-[80%]">
        <p class="typing">Skriver svar</p>
      </div>
    </div>
  `;
  chat.appendChild(typingDiv);
  chat.scrollTop = chat.scrollHeight;
  return typingDiv;
}

function removeTypingIndicator(typingIndicator) {
  if (typingIndicator && typingIndicator.parentNode) {
    typingIndicator.remove();
  }
}