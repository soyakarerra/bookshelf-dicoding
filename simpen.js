// Button submit
document.addEventListener("DOMContentLoaded", function () {
    const inputBook = document.getElementById("inputBook");
    inputBook.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
    });
  });
  // Function tambah buku baru
  function addBook() {
    const generatedID = generateId();
    const BookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookComplete);
    books.push(BookObject);
  
    if (bookComplete == true) {
      const completeBookshelfList = document.getElementById("completeBookshelfList");
      const bookElement = createBookElement(BookObject);
      completeBookshelfList.appendChild(bookElement);
    } else {
      const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
      const bookElement = createBookElement(BookObject);
      incompleteBookshelfList.appendChild(bookElement);
    }
  
    // Reset input fields
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  function generateId() {
    return +new Date();
  }
  
  function generateBookObject(id, bookTitle, bookAuthor, bookYear, bookComplete) {
    return {
      id,
      bookTitle,
      bookAuthor,
      bookYear,
      bookComplete,
    };
  }
  
  const books = [];
  const RENDER_EVENT = "render-book";
  
  document.addEventListener(RENDER_EVENT, function () {
    console.log(JSON.stringify(books, null, 2));
  });
  
  // Pastikan elemen yang sesuai dengan id digunakan
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");
  
  function createBookElement(BookObject) {
    const book_item = document.createElement("article");
    book_item.classList.add("book-article");
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = BookObject.bookTitle;
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Penulis : " + BookObject.bookAuthor;
    const bookYear = document.createElement("p");
    bookYear.innerText = "Tahun : " + BookObject.bookYear;
  
    book_item.append(bookTitle);
    book_item.append(bookAuthor);
    book_item.append(bookYear);
  
    // Tambahkan tombol "Selesai Dibaca" atau "Belum Selesai di Baca" berdasarkan properti isComplete
    const toggleButton = document.createElement("button");
    if (BookObject.isComplete == true) {
      toggleButton.innerText = "Belum Selesai Dibaca";
      toggleButton.classList.add("green");
    } else {
      toggleButton.innerText = "Selesai Dibaca";
      toggleButton.classList.add("green");
    }
  
    toggleButton.addEventListener("click", () => moveBookToggleState(book_item, BookObject, toggleButton));
    book_item.appendChild(toggleButton);
  
    // Tambahkan tombol "Hapus Buku"
    const buttonHapus = document.createElement("button");
    buttonHapus.innerText = "Hapus Buku";
    buttonHapus.classList.add("red");
    buttonHapus.addEventListener("click", removeBook);
    book_item.appendChild(buttonHapus);
  
    return book_item;
  }
  
  function moveBookToggleState(bookElement, BookObject, toggleButton) {
    if (BookObject.isComplete) {
      // Pindahkan dari rak "Selesai dibaca" ke "Belum selesai dibaca"
      completeBookshelfList.removeChild(bookElement);
      incompleteBookshelfList.appendChild(bookElement);
      toggleButton.innerText = "Selesai Dibaca";
      toggleButton.classList.remove("green");
      toggleButton.classList.add("green");
    } else {
      // Pindahkan dari rak "Belum selesai dibaca" ke "Selesai dibaca"
      incompleteBookshelfList.removeChild(bookElement);
      completeBookshelfList.appendChild(bookElement);
      toggleButton.innerText = "Belum Selesai Dibaca";
      toggleButton.classList.remove("red");
      toggleButton.classList.add("green");
    }
    // Perbarui properti isComplete pada objek BookObject
    BookObject.isComplete = !BookObject.isComplete;
  }
  
  function removeBook(event) {
    event.target.parentElement.remove();
  }
  
  // Tambahkan event listener untuk form inputBook
  const inputBookForm = document.getElementById("inputBook");
  inputBookForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah halaman melakukan reload
    const inputTitle = document.getElementById("inputBookTitle");
    const inputAuthor = document.getElementById("inputBookAuthor");
    const inputYear = document.getElementById("inputBookYear");
    const isComplete = document.getElementById("inputBookIsComplete");
  
    // Buat objek buku dan panggil createBookElement
    const bookObject = {
      bookTitle: inputTitle.value,
      bookAuthor: inputAuthor.value,
      bookYear: inputYear.value,
      isComplete: isComplete.checked,
    };
  
    const bookElement = createBookElement(bookObject);
  
    if (bookObject.isComplete) {
      completeBookshelfList.appendChild(bookElement);
    } else {
      incompleteBookshelfList.appendChild(bookElement);
    }
  
    // Bersihkan input setelah menambahkan buku
    inputTitle.value = "";
    inputAuthor.value = "";
    inputYear.value = "";
    document.getElementById("inputBookIsComplete").checked = false;
  });
  
  function saveBooksToLocalStorage(books) {
    localStorage.setItem("myBooks", JSON.stringify(books));
  }
  
  function getBooksFromLocalStorage() {
    const storedBooks = localStorage.getItem("myBooks");
    return JSON.parse(storedBooks) || []; // Mengembalikan array kosong jika tidak ada data
  }
  