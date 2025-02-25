import Library from "./library.js";
import Book from "./book.js";

const library = new Library();

await library.addAsync("The Book Thief", "Markus Zusak", 2005);

await library.removeAsync("Non-existing book, anonymous author");

await library.checkAvailabilityAsync(1500);

await library.checkAvailabilityAsync("Larsson");

await library.checkAvailabilityAsyncPromise("Larsson");

await library.fetchBooksAsync();

await library.fetchBooksAsync2((error: Error | null, books: Book[] | null) => {
  if (error) {
    console.error("Error fetching books:", error.message);
  } else {
    console.log("Fetched books second way:", books);
  }
});
