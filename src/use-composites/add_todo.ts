
import { get_composeClient } from './provide_composites.js';

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

export async function addTodo(assignee:any) {
    if (!req.query.todo) {
      return res.status(400).send("todo parameter required.");
    }

    // // figure out which mutation to use and with what parameters 
    const client = await get_composeClient()
    const result = await client.mutate({
      mutation: CREATE_MUTATION,
      variables: {
        input: {
          content: {
            content: req.query.todo,
            assignee: assignee,
            completed: false,
          }
        }
      }
    })

    return res.status(200).json(result);
  }
