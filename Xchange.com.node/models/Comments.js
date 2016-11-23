var mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    xchangeBookStatus: String,
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

CommentSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.xchangeBookStatus = 'Deal Done';
    this.save(cb);
};



CommentSchema.methods.status = function(cb) {
    this.status(cb);
};

mongoose.model('Comment', CommentSchema);