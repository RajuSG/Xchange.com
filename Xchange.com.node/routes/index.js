var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
//var User = mongoose.model('User');
//var passport = require('passport');
//var jwt = require('express-jwt');
//var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
      console.log('GET POSTS'+posts);
    if(err){
        console.log('GET POSTS: Error'+posts);
        return next(err);
    }

    res.json(posts);
  });
});

router.post('/posts',  function(req, res, next) {
  var post = new Post(req.body);
//    post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

/*router.get('/posts/:post', function(req, res) {
  res.json(req.post);
}); */

router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});

router.get('/search', function(req, res, next) {
    console.log("finding value of ISBN" + req.query.findText);
    var vSearchBy = '"'+req.query.searchBy+'"';

    console.log("searchy By"+ "vSearchBy");
    Post.find({ "ISBN" : { $regex : req.query.findText } } ,function(err, posts){
        console.log('ISBN results' + posts )
        if(err){
            console.log('ISBN Error results' + posts )
           return next(err);
        }
        res.json(posts);
    });
});

router.put('/posts/:post/upvote', function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.post('/posts/:post/comments',  function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
 //   comment.author = req.payload.username;

    comment.save(function(err, comment){
        if(err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err){ return next(err); }

            res.json(comment);
        });
    });
});

router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment){
        if (err) { return next(err); }
        if (!comment) { return next(new Error('can\'t find comment')); }

        req.comment = comment;
        return next();
    });
});

router.put('/posts/:post/comments/:comment/upvote',  function(req, res, next) {
    req.post.comment.upvote(function(err, post, comment){
        if (err) { return next(err); }

        res.json(post.comment);
    });
});


/*router.post('/register',  function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err){
        if(err){ return next(err); }

        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            console.log('Login'+user.generateJWT())
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
}); */

module.exports = router;
