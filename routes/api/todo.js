var router = require('express').Router();
var mongoose = require('mongoose');
var Todo = mongoose.model('Todo');
var auth = require('../auth');
var User = mongoose.model('User');

// return a list of todo
router.get('/', auth.required, function(req, res, next) {
    Todo.find({author:req.payload.id}).then(function(todos){
        return res.json({success: true, data: todos});
    }).catch(next);
});

//Todo by id
router.get('/:id', auth.required, function(req, res){
    console.log(res.payload);
  Todo.find({_id:req.params.id, author:req.payload.id}).then(function(todos){
    return res.json({success: true, data: todos});
    })
});

// Create a new todo
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    var todo = new Todo(req.body);

    todo.author = user;

    return todo.save().then(function(){
      return res.json({success: true, message: "Berhasil menyimpan Todo", data:todo.toJSONFor()});
    });
  }).catch(next);
});

// update todo
router.put('/:id', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
      let updTodo = {};
      if(typeof req.body.title !== 'undefined'){
        updTodo.title = req.body.title;
      }
      if(typeof req.body.title !== 'undefined'){
        updTodo.desc = req.body.desc;
      }
      if(typeof req.body.date !== 'undefined'){
        updTodo.date = req.body.date;
      }
      if(typeof req.body.isDone !== 'undefined'){
        updTodo.isDone = req.body.isDone;
      }
      
      Todo.findByIdAndUpdate(
        req.params.id,
        updTodo,
        {new:true}
        ).exec().then(function(todos){
          if (!todos) return res.status(404).json({success:false, message:'Todo Not Found'});
          return res.json({success:true, message: "Berhasil mengupdate Todo"});
      })
  });
});

router.put('/done/:id', auth.required, function(req, res, next) {
    User.findById(req.payload.id).then(function(user){
        let updTodo = {};
  
        updTodo.updatedBy = user;
        
        Todo.findByIdAndUpdate(
          req.params.id,
          {isDone:true},
          {new:true}
          ).exec().then(function(todos){
            if (!todos) return res.status(404).json({success:false, message:'Todo Not Found'});
            return res.json({success:true, message: "Berhasil menyelesaikan Todo"});
        })
    });
  });

// delete todo
router.delete('/:id', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if (!user) { return res.sendStatus(401); }

    Todo.findByIdAndRemove(req.params.id).exec().then(function(todos){
      return res.status(204).json({success:true, message: "Behasil menghapus todo"});
    })
  }).catch(next);
});

module.exports = router;
