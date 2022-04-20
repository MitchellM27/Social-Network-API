const {User} = require('../models');

const userController = {
    //creating a user
    createUser({
        body
    }, res) {
        User.create(body)
            .then(userData => res.json(userData))
            .catch(err => res.status(400).json(err));
    },

    //getting a user by their ID
    getUserById({
        params
    }, res) {
        User.findOne({
                _id: params.id
            })
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
    updateUser({
        params,
        body
    }, res) {
        User.findOneAndUpdate({
                _id: params.id
            }, body, {
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

    
};

module.exports = userController;