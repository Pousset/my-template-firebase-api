import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const titleInput = document.getElementById("titleInput");
const authorInput = document.getElementById("authorInput");
const addButton = document.getElementById("addButton");
const bookList = document.getElementById("bookList");

addButton.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  if (!title || !author) {
    alert("Merci de remplir tous les champs !");
    return;
  }

  const docRef = await addDoc(collection(db, "livres"), {
    title,
    author,
    createdAt: Date.now()
  });

  console.log("Document ajouté avec l'ID :", docRef.id);
  titleInput.value = "";
  authorInput.value = "";
  loadBooks();
});

async function loadBooks() {
  const querySnapshot = await getDocs(collection(db, "livres"));
  bookList.innerHTML = "";
  

  querySnapshot.forEach(docSnap => {
    const book = docSnap.data();
    const li = document.createElement("li");
    li.innerHTML = `
    
      <strong>${book.title}</strong> par ${book.author}
      <button onclick="deleteBook('${docSnap.id}')">🗑️</button>
      
    `;
    bookList.appendChild(li);
    
  });
}

window.deleteBook = async function(id) {
  await deleteDoc(doc(db, "livres", id));
  loadBooks();
};

window.loadBooks = loadBooks;
loadBooks();
