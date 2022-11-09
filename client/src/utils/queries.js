import { gql } from '@apollo/client';

export const QUERY_ME = gql`
    query Me {
        me {
        _id
        username
        email
        lists {
          _id
          listAuthor
          listName
          createdAt
          items {
              _id
              itemText
              createdAt
              quantity
          }
          notes {
            _id
            noteText
            noteAuthor
          }
        }
      }
    }
`;

export const QUERY_USER = gql`
  query user($username: String) {
    user(username: $username) {
      _id
      username
      email
      lists {
        _id
        listText
        listName
        createdAt
      }
    }
  }
`;

export const QUERY_LISTS = gql`
  query getLists($storedEmail: String!) {
        lists(storedEmail: $storedEmail) {
          _id
          listAuthor
          listName
          createdAt
          items {
              _id
              itemText
              createdAt
              quantity
          }
          notes {
            _id
            noteText
            noteAuthor
          }
    }
  }
  `;

export const QUERY_SINGLE_LIST = gql`
  query getSingleList($_id: ID!) {
    list(_id: $_id) {
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
            }
            notes {
              _id
              noteText
        }
    }
  }
`;

export const QUERY_ITEMS = gql`
    query getItems {
        items {
            _id
            itemText
            createdAt
            quantity
        }
        notes {
            _id
            noteText
        }
    }
`;