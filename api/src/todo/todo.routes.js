const express = require('express');
const router = express();
const httpCodes = require('http-codes');
const todoController = require( './todo.controller.js' );

function handleError(error, httpResponse) {
  console.error(error);
  httpResponse.status(error.code || httpCodes.INTERNAL_SERVER_ERROR);
  httpResponse.json({
    error: error
  });
}

router.get('/todos', (req, res) => {
  const filter = req.query.filter || {};

  return todoController.getTodos(filter).
  then(todos => {
    res.json(todos);
  }).catch(err => handleError(err,res));
});

router.post('/todos', (req, res) => {
  const todo = req.body;

  return todoController.createTodo(todo).
  then(todo => {
    res.json(todo);
  }).catch(err => handleError(err,res));
});

router.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  return todoController.getTodoById(id).
  then(todo => {
    res.json(todo);
  }).catch(err => handleError(err,res));
});

router.put('/todos/:id', (req, res) => {
  const id = req.params.id;
  const todo = req.body;

  return todoController.updateTodo(id, todo).
  then(todo => {
    res.json(todo);
  }).catch(err => handleError(err,res));
});

router.delete( '/todos/:id', (req, res) => {
  const id = req.params.id;

  return todoController.deleteTodo(id).
  then(todo => {
    res.json(todo);
  }).catch(err => handleError(err,res));
});

module.exports.router = router;