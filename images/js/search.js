// search.js – Bibelstudion sökfunktion

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchBtn");
  
    // Falsk databas med artiklar – du kan lägga till fler
    const articles = [
      { title: "Skapelsen i 1 Mosebok", path: "articles/genesis-1.html" },
      { title: "Johannes 3:16 – Guds kärlek", path: "articles/john-3-16.html" },
      { title: "Vad är Bibeln?", path: "articles/what-is-the-bible.html" },
      { title: "Så förlåter Gud", path: "articles/god-forgiveness.html" }
    ];
  
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim().toLowerCase();
      const resultsBox = document.getElementById("searchResults");
  
      resultsBox.innerHTML = ""; // Rensa gamla resultat
  
      if (query.length === 0) {
        resultsBox.innerHTML = "<p>Fyll i något att söka efter!</p>";
        return;
      }
  
      const results = articles.filter(article =>
        article.title.toLowerCase().includes(query)
      );
  
      if (results.length > 0) {
        results.forEach(article => {
          const link = document.createElement("a");
          link.href = article.path;
          link.textContent = article.title;
          link.classList.add("search-result-link");
          resultsBox.appendChild(link);
        });
      } else {
        resultsBox.innerHTML = "<p>Inga artiklar matchar din sökning.</p>";
      }
    });
  });
  