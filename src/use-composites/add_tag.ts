
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

const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      document {
        id
        tag
        message_id
        curator
        context_url
      }
    }
  }
`

export async function addTag(what:string, tag:string, curator?:string, context_url?:string) {

    const client = await getClient()

    // make the message hash

    // query for existing message

    // if not create the message


    const createMessageResult = await client.mutate({
      mutation: CREATE_INTEGRATION_MESSAGE_MUTATION,
      variables: {
        input: {
          content: {
            date: new Date(Date.now()).toISOString(),
            from: 'Discord',
            type: 'Note',
            message: what 
          }
        }
      }
    })

    const result = await client.mutate({
      mutation: CREATE_TAG_MUTATION,
      variables: {
        input: {
          content: {
            tag: tag,
            message_id: createMessageResult.data.createIntegrationMessage.document.id,
            curator: curator,
            context_url: context_url,
          }
        }
      }
    })
    console.log(result)

  }
