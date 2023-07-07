import type * as BabelCoreNamespace from '@babel/core'

export type Babel = typeof BabelCoreNamespace

export interface PluginOptions {
  extensions?: string[]
  baseUrl?: string
  paths: Record<string, Array<string>>
}
