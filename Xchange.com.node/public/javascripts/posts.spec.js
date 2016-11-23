// Be descriptive with titles here. The describe and it titles combined read like a sentence.

describe('PostsCtrl', function() {
    var $controller,$rootScope, PostsCtrl ,posts ,$scope;

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
    beforeEach(inject(function(_$controller_,$rootScope,_$scope_) {
        $controller = _$controller_;
        scope = $rootScope.$new();
       // posts = _Posts_;


        // Spy and force the return value when UsersFactory.all() is called
       // spyOn(posts, 'getAll').and.callFake(function() {
       //     return postList;
       // });

        PostsCtrl = $controller('PostsCtrl', { $scope : scope});
    }));

    // Verify our controller exists
    it('should be defined', function() {
        expect(PostsCtrl).toBeDefined();
    });

    // Add a new test for our expected controller behavior
    it('should initialize with a call to Users.all()', function() {
        expect(posts.getAll).toHaveBeenCalled();
        expect(PostsCtrl.users).toEqual(postList);
    });

});