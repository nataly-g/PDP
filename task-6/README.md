Steps to perform:

1. start the server using command 'node server.js'
2. run 'node client.js' command while server is still running

You can also open browser at http://localhost:3000/books when server is running to get all current books

CURL examples:

1. GET
   curl http://localhost:3000/books
2. POST
   curl -X POST http://localhost:3000/books -H "Content-Type: application/json" -d '{"name": "New Book"}'
3. PUT
   curl -X PUT http://localhost:3000/books/1 -H "Content-Type: application/json" -d '{"name": "Updated Book"}'
   (where 1 is the Id of the book you want to update)
4. DELETE
   curl -X DELETE http://localhost:3000/books/1
   (where 1 is the Id of the book)
5. To get 404 run curl http://localhost:3000/anything
