import { db } from "./firebase.js";
import {
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

// Fonction pour enregistrer la date et le terme de la recherche dans Firestore
async function enregistrerHistorique(terme) {
  try {
    const now = new Date();
    const dateRecherche = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    await addDoc(collection(db, "historique"), {
      terme,
      date: dateRecherche
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la recherche :", error);
  }
}

// Fonction pour ajouter un livre dans Firestore
async function ajouterLivre({ title, author, year, cover }) {
  try {
    await addDoc(collection(db, "livres"), {
      title,
      author,
      year,
      cover,
      createdAt: Date.now()
    });
    if (window.loadBooks) window.loadBooks(); 
    alert("📚 Livre ajouté à votre bibliothèque !");
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre :", error);
  }
}

searchButton.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const response = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`);
    const data = await response.json();

    searchResults.innerHTML = "";

    const topResults = data.docs.slice(0, 5); 
    topResults.forEach(book => {
      const title = book.title;
      const author = book.author_name?.join(", ") || "Auteur inconnu";
      const year = book.first_publish_year || "Année inconnue";
      const coverId = book.cover_i;
      const cover = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : "https://via.placeholder.com/80x120?text=No+Cover";

      const div = document.createElement("div");
      div.className = "search-book";
      div.innerHTML = `
        <img src="${cover}" alt="${title}" style="height:100px;"><br>
        <strong>${title}</strong><br>
        Auteur : ${author}<br>
        Année : ${year}<br>
        <button>📚 Ajouter à ma bibliothèque</button><br><br>
      `;

      div.querySelector("button").addEventListener("click", () => {
        ajouterLivre({ title, author, year, cover });
      });

      searchResults.appendChild(div);
    });

    await enregistrerHistorique(query);

  } catch (error) {
    console.error("Erreur lors de la recherche de livres :", error);
  }
});
