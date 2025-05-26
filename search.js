import { db } from "./firebase.js";
import {
  addDoc,
  collection
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

searchButton.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;

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
    div.innerHTML = `<br>
      <img src="${cover}" alt="${title}" style="height:100px;"><br>
      <strong>${title}</strong><br>
      Auteur : ${author}<br>
      Année : ${year}<br>
      <button>📚 Ajouter à ma bibliothèque</button>
      <br>
    `;

    div.querySelector("button").addEventListener("click", async () => {
      await addDoc(collection(db, "livres"), {
        title,
        author,
        year,
        cover,
        createdAt: Date.now()
      });
      window.loadBooks();
      alert("Livre ajouté !");
    });

    searchResults.appendChild(div);
  });
});
