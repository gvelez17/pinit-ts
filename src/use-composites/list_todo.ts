import { getClient } from './composite_client.js';

import { gql } from '@apollo/client/core/index.js'

const VIEWER_QUERY = gql`
  query TaskList($cursor: String) {
    viewer {
      taskList(last: 100, before: $cursor) {
        edges {
          node {
            id
            content
            assignee
            completed
          }
        }
        pageInfo {
          hasPreviousPage
          startCursor
        }
      }
    }
  }
`

const ALL_TASKS_QUERY = gql`
query {
        taskIndex(first:1000) {
          edges {
            node {
              id
              content
              assignee
              completed
            }
          }
        }
      }

`

const ALL_MESSAGES_QUERY = gql`
  query {
    integrationMessageIndex(first:1000) {
      edges {
        node {
          id
          date
          from
          type
          message
        }
      }
    }
  }
`
 

export async function retrieveTodos() {
    const client = await getClient()

    const [allTaskResults, allMessagesResults] = await Promise.all([
      client.query({
        query: ALL_TASKS_QUERY,
        fetchPolicy: 'network-only'
      }),
      client.query({
        query: ALL_MESSAGES_QUERY,
        fetchPolicy: 'network-only'
      }),
    ])
      
    const messages = Object.fromEntries(allMessagesResults.data.integrationMessageIndex.edges.map(({node}) => [node.id, node.message]))

    const tasks = allTaskResults.data.taskIndex.edges.filter(({node}) => !node.completed).map(({node}) => {
      return Object.assign({}, node, {content: messages[node.content] || node.content})
    })

    return tasks;
  };
