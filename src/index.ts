import type { PluginOptions, Babel } from './types'
import type { PluginObj, PluginPass, NodePath, Node } from '@babel/core'
import type { ExportDeclaration, ImportDeclaration, StringLiteral } from '@babel/types'
import * as t from '@babel/types'
import { isEmptyObject, isNil } from './util'
import PathMapper from './path-mapper'

const DEFAULT_EXTENSIONS = ['js', 'ts', 'jsx', 'tsx', 'mjs']

export default function pathAlias(babel: Babel, config?: PluginOptions): PluginObj {
  if (isNil(config) || isEmptyObject(config)) {
    return {
      name: 'path-alias',
      visitor: {}
    }
  }

  let { baseUrl, extensions, paths } = config!

  let mappers = Object.keys(paths).map(key => {
    return new PathMapper(baseUrl ?? '.', key, paths[key], extensions || DEFAULT_EXTENSIONS)
  })

  return {
    name: 'path-alias',
    pre() {},

    post() {},

    visitor: {
      ImportDeclaration(nodePath: NodePath<ImportDeclaration | ExportDeclaration>, state: PluginPass) {
        let { filename } = state
        let source = nodePath.get('source') as NodePath<StringLiteral>
        if (!source.isStringLiteral()) {
          return
        }

        let importPath = source.node.value

        for (let mapper of mappers) {
          if (mapper.test(importPath)) {
            let result = mapper.resolve(filename as string, importPath)
            source.replaceWith(t.stringLiteral(result))
            break
          }
        }
      },

      ExportDeclaration(nodePath: NodePath<ExportDeclaration>, state: PluginPass) {
      }
    }
  }
}
