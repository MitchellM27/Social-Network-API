const {Thought,User} = require('../models');

const thoughtController = {
    //create thought
    createThought(body, res) {
        Thought.create(body)
            .then((thoughtData) => {
                return User.findOneAndUpdate(
                    {
                        _id: body.userId
                    }, {
                        $addToSet: {
                            thoughts: thoughtData._id
                        }
                    }, {
                        new: true
                    }
                );
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(userData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
}

module.exports = thoughtController;