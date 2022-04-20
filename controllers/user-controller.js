const {User} = require('../models');

const userController = {
    //creating a user
    createUser({body}, res) {
        User.create(body)
            .then(userData => res.json(userData))
            .catch(err => res.status(400).json(err));
    },

    //getting a user by their ID
    getUserById({params }, res) {
        User.findOne({_id: params.id})
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    //getting all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: ('-__v')
            })
            .populate({
                path: 'friends',
                select: ('-__v')
            })
            .select('-__v')
            .sort({
                _id: -1
            })
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //updating a user by their ID
    updateUser({params,body}, res) {
        User.findOneAndUpdate({ _id: params.id}, body, {
                new: true,
                runValidators: true
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({
                        message: 'No user with this ID'
                    });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    //add a friends to a user's list by their ID
    addToFriends({params}, res) {
        User.findOneAndUpdate({_id: params.userId}, {
                $push: {
                    friends: params.friendId
                }
            }, {
                new: true
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({
                        message: 'No user found for this id!'
                    });
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            });
    },

    //delete a user based on their ID
    deleteUser({params}, res) {
        User.findOneAndDelete({ _id: params.id})
            .then(userData => {
                if (!userData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                return userData;
            })
            .then(userData => {
                User.updateMany({_id: {$in: userData.friends}}, {
                        $pull: {
                            friends: params.userId
                        }
                    })
                    .then(() => {
                        Thought.deleteMany({
                                username: userData.username
                            })
                            .then(() => {
                                res.json({
                                    message: 'User deleted'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    //delete from friends list by ID
    removefromFriends({params}, res) {
        User.findOneAndDelete({ _id: params.friendId})
            .then(deletedFriend => {
                if (!deletedFriend) {
                    return res.status(404).json({
                        message: 'No friend found for this id.'
                    })
                }
                return User.findOneAndUpdate({friends: params.friendId}, {
                    $pull: {
                        friends: params.friendId
                    }
                }, {
                    new: true
                });
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({
                        message: 'No friend found for this id.'
                    })
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.json(err));
    },

    
};

module.exports = userController;