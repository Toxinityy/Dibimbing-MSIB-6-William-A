// src/graphql.ts
import { gql } from '@apollo/client';

export const GET_NOTES = gql`
  query {
    notes {
      id
      title
      body
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($title: String!, $body: String!) {
    createNote(title: $title, body: $body) {
      id
      title
      body
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: Int!) {
    deleteNote(id: $id) {
      id
      title
      body
    }
  }
`;

export const GET_DETAIL_NOTE = gql`
  query GetDetailNote($id: Int!) {
    getDetailNote(id: $id) {
      id
      title
      body
      createdAt
    }
  }
`;

export const EDIT_NOTE = gql`
  mutation EditNote($id: Int!, $title: String, $body: String) {
    editNote(id: $id, title: $title, body: $body) {
      id
      title
      body
    }
  }
`;
