import { ComposeClient } from '@composedb/client';
import { definition } from './models/runtime.merged.composite.js';
import { Ed25519Provider } from 'key-did-provider-ed25519'
import * as ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import * as KeyDidResolver from 'key-did-resolver'
import * as PkhDidResolver from 'pkh-did-resolver'
import { Resolver } from 'did-resolver'
import { DID } from 'dids'
import { CeramicClient } from '@ceramicnetwork/http-client'
import * as u8a from 'uint8arrays'
import { ApolloClient, ApolloLink, InMemoryCache, NormalizedCacheObject, Observable } from '@apollo/client/core/index.js'
import { relayStylePagination } from '@apollo/client/utilities/utilities.cjs'
import config from './composite_config.json' assert { type: 'json' };

const SEED = config.did_seed

let client: ApolloClient<NormalizedCacheObject>

export async function getClient(): Promise<ApolloClient<NormalizedCacheObject>>{
  if (client) {
    return client
  }

  const composeClientInstance = new ComposeClient({
    ceramic: 'http://localhost:7007',
    definition,
  });

  const ceramicClientInstance = new CeramicClient('http://localhost:7007')

  const provider = new Ed25519Provider(u8a.fromString(SEED, 'base16'))
  const keyDidResolver = KeyDidResolver.getResolver()
  const pkhDidResolver = PkhDidResolver.getResolver()
  const threeIdResolver = ThreeIdResolver.getResolver(ceramicClientInstance)
  const resolver = new Resolver({
    ...threeIdResolver,
    ...pkhDidResolver,
    ...keyDidResolver,
  })
  const did = new DID({ provider, resolver })

  await did.authenticate()

  composeClientInstance.setDID(did)

  await did.authenticate()

  // Create a custom ApolloLink using the ComposeClient instance to execute operations
  const link = new ApolloLink((operation) => {
    return new Observable((observer) => {
      composeClientInstance.execute(operation.query, operation.variables).then(
        (result) => {
          observer.next(result)
          observer.complete()
        },
        (error) => {
          observer.error(error)
        }
      )
    })
  })

  const cache = new InMemoryCache({
    typePolicies: {
      CeramicAccount: {
        fields: {
          noteList: relayStylePagination(),
        },
      },
    },
  })

  client = new ApolloClient({ cache, link })
  return client
}
