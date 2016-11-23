var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var passport = require('passport');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});


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

router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);
  post.postedBy = req.payload.username;

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

router.param('user', function(req, res, next, id) {


    var query = User.findById(id);

    query.exec(function (err, user){
        if (err) { return next(err); }
        if (!user) { return next(new Error('can\'t find user')); }

        req.user = user;
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

router.put('/posts/:post/upvote',auth , function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});


router.get('/posts/:post/comments', function(req, res, next) {
    var _values=[];
    req.post.populate('comments', function(err, post) {

        if (err) { return next(err); }
        var j=0;
        for(var i=0 ; i < req.post.comments.length;i++ ){

            comment = req.post.comments[i];

            req.post.comments[i].populate('bookId',function(err,comment) {
                    ;
                    if (err) {
                        return next(err)
                    }
            /*    req.post.comments[i].populate('bookId',function(err,comment){
                    if(err) { return next(err)}
                })*/

                    _values.push(req.post.comments[j]);
                    console.log(i + "length ************" + j+ "*******");

                    if (j === (req.post.comments.length-1)) {

                        console.log("is it working");
                        res.json(_values);
                    }
                j++;

            }
            )
        }

    });
});

router.put('/posts/:post/interstedPosts',auth , function(req, res, next) {
    var iPost = new Post(req.body);
    iPost.interstedPosts = req.body.interstedPost;
    console.log("content of interstedPosts"+iPost);
    req.post.interstedPosts.push(req.body.interstedPosts);
    req.post.save(function(err, post) {
        if(err){ return next(err); }

        res.json(post);
    });
});

router.post('/posts/:post/comments',auth ,  function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;

    comment.author = req.payload.username;

    comment.save(function(err, comment){
        if(err){ return next(err); }

        /*    interstedPost = router.call('/posts/:post'comment.bookId;
        console.log("interstedPost" + interstedPost + "requested Post"+req.post);
        interstedPost.interstedPosts.push(req.post);

        interstedPost.save(function(err, post) {
            if(err){ return next(err); }

            console.log(interstedPost);
        });

         interstedPost.save(function(err,interstedPost) {
            if(err){ return next(err); }
         });

        var interstedPost = req.post;
        var x = req.query.id;
        console.log(req.post + "====="+req.body.bookId);
        x.interstedPosts.push(req.post); */

     //  console.log("inserting into"+ req.post.interstedPosts+"from" + interstedPost);

        req.post.comments.push(comment);
        console.log("testing comments"+ req.post.comments);
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

router.put('/posts/:post/comments/:comment/upvote',auth,  function(req, res, next) {
    req.comment.upvote(function(err, comment){

        req.post.update(function(err, post) {
            post.status = 'Deal Done';
            if(err){ return next(err); }
        });

        if (err) { return next(err); }

        res.json(comment);
    });
});

router.get('/comments/posts/:post', function(req, res, next) {
  /*  req.comment.bookId.find('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(req.comments.bookId);
    });*/


      req.comment.populate('bookId', function(err, post) {
        if (err) { return next(err); }

        res.json(comments.bookId);
    });
});


router.post('/register',  function(req, res, next){
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

router.get('/users/:user/posts', function(req, res, next) {

    req.user.populate('recommendationPostId', function(err, user) {
        if (err) { return next(err); }

        res.json(req.user.recommendationPostId);
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
});

module.exports = router;
