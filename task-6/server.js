import http from 'http';

let books = [
	{
		id: 1,
		title: 'The Hobbit',
		author: 'J.R.R. Tolkien',
		year: 1937,
		isAvailable: true,
	},
];

const server = http.createServer((request, response) => {
	const { method, url } = request;

	if (method === 'GET' && url === '/books') {
		response.writeHead(200, { 'Content-Type': 'application/json' });
		response.end(JSON.stringify(books));
		return;
	}

	if (method === 'POST' && url === '/books') {
		let body = '';
		request.on('data', chunk => (body += chunk));
		request.on('end', () => {
			const newBook = { id: books.length + 1, ...JSON.parse(body) };
			books.push(newBook);
			response.writeHead(201, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(newBook));
		});
		return;
	}

	if (method === 'PUT' && url.startsWith('/books/')) {
		const id = parseInt(url.split('/')[2]);
		let body = '';
		request.on('data', chunk => (body += chunk));
		request.on('end', () => {
			const book = books.find(i => i.id === id);
			if (!book) {
				response.writeHead(404, { 'Content-Type': 'application/json' });
				response.end(JSON.stringify({ error: 'Book not found' }));
				return;
			}
			Object.assign(book, JSON.parse(body));
			response.writeHead(200, { 'Content-Type': 'application/json' });
			response.end(JSON.stringify(book));
		});
		return;
	}

	if (method === 'DELETE' && url.startsWith('/books')) {
		const id = parseInt(url.split('/')[2]);
		books = books.filter(i => i.id !== id);
		response.writeHead(200, { 'Content-Type': 'application/json' });
		response.end(JSON.stringify({ message: 'Book deleted successfully' }));
		return;
	}

	response.writeHead(404, { 'Content-Type': 'text/plain' });
	response.end('404 Not Found');
});

server.listen(3000, () => {
	console.log('Server running at http://localhost:3000/');
});
