export class BookNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookNotFoundError";
  }
}

export class DuplicateBookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateBookError";
  }
}

export class InvalidBookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBookError";
  }
}
