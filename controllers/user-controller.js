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

    
};

module.exports = userController;