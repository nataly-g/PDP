import { Library } from './bookManagerMethodsUsingFunctions.js';

const myLibrary = Library('./allBooks.json');

//adding
myLibrary.add('A Little Life', 'Hanya Yanagihara', 2015);
myLibrary.add('Shantaram', 'Gregory David Roberts', 2003);

//listing
myLibrary.list();

//searching
myLibrary.search('life');
myLibrary.search('Tolkien');

//removing
myLibrary.remove('Yanagihara');

//checking availability
myLibrary.checkAvailability('Harry Potter');
myLibrary.checkAvailability('Tolkien');
