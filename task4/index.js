import Library from "./library.js";
import { DuplicateBookError, BookNotFoundError, InvalidBookError, } from "./errors.js";
const library = new Library();
// 1 - duplicate book
try {
    library.add("The Book Thief", "Markus Zusak", 2005);
}
catch (error) {
    if (error instanceof DuplicateBookError) {
        console.error(`Duplicate Error: ${error.message}`);
    }
    else if (error instanceof InvalidBookError) {
        console.error(`Invalid Book Error: ${error.message}`);
    }
    else {
        console.error(`An unknown error occurred.`);
    }
}
// 2 - invalid book
try {
    library.add("", "J.R.R. Tolkien", 1965);
}
catch (error) {
    if (error instanceof InvalidBookError) {
        console.error(`Invalid Book Error: ${error.message}`);
    }
    else {
        console.error(`An unknown error occurred.`);
    }
}
// 3 - non-existing book
try {
    library.remove("Non-existing book, anonymous author");
}
catch (error) {
    if (error instanceof InvalidBookError) {
        console.error(`Invalid Book Error: ${error.message}`);
    }
    else if (error instanceof BookNotFoundError) {
        console.error(`Book not found Error: ${error.message}`);
    }
    else {
        console.error(`An unknown error occurred.`);
    }
}
// 4 - non-existing book id
try {
    library.checkAvailability(1500);
}
catch (error) {
    if (error instanceof InvalidBookError) {
        console.error(`Invalid Book Error: ${error.message}`);
    }
    else if (error instanceof BookNotFoundError) {
        console.error(`Book not found Error: ${error.message}`);
    }
    else {
        console.error(`An unknown error occurred.`);
    }
}
