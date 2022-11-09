const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        lists: [List]
    }
    type List {
        _id: ID
        listAuthor: String
        listName: String
        createdAt: String
        store: String
        items: [Item]
    }
    
    type Item {
        _id: ID
        itemText: String
        createdAt: String
        quantity: Int
        notes: [Note]
    }
    type Note {
        _id: ID
        noteText: String
    }  
    
    type Auth {
        token: ID
        user: User
    }

    input ListInput {
        listName: String!
        store: String
        items: [ItemInput]
    }

    input ItemInput {
        listId: String!
        itemText: String!
        quantity: Int
    }

    input NoteInput {
        itemId: String!
        noteText: String!
    }
    
    type Query {
        me: User
        user(username: String!): User
        lists(storedEmail: String): [List]
        list(_id: ID!): List
    }
    type Mutation { 
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        addList(ListInput: ListInput): List
        addItemToList(ItemInput: ItemInput): List
        addNote(NoteInput: NoteInput): Item
        updateItem(
            itemId: ID!
            itemText: String!     
        ): List
        updateNote(
            noteId: ID!
            noteText: String!
        ): Item
        removeItemFromList(
            listId: ID!
            itemId: ID!
        ): List
        removeNoteFromItem(
            itemId: ID!
            noteId: ID!
        ): Item
        removeList(
            listId: ID!
        ): List
        clearList(
            listId: ID!
            itemId: [ID]!
        ): List
        toggleItem(
            itemId: ID!
        ): Item
    }
`;