export default class Book {
    id: number;

    title: string;

    author: string;

    year: number;

    isAvailable: boolean;

    constructor(
        id: number,
        title: string,
        author: string,
        year: number,
        isAvailable = true,
    ) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.isAvailable = isAvailable;
    }

    formatToReadable(): string {
        return `${this.id}: ${this.title} by ${this.author} (${this.year}) - ${
            this.isAvailable ? 'Available' : 'Not Available'
        }`;
    }
}
