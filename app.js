const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use("/static", express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// mock data
var todoList = [
  { id: 1, title: "read a book" },
  { id: 2, title: "go shopping" },
  { id: 3, title: "working" },
];

// main screen
app.use("/main", (req, res) => {
  res.render("todo.ejs", { todoList });
});

// add new todo list
app.post("/add_todo", (req, res) => {
  var todo = req.body;

  // fail fast
  if (!todo) return res.status(400).json({ error: "todo not found" });

  todo.id = todoList.length + 1;

  todoList.push({ id: todo.id, title: todo.title });

  res.redirect("/main");
});

// edit screen
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  res.render("edit.ejs", { todoList, idTask: id });
});

// update todo
app.post("/update_todo", (req, res) => {
  var { title, id } = req.body;

  id = Number(id);

  // fail fast
  if (!title) return res.status(400).json({ error: "title not found" });
  if (!id) return res.status(400).json({ error: "id required" });
  if (isNaN(id))
    return res.status(400).json({ error: "id must be an integer" });

  var target = _.filter(todoList, (todo) => todo.id === id);

  if (!target.length) return res.status(404).json({ error: "todo not found" });

  var targetIdx = todoList.indexOf(target[0]);
  todoList[targetIdx] = { id, title };

  res.redirect("/main");
});

// delete todo
app.post("/delete", (req, res) => {
  var { id } = req.body;
  id = Number(id);
  var target = todoList.filter((todo) => todo.id === id)[0];

  if (!target) return res.status(400).json({ error: "todo not found" });

  todoList = todoList.filter((todo) => todo.id !== id);

  //update id when one is deleted
  for (var [i, todo] of todoList.entries()) {
    todo.id = i + 1;
  }

  res.redirect("/main");
});

app.listen(PORT, () => console.log(`Listening to port: ${PORT}`));
