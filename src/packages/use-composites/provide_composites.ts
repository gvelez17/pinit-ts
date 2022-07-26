import {ComposeClient} from "@composedb/client";
import {Ed25519Provider } from 'key-did-provider-ed25519';
import * as ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import * as KeyDidResolver from 'key-did-resolver'
import * as PkhDidResolver from 'pkh-did-resolver'
//import { CeramicClient } from '@ceramicnetwork/http-client'
import { Resolver } from 'did-resolver'
import { fromString } from 'uint8arrays';
import { DID } from 'dids';

import config from '../../../config/composite-config.json' 
import defintion from 'runtime.merged.composite'

let did;
let composeClientInstance;

export async function get_did() {
        if (did) {
            return did;
        }
//        const ceramicClientInstance = new CeramicClient('http://localhost:7007')

        const keyDidResolver = KeyDidResolver.getResolver()
        const pkhDidResolver = PkhDidResolver.getResolver()
//        const threeIdResolver = ThreeIdResolver.getResolver(ceramicClientInstance)
        const resolver = new Resolver({
  //        ...threeIdResolver,
          ...pkhDidResolver,
          ...keyDidResolver,
        })

        const new_did = new DID({ provider: new Ed25519Provider(fromString(config.did_seed, 'base16')), resolver });
        new_did.authenticate();
        did = new_did;

        return did;
};

export async function get_composeClient() {
    if (composeClientInstance) {
        return composeClientInstance;
    }
    const did = get_did();
    const instance = new ComposeClient({
        ceramic: 'http://localhost:7007',
        definition
    });
    composeClientInstance = instance;
    return composeClientInstance;
}
