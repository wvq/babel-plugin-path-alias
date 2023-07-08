import PathMapper from './path-mapper'
import { NodePath, PluginPass } from '@babel/core'
import * as t from '@babel/types'

import type { PluginOptions } from './types'
import type { ExportDeclaration, ImportDeclaration, CallExpression, StringLiteral } from '@babel/types'

const DEFAULT_EXTENSIONS = ['js', 'ts', 'jsx', 'tsx', 'mjs']

export default class PathResolver {
  // store
  private mappers: PathMapper[]

  constructor(opts: PluginOptions) {
    this.mappers = Object.keys(opts.paths).map(key => {
      return new PathMapper(opts.baseUrl ?? '.', key, opts.paths[key], opts.extensions || DEFAULT_EXTENSIONS)
    })
  }

  resolve(node: NodePath<ImportDeclaration | ExportDeclaration>, state: PluginPass) {
    let { filename } = state
    let source = node.get('source') as NodePath<StringLiteral>
    if (!source.isStringLiteral()) {
      return
    }

    let importPath = source.node.value

    for (let mapper of this.mappers) {
      if (mapper.test(importPath)) {
        let result = mapper.resolve(filename as string, importPath)
        source.replaceWith(t.stringLiteral(result))
        break
      }
    }
  }

  resolveMethodCall(node: NodePath<ImportDeclaration | ExportDeclaration | CallExpression>, state: PluginPass) {}
}
