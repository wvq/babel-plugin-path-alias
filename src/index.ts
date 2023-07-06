import type {PluginOptions, Babel} from './types'
import type {PluginObj, PluginPass, NodePath} from '@babel/core'
import type {ImportDeclaration} from '@babel/types'
import {isEmptyObject, isNil} from './util'

export default function pathAlias(babel: Babel, config?: PluginOptions): PluginObj {
  if (isNil(config) || isEmptyObject(config)) {
    return {
      name: 'path-alias',
      visitor: {}
    }
  }

  return {
    name: 'path-alias',
    visitor: {
      ImportDeclaration(nodePath: NodePath<ImportDeclaration>, pluginPass: PluginPass) {
        console.log(pluginPass)
        nodePath.get('source')
      }
    }
  }
}
