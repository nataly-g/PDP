import axios from 'axios';

const url = 'http://localhost:3000/books';

async function getBooks() {
	try {
		const response = await axios.get(url);
		console.log('All Books:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error getting books:', error.response ? error.response.data : error.message);
	}
}

async function createBook() {
	try {
		const response = await axios.post(url, {
			id: 333,
			title: 'The Hunger Games',
			author: 'Suzanne Collins',
			year: 2008,
			isAvailable: true,
		});
		console.log('Book created:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error creating book:', error.response ? error.response.data : error.message);
	}
}

async function updateBook(id, title) {
	try {
		const response = await axios.put(`${url}/${id}`, { title: title });
		console.log('Book Updated:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error updating book:', error.response ? error.response.data : error.message);
	}
}

async function deleteBook(id) {
	try {
		const response = await axios.delete(`${url}/${id}`);
		console.log('Deleted:', response.data);
	} catch (error) {
		console.error('Error deleting book:', error.response ? error.response.data : error.message);
	}
}

await createBook();
await getBooks();
await updateBook(1, 'The Hobbit 2');
await deleteBook(333);
