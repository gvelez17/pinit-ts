
import { getClient } from './composite_client.js';

import { gql } from '@apollo/client'

const CREATE_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      document {
        content
        assignee
        completed
      }
    }
  }
`

export async function addTodo(content:any, assignee:any) {
    // // figure out which mutation to use and with what parameters 
    const client = await getClient()
    const result = await client.mutate({
      mutation: CREATE_MUTATION,
      variables: {
        input: {
          content: {
            content: content,
            assignee: assignee,
            completed: false,
          }
        }
      }
    })

  }
