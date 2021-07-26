const { Thought, User } = require('../models');

const thoughtController = {

getAllThoughts(req, res) {
    Thought.find({})
        .populate({
        path: 'user',
        select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
                res.status(400).json(err)
    });
},

    //id
getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'user',
            select: '-__v'
        })
    .select('-__v')
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => {
    console.log(err);
    res.status(400).json(err)
    })
},

    //thought
createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id}) => {
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(400).json({ message: 'No user found using this username!'});
                    return;
                }
            res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

//reaction
addReaction ({ params, body}, res) {
        Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
        if (!dbThoughtData) {
            res.status(400).json({ message: 'No thought with this ID!' });
            return;
        }
    res.json(dbThoughtData)
    })
    .catch(err => res.json(err));
},

    //action delete 

removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
    )
    .then(dbThoughtData => res.json(dbThoughtData))
    .catch(err => res.json(err));
},

    //thought with Id
updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
        { _id: params.id }, 
        body,
        { new: true, runValidators: true }
    )
    .then(updatedThought => {
    if (!updatedThought) {
            return res.status(400).json({ message: 'No thought with this ID!' });
        }
    res.json(updatedThought);
    })
    .catch(err => res.json(err));
},

    //delete a thought by ID
deleteThought({ params, body}, res) {
    Thought.findOneAndDelete({ _id: params.id })
    .then(deletedThought => {
        if (!deletedThought) {
            return res.status(400).json({ message: 'No thought with this ID!'})
        }
    res.json(deletedThought);
    })
    .catch(err => res.json(err));
    }
};

module.exports = thoughtController
