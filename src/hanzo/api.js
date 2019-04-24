import Hanzo from '../mjs-fix/hanzo'
import blueprints from './blueprints'

export default class Api {
  constructor(key, endpoint) {
    this.client = new Hanzo.Api({ key, endpoint })

    for (let k in blueprints) {
      let v = blueprints[k]
      this.client.addBlueprints(k, v)
    }
  }
}

