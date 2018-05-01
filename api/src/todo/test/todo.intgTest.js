const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require("chai").expect;

process.env.TODO_DB_HOSTNAME='mongodb://localhost';
process.env.TODO_DB_NAME = 'todo_test';

const server = require('../../../server');
const should = chai.should();
const dbUtils = require('../../../lib/db.utils.js');
const dateUtils = require('../../../lib/date.utils.js');
const TIMEOUT = 3000;

chai.use(chaiHttp);

describe('Todo Route Intg. Test', function() {
  var today = new Date();
  var endOfToday = dateUtils.getEndOfDay(today);

  const dummyTodo = {
    name: 'Test Todo Name',
    description: 'test todo description',
    dueDate: today 
  }

  var tomorrow = new Date(today);
  tomorrow.setDate(today.getDate()+1);
  var endofTomorrow = dateUtils.getEndOfDay(tomorrow);

  var yesterday = new Date(today);
  yesterday.setDate(today.getDate()-1);
  var endOfYesterday = dateUtils.getEndOfDay(yesterday);

  var todayDueTodo;
  var yesterdayDueTodo;

  before(function(done) {
    this.timeout(TIMEOUT); 
    dbUtils.clearDB(() => {
      done();
    });
  });
  
  it('it should get all todos', function(done) {
    chai.request(server)
    .get('/api/todos')
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.deep.equal([]);
      done();
    });
  });

  it('it should create a todo due today', function(done) {
    chai.request(server)
    .post('/api/todos' )
    .send(dummyTodo)
    .end(function(err, res, body ) {
      res.should.have.status(200);
      todayDueTodo = res.body;
      expect(res.body).to.include({
        name: dummyTodo.name,
        description: dummyTodo.description,
        dueDate: endOfToday.toISOString(),
        status: 'PENDING'
      });
      done();
    });
  });

  it('it should get a todo by id', function(done) {
    chai.request(server)
    .get('/api/todos/' + todayDueTodo._id )
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.deep.equal(todayDueTodo);
      done();
    });
  });

  it('it should return completed todos', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { status: 'COMPLETED' } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0);
      done();
    });
  });

  it('it should return 1 pending todo', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { status: 'PENDING' } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.deep.equal(todayDueTodo);
      done();
    });
  });

  it('it should update todo status to completed', function(done) {
    chai.request(server)
    .put('/api/todos/' + todayDueTodo._id)
    .send({ status: 'COMPLETED' }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      todayDueTodo.status = res.body.status;
      expect(res.body).to.deep.equal({
        _id: todayDueTodo._id,
        name: todayDueTodo.name,
        description: todayDueTodo.description,
        dueDate: endOfToday.toISOString(),
        status: 'COMPLETED'
      });
      done();
    });
  });

  it('it should return completed todos after status update', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { status: 'COMPLETED' } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.deep.equal({
        _id: todayDueTodo._id, 
        name: todayDueTodo.name,
        description: todayDueTodo.description,
        dueDate: todayDueTodo.dueDate,
        status: 'COMPLETED'
      });
      done();
    });
  });

  it('it should return empty array of pending todos', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { status: 'PENDING' } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(0);
      done();
    });
  });

  it('it should create a todo due today', function(done) {
    todayDueTodo = {
      name: 'Today Todo Name',
      description: 'Today Todo description',
      dueDate: today
    }

    chai.request(server)
    .post('/api/todos' )
    .send(todayDueTodo)
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.include({
        name: todayDueTodo.name,
        description: todayDueTodo.description,
        dueDate: endOfToday.toISOString(),
        status: 'PENDING'
      });
      todayDueTodo = res.body;
      done();
    });
  });

  it('it should create a todo due tomorrow', function(done) {
    tomorrowDueTodo = {
      name: 'Tomorrow Todo Name',
      description: 'Tomorrow Todo description',
      dueDate: tomorrow
    }

    chai.request(server)
    .post('/api/todos' )
    .send(tomorrowDueTodo)
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.include({
        name: tomorrowDueTodo.name,
        description: tomorrowDueTodo.description,
        dueDate: endofTomorrow.toISOString(),
        status: 'PENDING'
      });
      tomorrowDueTodo = res.body;
      done();
    });
  });

  it('it should create a todo due yesterday', function(done) {
    yesterdayDueTodo = {
      name: 'Yesterday Todo Name',
      description: 'Yesterday Todo description',
      dueDate: yesterday
    }

    chai.request(server)
    .post('/api/todos' )
    .send(yesterdayDueTodo)
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.include({
        name: yesterdayDueTodo.name,
        description: yesterdayDueTodo.description,
        dueDate: endOfYesterday.toISOString(),
        status: 'PENDING'
      });
      yesterdayDueTodo = res.body;
      done();
    });
  });

  it('it should return todos due today', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { dueDate: { eq: today } } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.deep.equal(todayDueTodo);
      done();
    });
  });

  it('it should return todos due tomorrow', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { dueDate: { eq: tomorrow } } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.deep.equal(tomorrowDueTodo);
      done();
    });
  });

  it('it should return todos due yesterday', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { dueDate: { eq: yesterday } } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.deep.equal(yesterdayDueTodo);
      done();
    });
  });

  it('it should return upcoming pending todos', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { dueDate: { gt: today } } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.deep.equal(tomorrowDueTodo);
      done();
    });
  });

  it('it should return past due pending todos', function(done) {
    chai.request(server)
    .get('/api/todos/')
    .query({ filter: { dueDate: { lt: today } } }) 
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(1);
      expect(res.body[0]).to.deep.equal(yesterdayDueTodo);
      done();
    });
  });

  it('it should delete one todo by id', function(done) {
    chai.request(server)
    .delete('/api/todos/' + todayDueTodo._id)
    .end(function(err, res, body ) {
      res.should.have.status(200);
      done();
    });
  });

  it('it should return 3 todos after delete', function(done) {
    chai.request(server)
    .get('/api/todos')
    .end(function(err, res, body ) {
      res.should.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(3);
      done();
    });
  });
});
