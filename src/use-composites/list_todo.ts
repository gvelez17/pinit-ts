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

const ALL_QUERY = gql`
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
 

export async function retrieveTodos() {
    const client = await getClient()

    const result = await client.query({
        query: ALL_QUERY,
        fetchPolicy: 'network-only'
      });
    console.log("Going to retrieve tasks")
//    const tasks = result.data.viewer.taskList.edges.map(({node}) => node)
    const tasks = result.data.taskIndex.edges.map(({node}) => node)

    console.log("Got some tasks: " + JSON.stringify(tasks))
    return tasks;
  };
