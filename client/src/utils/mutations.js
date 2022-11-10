import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_LIST = gql`
    mutation addListInput(
        $listName: String!
        $store: String!
        $items: [itemInput]
    ) {
        addList(
            ListInput: {
                listName: $listName
                store: $store
                items: $items
            }
        ) {
            _id
            createdAt
            listAuthor
            listName
            store
            items {
                _id
                itemText
                createdAt
                quantity
                notes {
                _id
                noteText
            }
        }
    }
}
`;


export const ADD_ITEM_TO_LIST = gql`
  mutation addItemToList(
    $listId: String!, 
    $itemText: String, 
    $quantity: Int) {
      addItemToList(
          ItemInput: {
              listId: $listId, itemText: $itemText, quantity: $quantity } 
      ) {
          _id
          items {
              _id
              itemText
              createdAt
              quantity
        }
      }
    }
`; 

export const ADD_NOTE = gql`
  mutation addNote($itemId: ID!, $noteText: String!) {
    addNote(
        NoteInput: { 
            itemId: $itemId, noteText: $noteText 
            }
        ) {
            _id
            notes {
              _id
              noteText
        }
      }
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation updateItem($itemId: ID! $itemText: String!) {
    updateItem(itemId: $itemId, itemText: $itemText) {
        _id
        createdAt
        listAuthor
        listName
        store
        items {
            _id
            itemText
            createdAt
            notes {
              _id
              noteText
        }
      }
    }
  }
`; 

export const UPDATE_NOTE = gql`
  mutation updateNote($noteId: ID!, $noteText: String!) {
    updateNote(noteId: $noteId, noteText: $noteText) {
        notes {
          _id
          noteText
        }
      }
    }
`;

export const REMOVE_ITEM_FROM_LIST = gql`
  mutation removeItemFromList($listId: ID!, $itemId: ID!) {
    removeItemFromList(listId: $listId, itemId: $itemId) {
        _id
        items {
            _id
      }
    }
  }
`; 

export const REMOVE_NOTE_FROM_ITEM = gql`
  mutation removeNoteFromItem($itemId: ID! $noteId: ID!) {
    removeNoteFromItem(itemId: $itemId, noteId: $noteId) {
            _id
            notes {
              _id
              noteText
        }
      }
    }
`;

export const REMOVE_LIST = gql`
  mutation removeList($listId: ID!) {
    removeList(listId: $listId) {
        _id
    }
  }
`;

// need to figure out how to clear items & notes but not the shell of the list itself 
export const CLEAR_LIST = gql`
  mutation clearList($listId: ID!, $itemId: [ID]!) {
    clearList(listId: $listId, itemId: [$itemId]) {
        items {
            _id
            itemText
            createdAt
            notes {
              _id
              noteText
        }
      }
    }
  }
`;