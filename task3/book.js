export default class Book {
    constructor(id, title, author, year, isAvailable = true) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.isAvailable = isAvailable;
    }
    formatToReadable() {
        return `${this.id}: ${this.title} by ${this.author} (${this.year}) - ${this.isAvailable ? 'Available' : 'Not Available'}`;
    }
}
