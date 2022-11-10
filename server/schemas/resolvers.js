const { AuthenticationError } = require('apollo-server-express');
const { model } = require('mongoose');
const { User, List, Item} = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {

        lists: async (parent, { username }) => {
            const listsData = await List.find({ username })
                .sort({ createdAt: -1 })
                .populate('items');
            return listsData;
        },

        list: async (parent, { _id }) => {
            const listData = await List.findOne({ _id }).populate('items');
            return listData;
        },

        me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
            .select('__v, -password')
            .populate({ 
                path: 'lists',
                model: 'List',
                populate: {
                    path: 'items',
                    model: 'Item'
                },
            });
            return userData;
        }
        throw new AuthenticationError('You need to be logged in!');
        },

        user: async (parent, { username }) => {
            const userData = await User.findOne({ email }).populate({
                path: 'lists',
                model: 'List',
                populate: {
                    path: 'items',
                    model: 'Item'
                },
            });
            return userData;
        },

        items: async () => {
            const itemsData = await Item.find().sort({ createdAt: -1 });
            return itemsData;
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

        addList: async (parent, { ListInput: { listName, store, items } } ) => {
                const list = List({ 
                    listName,
                    store,
                    items,
                });

                await list.save();
                return list;
            },

        storeList: async (parent, { userId, listId } ) => {
            const User = await User.findbyId(userId);

            if (user) {
                const list = await List.findbyId(listId);
                user.lists.push(list);

                await user.save();
                return user;
            } else throw new Error('User not found!');
        },

        addItemToList: async (parent, { itemInput:  { listId, itemText, quantity } } ) => {
            const list = await List.findbyId(listId)
                
                if (list) {
                    list.items.push({
                        itemText, 
                        quantity,
                    });
                } else throw new Error('This list does not exist!');
                await list.save();
                return list;
                },

        addNote: async (parent, { noteInput: {itemId, noteText } } ) => {
            const item = await Item.findbyId(itemId)
                
                if (item) {
                    item.notes.push({
                        noteText, 
                    });
                } else throw new Error('This item does not exist!');
                await item.save();
                return item;            
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

        removeItemFromList: async ( parent, { listId, itemId } ) => {
            return List.findOneAndUpdate (
                    { _id: listId }, 
                    {$pull: { items: { _id: itemId } } },
                    { new: true }
            );           
        },

        removeNoteFromItem: async ( parent, { itemId, noteId } ) => {
            return Item.findOneAndUpdate (
                    { _id: itemId }, 
                    { $pull: { notes: { _id: noteId } } },
                    { new: true }
            );           
        },

        removeList: async ( parent, { listId } ) => {
            return List.findOneAndDelete({ _id: listId };)
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