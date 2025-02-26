import {
  db,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "./firebase.js";

const bookTitle = document.getElementById("book-title");
const authorName = document.getElementById("author-name");
const bookRating = document.getElementById("book-rating");
const bookNote = document.getElementById("book-note");
const addBookBtn = document.getElementById("add-book-btn");
const updateBookBtn = document.getElementById("update-book-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const bookList = document.getElementById("book-list");
const searchAuthor = document.getElementById("search-author");

let editingBookId = null;

// Ensure rating is between 1 and 5
bookRating.addEventListener("input", () => {
  if (bookRating.value > 5) {
    alert("Rating cannot be more than 5!");
    bookRating.value = "";
  }
});

// Function to load books from Firestore
async function loadBooks() {
  bookList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "books"));
  let books = [];

  querySnapshot.forEach((doc) => {
    const book = doc.data();
    book.id = doc.id;
    books.push(book);
  });

  displayBooks(books);

  // Attach event listeners
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => editBook(e.target.dataset.id));
  });

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => deleteBook(e.target.dataset.id));
  });
}

// Display books based on the search term
function displayBooks(books) {
  const searchTerm = searchAuthor.value.toLowerCase(); // Get the search term

  books.forEach((book) => {
    if (book.author.toLowerCase().includes(searchTerm)) {
      // Filter by author
      const bookItem = document.createElement("li");
      bookItem.classList.add("book-item");

      bookItem.innerHTML = `
                <div class="book-content">
                    <p><strong>Book Title:</strong> ${book.title}</p>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Rating:</strong> ${book.rating}/5</p>
                    <p><strong>Notes:</strong> ${book.note}</p>
                </div>
                <div class="book-actions">
                    <button class="edit-btn" data-id="${book.id}">Edit</button>
                    <button class="delete-btn" data-id="${book.id}">Delete</button>
                </div>
            `;

      bookList.appendChild(bookItem);
    }
  });
}

// Event listener for the search input
searchAuthor.addEventListener("input", () => {
  loadBooks();
});

// Add a new book
addBookBtn.addEventListener("click", async () => {
  const title = bookTitle.value.trim();
  const author = authorName.value.trim();
  const rating = parseInt(bookRating.value);
  const note = bookNote.value.trim();

  if (title && author && rating && note) {
    if (rating > 5) {
      alert("Rating cannot be more than 5!");
      return;
    }
    if (rating < 1) {
      alert("Rating must be at least 1!");
      return;
    }

    await addDoc(collection(db, "books"), { title, author, rating, note });
    clearForm();
    loadBooks();
  }
});

// Edit book
async function editBook(id) {
  const bookRef = doc(db, "books", id);
  const bookSnapshot = await getDocs(collection(db, "books"));

  bookSnapshot.forEach((doc) => {
    if (doc.id === id) {
      const book = doc.data();
      bookTitle.value = book.title;
      authorName.value = book.author;
      bookRating.value = book.rating;
      bookNote.value = book.note;
      editingBookId = id;

      addBookBtn.style.display = "none";
      updateBookBtn.style.display = "inline-block";
      cancelEditBtn.style.display = "inline-block";
    }
  });
}

// Update book
updateBookBtn.addEventListener("click", async () => {
  if (editingBookId) {
    const bookRef = doc(db, "books", editingBookId);
    const rating = parseInt(bookRating.value);

    if (rating > 5) {
      alert("Rating cannot be more than 5!");
      return;
    }
    if (rating < 1) {
      alert("Rating must be at least 1!");
      return;
    }

    await updateDoc(bookRef, {
      title: bookTitle.value,
      author: authorName.value,
      rating: rating,
      note: bookNote.value,
    });

    editingBookId = null;
    clearForm();
    loadBooks();
  }
});

// Cancel edit mode
cancelEditBtn.addEventListener("click", () => {
  editingBookId = null;
  clearForm();
});

// Delete book
async function deleteBook(id) {
  await deleteDoc(doc(db, "books", id));
  loadBooks();
}

// Clear input fields
function clearForm() {
  bookTitle.value = "";
  authorName.value = "";
  bookRating.value = "";
  bookNote.value = "";

  addBookBtn.style.display = "inline-block";
  updateBookBtn.style.display = "none";
  cancelEditBtn.style.display = "none";
}

// Load books on page load
loadBooks();
