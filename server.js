// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

// configure bodyParser (for receiving form and JSON data)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

// our database is an array for now with some hardcoded values
var todos = [
  { _id: 1, task: 'Laundry', description: 'Wash clothes' },
  { _id: 2, task: 'Grocery Shopping', description: 'Buy dinner for this week' },
  { _id: 3, task: 'Homework', description: 'Make this app super awesome!' }
];

let idCount = 3; // Keep track of current unique _id

function Todo(task, description, id=(++idCount)){ // constructor
  // return {
  //   task: task,
  //   description: description,
  //   _id: id
  // };
  this.task = task;
  this.description = description;
  this._id = id;
}

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/search', (req, res) => {
  console.log('Search route hit');
  res.sendFile(__dirname + '/views/search.html');
});


/*
 * JSON API Endpoints
 *
 * The comments below give you an idea of the expected functionality
 * that you need to build. These are basic descriptions, for more
 * specifications, see the todosTest.js file and the outputs of running
 * the tests to see the exact details. BUILD THE FUNCTIONALITY IN THE
 * ORDER THAT THE TESTS DICTATE.
 */

app.get('/api/todos/search', function search(req, res) {
  /* This endpoint responds with the search results from the
   * query in the request. COMPLETE THIS ENDPOINT LAST.
   */
  let searchArr = todos.filter((todo) => {
    return todo.task.includes(req.query.q);
  });
  res.json({todos: searchArr});
});

app.get('/api/todos', function index(req, res) {
  /* This endpoint responds with all of the todos
   */
  res.json({todos: todos});
});

app.post('/api/todos', function create(req, res) {
  /* This endpoint will add a todo to our "database"
   * and respond with the newly created todo.
   */
  const newTodo = new Todo(req.body.task, req.body.description);
  todos.push(newTodo);
  console.log(newTodo);
  res.json(newTodo);
});

app.get('/api/todos/:id', function show(req, res) {
  /* This endpoint will return a single todo with the
   * id specified in the route parameter (:id)
   */
  res.json(todos.find((todo) => (todo._id == req.params.id)));
});

app.put('/api/todos/:id', function update(req, res) {
  /* This endpoint will update a single todo with the
   * id specified in the route parameter (:id) and respond
   * with the newly updated todo.
   */
  let updated = {};
  todos = todos.map((todo) => {
    if (todo._id == req.params.id) {
      todo.task = req.body.task;
      todo.description = req.body.description;
      updated = todo;
    }
    return todo;
  });

  res.json(updated);
});

app.delete('/api/todos/:id', function destroy(req, res) {
  /* This endpoint will delete a single todo with the
   * id specified in the route parameter (:id) and respond
   * with deleted todo.
   */
  let deleted = {}; // save which item was deleted
  todos = todos.filter((todo) => {
    if (todo._id == req.params.id) deleted = todo;
    return todo._id != req.params.id;
  });
  res.json(deleted);
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});
