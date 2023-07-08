import type { PluginOptions, Babel } from './types'
import type { PluginObj, PluginPass, NodePath, BabelFile } from '@babel/core'
import type { ExportDeclaration, ImportDeclaration, CallExpression } from '@babel/types'
import { isEmptyObject, isNil } from './util'
import PathResolver from './path-resolver'

export default function pathAlias(babel: Babel, config?: PluginOptions): PluginObj {
  if (isNil(config) || isEmptyObject(config)) {
    return {
      name: 'path-alias',
      visitor: {}
    }
  }

  const resolver = new PathResolver(config!)

  return {
    name: 'path-alias',
    pre(file: BabelFile) {
      console.log('pre: ' + file.opts.filename)
    },

    post(file: BabelFile) {
      console.log('post: ' + file.opts.filename)
      // nothing todo
    },

    visitor: {
      ImportDeclaration(node: NodePath<ImportDeclaration>, state: PluginPass) {
        // console.log(node.node.type)
        // resolver.resolve(node, state)
      },

      ExportDeclaration(node: NodePath<ExportDeclaration>, state: PluginPass) {
        // resolver.resolve(node, state)
      },

      CallExpression(node: NodePath<CallExpression>, state: PluginPass) {
        // console.log(node)
        console.log(node.node.callee)
        resolver.resolveMethodCall(node, state)
      }
    }
  }
}
