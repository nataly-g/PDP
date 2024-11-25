import fs from 'fs';

export function Library(filePath) {
  let books = [];

  function getNewId(books) {
    return books.length === 0
      ? 1
      : Math.max(...books.map((book) => book.id)) + 1;
  }

  function getBooks() {
    const data = fs.readFileSync(filePath, 'utf8');
    books = JSON.parse(data);
  }

  function saveChanges() {
    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
  }

  function add(title, author, year, isAvailable = true) {
    const id = getNewId(books);
    const existingBook = books.find(
      (book) =>
        book.title.toLowerCase() === title.toLowerCase() &&
        book.author.toLowerCase() === author.toLowerCase()
    );

    if (existingBook) {
      console.log(
        `The book "${title}" by ${author} already exists in the library.`
      );
      return;
    }

    books.push({ id, title, author, year, isAvailable });
    console.log(`Added book: ${title} by ${author}`);
    saveChanges();
  }

  function list() {
    if (books.length === 0) {
      console.log('No books in the library.');
      return;
    }

    console.log('Listing all books:');
    books.forEach((book) => {
      console.log(
        `${book.id}: ${book.title} by ${book.author} (${book.year}) - ${
          book.isAvailable ? 'Available' : 'Not Available'
        }`
      );
    });
  }

  function search(searchValue) {
    const searchResults = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        book.author.toLowerCase().includes(searchValue.toLowerCase())
    );

    console.log(
      searchResults.length > 0
        ? `Found ${searchResults.length} book(s):`
        : `No books found for the search term "${searchValue}".`
    );

    searchResults.forEach((book) => {
      console.log(
        `${book.id}: ${book.title} by ${book.author} (${book.year}) - ${
          book.isAvailable ? 'Available' : 'Not Available'
        }`
      );
    });
  }

  function remove(identifier) {
    let removedBooks = [];

    if (typeof identifier === 'number') {
      const bookIndex = books.findIndex((book) => book.id === identifier);
      if (bookIndex !== -1) {
        removedBooks.push(books.splice(bookIndex, 1)[0]);
      }
    } else if (typeof identifier === 'string') {
      const searchTerm = identifier.toLowerCase().trim();
      removedBooks = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
      books = books.filter(
        (book) =>
          !book.title.toLowerCase().includes(searchTerm) &&
          !book.author.toLowerCase().includes(searchTerm)
      );
    }

    if (removedBooks.length > 0) {
      removedBooks.forEach((book) => {
        console.log(`Removed book: ${book.title} by ${book.author}`);
      });
      saveChanges();
    } else {
      console.log('No books found or identifier is invalid');
    }
  }

  function checkAvailability(identifier) {
    let booksFound = [];

    if (typeof identifier === 'number') {
      const book = books.find((book) => book.id === identifier);
      if (book) booksFound.push(book);
    } else if (typeof identifier === 'string') {
      const searchTerm = identifier.toLowerCase().trim();
      booksFound = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
    }

    if (booksFound.length) {
      booksFound.forEach((book) => {
        console.log(
          `${book.title} by ${book.author} is ${
            book.isAvailable ? 'available' : 'not available'
          }`
        );
      });
    } else {
      console.log('No books found for the given identifier.');
    }
  }

  getBooks();

  return {
    add,
    list,
    search,
    remove,
    checkAvailability,
  };
}
