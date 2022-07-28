
import { getClient } from './composite_client.js';

import { gql } from '@apollo/client/core/index.js'

const CREATE_INTEGRATION_MESSAGE_MUTATION = gql`
  mutation CreateIntegrationMessage($input: CreateIntegrationMessageInput!) {
    createIntegrationMessage(input: $input) {
      document {
        id
      }
    }
  }
`

const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      document {
        id
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

    const createMessageResult = await client.mutate({
      mutation: CREATE_INTEGRATION_MESSAGE_MUTATION,
      variables: {
        input: {
          content: {
            date: new Date(Date.now()).toISOString(),
            from: 'Discord',
            type: 'Task',
            message: content
          }
        }
      }
    })

    const result = await client.mutate({
      mutation: CREATE_TASK_MUTATION,
      variables: {
        input: {
          content: {
            content: createMessageResult.data.createIntegrationMessage.document.id,
            assignee: assignee,
            completed: false,
          }
        }
      }
    })
    console.log(result)

  }
