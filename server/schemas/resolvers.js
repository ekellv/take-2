const { AuthenticationError } = require('apollo-server-express');
const { model } = require('mongoose');
const { User, List} = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {

        lists: async (parent, { username }) => {
        const params = username ? { username } : {};
        return List.find(params).sort({ createdAt: -1 });
        },

        list: async (parent, { listId }, context) => {
            if(context.user) {
            return List.findOne({ _id: listId });
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        me: async (parent, args, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user._id }).populate('lists');
        }
        throw new AuthenticationError('You need to be logged in!');
        },

        user: async (parent, { username }) => {
        return User.findOne({ username }).populate('thoughts');
        },

    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
            },

        login: async (parent, { email, password }) => {
            //gets user by email
            const user = await User.findOne({ email });

            //checks to see if user exists
            if (!user) {
                throw new AuthenticationError('Incorrect credentials!')
            }

            //boolean: if password is correct or not
            const correctPassword = await user.isCorrectPassword(password);

            //if false, then throw error
            if (!correctPassword) {
                throw new AuthenticationError('Incorrect credentials!')
            }

            //sign token with user data
            const token = signToken(user)

            //return token and user
            return { token, user };
        },

        addList: async (parent, { listName }, context) => {
            if (context.user) {
                const list = await List.create({ 
                    listName,
                    listAuthor: context.user._id,
                });

                await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { [list]: list._id } }
                );
                return list;
                }
                throw new AuthenticationError('Please log in to create a list before you run to the store!')
            },

        addItemToList: async (parent, { listId, itemText }, context) => {
            if (context.user) {
                return List.findOneAndUpdate(
                    { _id: listId },
                    { $addToSet: { 
                        items: { itemText, 
                        listAuthor: context.user.username }, 
                        },
                    },
                    {
                        new: true, 
                        runValidators: true,
                    }
                );
                }
                    throw new AuthenticationError('Please log in to create a list before you run to the store!')
                },

        addNote: async (parent, {itemId, noteText }, context) => {
            if (context.user) {
                return Item.findOneAndUpdate(
                    { _id: itemId },
                    { $addToSet: { 
                        note: { noteText },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
                );
            }
                throw new AuthenticationError('Please log in to create a list before you run to the store!')
        },

        updateItem: async (parent, { itemId, itemText}, context) => {
            if (context.user) {
                const list = await List.findOneAndUpdate(
                    { _id: itemId },
                    { $push: { 
                        items: { itemText, 
                        listAuthor: context.user.username },
                    },
                    },
                    {
                        new: true, 
                        runValidators: true,
                    }
                );

                return list;
                }
                    throw new AuthenticationError('Please log in to create a list before you run to the store!')
                },

        updateNote: async (parent, { noteId, noteText }, context) => {
            if (context.user) {
                const item = await Item.findOneAndUpdate(
                    { _id: noteId },
                    { $push: { 
                        note: { noteText },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
                );

                return item;
            }
                throw new AuthenticationError('Please log in to create a list before you run to the store!')
        },

        removeItemFromList: async ( parent, { listId, itemId }, context) => {
            if (context.user) {
                const list = await List.findOneAndUpdate(
                    { _id: listId }, 
                    { $pull: {
                        items: { 
                            _id: itemId,
                            listAuthor: context.user.username,
                        },
                    }, 
                },
                    { new: true }
                );

                return list; 
            }
                throw new AuthenticationError('Please log in to create a list before you run to the store!')            
        },

        removeNoteFromItem: async ( parent, { itemId, noteId }, context) => {
            if (context.user) {
                return Item.findOneAndUpdate(
                    { _id: itemId },
                    { 
                        $pull: { 
                            notes: { _id: noteId }, 
                        }, 
                    },
                        { new: true },
                );
            }
                throw new AuthenticationError('Please log in to create a list before you run to the store!')
        },

        removeList: async ( parent, { listId }, context) => {
            if (context.user) {
                const list = await List.findOneAndDelete({ 
                    _id: listId,
                    listAuthor: context.user.username,
                });

            await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { lists: list._id } }
                );

                return list;
            }
                throw new AuthenticationError('Please log in to create a list before you run to the store!')
        },

        clearList: async ( parent, { listId, itemId }, context) => {
            if (context.user) {
                return Item.updateMany(
                    { _id: listId },
                    { $pullAll: { items: { _id: itemId } } },
                    { new: true }
                );
            };
                throw new AuthenticationError('Please log in to create a list before you run to the store!')            
        },
    },
};

module.exports = resolvers;