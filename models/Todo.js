var mongoose = require('mongoose');
var User = mongoose.model('User');

var TodoSchema = new mongoose.Schema({
  title: {type: String, required:true},
  desc: String,
  date: Date,
  isDone: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {timestamps: true});

TodoSchema.methods.toJSONFor = function(user){
  return {
    id:this._id,
    title: this.title,
    desc: this.desc,
    date: this.date,
    isdone: this.isdone,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: this.author.toProfileJSONFor(user)
  };
};

mongoose.model('Todo', TodoSchema);
