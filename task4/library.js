import fs from "fs";
import path from "path";
import Book from "./book.js";
import { BookNotFoundError, DuplicateBookError, InvalidBookError, } from "./errors.js";
export default class Library {
    constructor() {
        this.books = [];
        this.filePath = path.resolve("./allBooks.json");
        this.loadBooks();
    }
    loadBooks() {
        try {
            const data = fs.readFileSync(this.filePath, "utf8");
            this.books = JSON.parse(data).map((book) => new Book(book.id, book.title, book.author, book.year, book.isAvailable));
        }
        catch (error) {
            console.error(`Error loading books: ${error}`);
        }
    }
    saveChanges() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.books, null, 2));
        }
        catch (error) {
            console.error(`Error writing file: ${error}`);
        }
    }
    getNewId() {
        return this.books.length === 0
            ? 1
            : Math.max(...this.books.map((book) => book.id)) + 1;
    }
    add(title, author, year, isAvailable = true) {
        if (!title || !author || !year) {
            throw new InvalidBookError("Title, author, and year are required fields.");
        }
        const existingBook = this.books.find((book) => book.title.toLowerCase() === title.toLowerCase() &&
            book.author.toLowerCase() === author.toLowerCase());
        if (existingBook) {
            throw new DuplicateBookError(`The book "${title}" by ${author} already exists.`);
        }
        const id = this.getNewId();
        const newBook = new Book(id, title, author, year, isAvailable);
        this.books.push(newBook);
        console.log(`Added book: ${title} by ${author}`);
        this.saveChanges();
    }
    remove(identifier) {
        let removedBooks = [];
        if (typeof identifier === "number") {
            const bookIndex = this.books.findIndex((book) => book.id === identifier);
            if (bookIndex !== -1) {
                removedBooks.push(this.books.splice(bookIndex, 1)[0]);
            }
            else {
                throw new BookNotFoundError(`Book with ID ${identifier} not found.`);
            }
        }
        else if (typeof identifier === "string") {
            const searchTerm = identifier.toLowerCase().trim();
            removedBooks = this.books.filter((book) => book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm));
            if (removedBooks.length === 0) {
                throw new BookNotFoundError(`No books found matching "${identifier}".`);
            }
            this.books = this.books.filter((book) => !book.title.toLowerCase().includes(searchTerm) &&
                !book.author.toLowerCase().includes(searchTerm));
        }
        removedBooks.forEach((book) => console.log(`Removed book: ${book.title} by ${book.author}`));
        this.saveChanges();
    }
    checkAvailability(identifier) {
        let booksFound = [];
        if (typeof identifier === "number") {
            const book = this.books.find((book) => book.id === identifier);
            if (book)
                booksFound.push(book);
        }
        else if (typeof identifier === "string") {
            const searchTerm = identifier.toLowerCase().trim();
            booksFound = this.books.filter((book) => book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm));
        }
        if (booksFound.length === 0) {
            throw new BookNotFoundError(`No books found for the given identifier: ${identifier}`);
        }
        booksFound.forEach((book) => {
            console.log(`${book.title} by ${book.author} is ${book.isAvailable ? "available" : "not available"}`);
        });
    }
}
