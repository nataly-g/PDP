import fs from "fs";
import path from "path";
import Book from "./book.js";
import {
  BookNotFoundError,
  DuplicateBookError,
  InvalidBookError,
} from "./errors.js";

export default class Library {
  private books: Book[] = [];
  private filePath: string;

  constructor() {
    this.filePath = path.resolve("./allBooks.json");
    this.loadBooksAsync();
  }

  //created two following functions to simulate some external calls that need waiting for
  private async getDetailsFromAPI(book: Book): Promise<string> {
    console.log(`Getting details for book: ${book.title}...`);

    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const additionalDetails = {
          genre: "Non-Fiction",
          rating: 4,
        };
        if (!book.title || !book.author) {
          reject(new Error("Invalid book data, could not fetch details"));
        }
        resolve(
          `Details received for ${book.title}: Genre - ${additionalDetails.genre}, Rating - ${additionalDetails.rating}`
        );
      }, 2000);
    });
  }

  private async sendDetailsToExternalResource(
    book: Book,
    details: string
  ): Promise<void> {
    console.log(`Sending details for: ${book.title}...`);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Details have been sent: ${details}`);
        resolve();
      }, 1500);
    });
  }

  //made existing functions async to handle asynchronous operations (renamed them to ...Async for this task specifically)
  //added try-catch to handle errors

  private async loadBooksAsync(): Promise<void> {
    try {
      const data = await fs.promises.readFile(this.filePath, "utf8");

      try {
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
        console.error(`Failed to parse JSON:: ${error}`);
      }
    } catch (error) {
      console.error(`Error loading books: ${error}`);
    }
  }

  private async saveChangesAsync(): Promise<void> {
    try {
      await fs.promises.writeFile(
        this.filePath,
        JSON.stringify(this.books, null, 2)
      );
    } catch (error) {
      console.error(`Error writing file: ${error}`);
    }
  }

  private getNewId(): number {
    return this.books.length === 0
      ? 1
      : Math.max(...this.books.map((book) => book.id)) + 1;
  }

  async addAsync(
    title: string,
    author: string,
    year: number,
    isAvailable = true
  ): Promise<void> {
    try {
      if (!title || !author || !year) {
        throw new InvalidBookError(
          "Title, author, and year are required fields."
        );
      }

      const existingBook = this.books.find(
        (book) =>
          book.title.toLowerCase() === title.toLowerCase() &&
          book.author.toLowerCase() === author.toLowerCase()
      );

      if (existingBook) {
        throw new DuplicateBookError(
          `The book "${title}" by ${author} already exists.`
        );
      }

      const id = this.getNewId();
      const newBook = new Book(id, title, author, year, isAvailable);
      this.books.push(newBook);
      console.log(`Added book: ${title} by ${author}`);
      const detailsMessage = await this.getDetailsFromAPI(newBook);
      await this.sendDetailsToExternalResource(newBook, detailsMessage);
      await this.saveChangesAsync();
    } catch (error) {
      console.error(`Error adding book: ${String(error)}`);
    }
  }

  async removeAsync(identifier: number | string): Promise<void> {
    try {
      let removedBooks: Book[] = [];

      if (typeof identifier === "number") {
        const bookIndex = this.books.findIndex(
          (book) => book.id === identifier
        );
        if (bookIndex === -1) {
          throw new BookNotFoundError(`Book with ID ${identifier} not found.`);
        }
      } else if (typeof identifier === "string") {
        const searchTerm = identifier.toLowerCase().trim();
        removedBooks = this.books.filter(
          (book) =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );

        if (removedBooks.length === 0) {
          throw new BookNotFoundError(
            `No books found matching "${identifier}".`
          );
        }

        this.books = this.books.filter(
          (book) =>
            !book.title.toLowerCase().includes(searchTerm) &&
            !book.author.toLowerCase().includes(searchTerm)
        );
      }

      removedBooks.forEach((book) =>
        console.log(`Removed book: ${book.title} by ${book.author}`)
      );
      await this.saveChangesAsync();
    } catch (error) {
      console.error(`Error removing book: ${String(error)}`);
    }
  }

  async checkAvailabilityAsync(identifier: number | string): Promise<void> {
    try {
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

      if (booksFound.length === 0) {
        throw new BookNotFoundError(
          `No books found for identifier: "${identifier}"`
        );
      }

      for (const book of booksFound) {
        const detailsMessage = await this.getDetailsFromAPI(book);
        await this.sendDetailsToExternalResource(book, detailsMessage);
        console.log(
          `${book.title} by ${book.author} is ${
            book.isAvailable ? "available" : "not available"
          }`
        );
      }
    } catch (error) {
      console.error(`Error checking availability: ${String(error)}`);
    }
  }

  //re-made the checkAvailability to use promises (but the approach above is more modern and best practice)

  async checkAvailabilityAsyncPromise(
    identifier: number | string
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
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

      if (booksFound.length === 0) {
        return reject(
          new BookNotFoundError(
            `No books found for identifier: "${identifier}"`
          )
        );
      }

      return resolve(
        booksFound.map(
          (book) =>
            `${book.title} by ${book.author} is ${
              book.isAvailable ? "available" : "not available"
            }`
        )
      );
    });
  }

  // add a function to fetch books that uses a callback to handle results and errors and uses promises

  async fetchBooksAsync(): Promise<void> {
    try {
      await this.loadBooksAsync();
      console.log("Fetched books first way:", this.books);
    } catch (error) {
      console.error(`Failed to fetch books: ${String(error)}`);
    }
  }

  // with callback:
  async fetchBooksAsync2(callback: Function): Promise<void> {
    try {
      await this.loadBooksAsync();
      callback(null, this.books);
    } catch (error) {
      callback(error);
    }
  }
}
