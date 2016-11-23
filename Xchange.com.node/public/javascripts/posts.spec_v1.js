// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Posts factory', function() {
    var o , $q , $httpBackend;

    // Add Pokeapi endpoint
    var API = '/posts/';

    var postList = [
        {
            "_id": "582877c3f7219a18ac542826",
            "bookAuthor": "shilpa",
            "title": "First World war",
            "description": "fww",
            "ISBN": "asdfasdf",
            "link": "asdfasdfasdf",
            "__v": 35,
            "interstedPosts": [
                "582877c3f7219a18ac542826",
                "582877c3f7219a18ac542826",
                "582877c3f7219a18ac542826"
            ],
            "comments": [
                "5828b0e59b64fe12902dfda9",
                "5828b159090d611b1c9cc5d4",
                "5828b5931f52df1accfa0eda",
                "5828b5931f52df1accfa0eda"
            ],
            "status": "Buy",
            "upvotes": 0
        },
        {
            "_id": "582878a1f7219a18ac542829",
            "bookAuthor": "raju1",
            "title": "Economics",
            "description": "ecoooooooooomics",
            "ISBN": "asdf",
            "link": "asdfa",
            "__v": 0,
            "interstedPosts": [
                "582877c3f7219a18ac542827"
            ],
            "comments": [],
            "status": "Buy",
            "upvotes": 0
        }
    ];

    var postListById =
    {
        _id : '582877c3f7219a18ac542826',
        bookAuthor : 'shilpa',
        title : 'First World war',
        description : 'fww',
        ISBN : 'asdfasdf',
        link : 'asdfasdfasdf',
        interstedPosts : [
            '582877c3f7219a18ac542826',
            '582877c3f7219a18ac542826',
            '582877c3f7219a18ac542826'
        ],
        'comments' : [
            '5828b0e59b64fe12902dfda9',
            '5828b159090d611b1c9cc5d4',
            '5828b5931f52df1accfa0eda',
            '5828b5931f52df1accfa0eda'
        ],
        'status ': 'Buy',
        'upvotes' : 0
    };
    // Before each test load our api.users module
    beforeEach(angular.mock.module('myApp'));

    // Before each test set our injected Users factory (_Users_) to our local Users variable
    beforeEach(inject(function(_posts_,_$q_,_$httpBackend_) {
        o = _posts_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
    }));

    describe('getAll()',function(){
        // A simple test to verify the Users factory exists
           it('should exist', function() {
            expect(o.getAll).toBeDefined('asd');
        });

        // A test to verify that calling all() returns the array of users we hard-coded above
        it('should return a hard-coded list of users', function() {
            var result;
            beforeEach(function(){
                result = {};

                spyOn(o,"getAll").and.callThrough();
            });

            // Declare the endpoint we expect our service to hit and provide it with our mocked return values
            $httpBackend.whenGET(API).respond(200, $q.when(postList));
            it('should return a hard-coded list of users', function() {
                console.log("internal");
                expect(o.getAll).not.toHaveBeenCalled();
                expect(result).toEqual(postList);
            });


            o.getAll().then(function(res) {
                    console.log("testing"+res);
                    result = res;
                });

            // Flush pending HTTP requests
            $httpBackend.flush();
            console.log("testing");
            expect(o.getAll).toHaveBeenCalledWith();
            expect(result).toEqual(postList);
        });
    });

    // A set of tests for our Users.findById() method
    describe('.get()', function() {
        // A simple test to verify the method findById exists
        it('should exist', function() {
            expect(o.get).toBeDefined();
        });

        // A simple test to verify the method findById exists
        it('should exist for given post Id', function() {
            expect(o.get('582877c3f7219a18ac542826')).toEqual(postListById);
        });
    });
});


describe('NavCtrl', function() {
    var $controller, NavCtrl ,posts;

    var postList = [
        {
            _id : '582877c3f7219a18ac542826',
            bookAuthor : 'shilpa',
            title : 'First World war',
            description : 'fww',
            ISBN : 'asdfasdf',
            link : 'asdfasdfasdf',
            interstedPosts : [
                '582877c3f7219a18ac542826',
                '582877c3f7219a18ac542826',
                '582877c3f7219a18ac542826'
            ],
            'comments' : [
                '5828b0e59b64fe12902dfda9',
                '5828b159090d611b1c9cc5d4',
                '5828b5931f52df1accfa0eda',
                '5828b5931f52df1accfa0eda'
            ],
            'status ': 'Buy',
            'upvotes' : 0
        },
        {
            "_id": "582878a1f7219a18ac542829",
            "bookAuthor": "raju1",
            "title": "Economics",
            "description": "ecoooooooooomics",
            "ISBN": "asdf",
            "link": "asdfa",
            "__v": 0,
            "interstedPosts": [
                "582877c3f7219a18ac542827"
            ],
            "comments": [],
            "status": "Buy",
            "upvotes": 0
        }];

    // Load ui.router and our components.users module which we'll create next
    beforeEach(angular.mock.module('ui.router'));
    beforeEach(angular.mock.module('myApp'));

    // Inject the $controller service to create instances of the controller (UsersController) we want to test
    beforeEach(inject(function(_$controller_, _Posts_) {
        $controller = _$controller_;
        posts = _Posts_;

        // Spy and force the return value when UsersFactory.all() is called
        spyOn(posts, 'getAll').and.callFake(function() {
            return postList;
        });

        NavCtrl = $controller('NavCtrl', { Posts: posts});
    }));

    // Verify our controller exists
    it('should be defined', function() {
        expect(NavCtrl).toBeDefined();
    });

    // Add a new test for our expected controller behavior
    it('should initialize with a call to Users.all()', function() {
        expect(posts.getAll).toHaveBeenCalled();
        expect(NavCtrl.users).toEqual(postList);
    });

});