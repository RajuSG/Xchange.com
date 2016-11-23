var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    bookAuthor: String,
    postedBy: String,
    ISBN: String,
    link: String,
    upvotes: {type: Number, default: 0},
    status: {type: String, default: "Buy"},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    interstedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

PostSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.status = 'Deal Done';
    this.save(cb);

};

PostSchema.methods.interstedPost = function(cb,x) {
    this.interstedPosts =x;
    this.save(cb);
};

mongoose.model('Post', PostSchema);