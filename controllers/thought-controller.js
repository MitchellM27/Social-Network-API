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

    //get thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    //getting a thought by ID
    getThoughtById({params}, res) {
        Thought.findOne({_id: params.thoughtId})
            .select('-__v')
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({
                        message: 'No thought found at id.'
                    });
                    return;
                }
                res.json(thoughtData)
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //update thought by id
    updateThought({params,body}, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, {
                $set: body
            }, {
                runValidators: true,
                new: true
            })
            .then(thoughtData => {
                if (!thoughtData) {
                    return res.status(404).json({
                        message: 'No thought with this id!'
                    });
                }
                return res.json({
                    message: "Success"
                });
            })
            .catch(err => res.json(err));
    },

    //deleting a thought
    removeThought({params}, res) {
        Thought.findOneAndDelete({_id: params.thoughtId})
            .then(thoughtData => {
                if (!thoughtData) {
                    return res.status(404).json({
                        message: 'No thought for this id!'
                    });
                }
                return User.findOneAndUpdate({thoughts: params.thoughtId}, {
                    $pull: {
                        thoughts: params.thoughtId
                    }
                }, {
                    new: true
                });
            })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({
                        message: 'No thought found for this id!'
                    });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.json(err));
    },

    //creating a reaction.
    createReaction({params,body}, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId}, {
                $push: {
                    reactions: body
                }
            }, {
                new: true,
                runValidators: true
            })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({
                        message: 'No reaction found with this id!'
                    });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },

    // Deleting a reaction.
    deleteReaction({params}, res) {
        Thought.findOneAndUpdate({_id: params.thoughtId},
                {
                    $pull: {
                        reactions: {reactionId: params.reactionId}
                    }
                }, {
                    new: true
                }
            )
            .then((thought) => {
                if (!thought) {
                    res.status(404).json({
                        message: 'No reaction found for this id.'
                    });
                    return;
                }
                res.json(thought)
            })
            .catch(err => res.json(err));
    },
}

module.exports = thoughtController;