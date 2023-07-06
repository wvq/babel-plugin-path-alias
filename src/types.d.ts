import type * as BabelCoreNamespace from '@babel/core'

export type Babel = typeof BabelCoreNamespace

export interface PluginOptions {
  baseUrl?: string
  paths: Record<string, Array<string>>
}
