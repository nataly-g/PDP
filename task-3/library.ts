import fs from "fs";
import path from "path";
import Book from "./book.js";

export default class Library {
  private books: Book[] = [];

  private filePath: string;

  constructor() {
    this.filePath = path.resolve("./task3/allBooks.json");
    this.loadBooks();
  }

  private loadBooks(): void {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      this.books = JSON.parse(data).map(
        (book: Book) =>
          new Book(
            book.id,
            book.title,
            book.author,
            book.year,
            book.isAvailable
          )
      );
    } catch (error) {
      console.error(`Error loading books: ${error}`);
    }
  }

  private saveChanges(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.books, null, 2));
    } catch (error) {
      console.error(`Error writing file: ${error}`);
    }
  }

  private getNewId(): number {
    return this.books.length === 0
      ? 1
      : Math.max(...this.books.map((book) => book.id)) + 1;
  }

  add(title: string, author: string, year: number, isAvailable = true): void {
    const id = this.getNewId();
    const existingBook = this.books.find(
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

    const newBook = new Book(id, title, author, year, isAvailable);
    this.books.push(newBook);
    console.log(`Added book: ${title} by ${author}`);
    this.saveChanges();
  }

  list(): void {
    if (this.books.length === 0) {
      console.log("No books in the library.");
      return;
    }

    console.log("Listing all books:");
    this.books.forEach((book) => console.log(book.formatToReadable()));
  }

  search(searchValue: string): void {
    const searchResults = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        book.author.toLowerCase().includes(searchValue.toLowerCase())
    );

    console.log(
      searchResults.length > 0
        ? `Found ${searchResults.length} book(s):`
        : `No books found for the search term "${searchValue}".`
    );

    searchResults.forEach((book) => console.log(book.formatToReadable()));
  }

  remove(identifier: number | string): void {
    let removedBooks: Book[] = [];

    if (typeof identifier === "number") {
      const bookIndex = this.books.findIndex((book) => book.id === identifier);
      if (bookIndex !== -1) {
        removedBooks.push(this.books.splice(bookIndex, 1)[0]);
      }
    } else if (typeof identifier === "string") {
      const searchTerm = identifier.toLowerCase().trim();
      removedBooks = this.books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
      this.books = this.books.filter(
        (book) =>
          !book.title.toLowerCase().includes(searchTerm) &&
          !book.author.toLowerCase().includes(searchTerm)
      );
    }

    if (removedBooks.length > 0) {
      removedBooks.forEach((book) =>
        console.log(`Removed book: ${book.title} by ${book.author}`)
      );
      this.saveChanges();
    } else {
      console.log("No books found or identifier is invalid");
    }
  }

  checkAvailability(identifier: number | string): void {
    let booksFound: Book[] = [];

    if (typeof identifier === "number") {
      const book = this.books.find((book) => book.id === identifier);
      if (book) booksFound.push(book);
    } else if (typeof identifier === "string") {
      const searchTerm = identifier.toLowerCase().trim();
      booksFound = this.books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      );
    }

    if (booksFound.length > 0) {
      booksFound.forEach((book) => {
        console.log(
          `${book.title} by ${book.author} is ${
            book.isAvailable ? "available" : "not available"
          }`
        );
      });
    } else {
      console.log("No books found for the given identifier.");
    }
  }
}
