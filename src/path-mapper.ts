import fs from 'fs'
import path from 'path'
import { isNil } from './util'

export default class PathMapper {
  // 文件扩展名
  private extensions: string[]

  // 根路径
  // eg: './src'
  private baseUrl: string

  // 别名路径
  // eg : '@views/*'
  private aliasPath: string

  // 映射路径.
  // eg : ["./views/*"]
  private mappings: string[]

  // 匹配规则.
  // eg: @views/* => /^@views\/(.+)$/
  private pattern: RegExp

  constructor(baseUrl: string, aliasPath: string, mappings: string[], extensions: string[]) {
    this.baseUrl = path.resolve(baseUrl)
    this.aliasPath = aliasPath
    this.extensions = extensions
    this.mappings = mappings.map(m => path.resolve(this.baseUrl, m))

    this.pattern = new RegExp(`^${aliasPath.replace(/\*$/, '(.+)')}$`)
  }

  /**
   * 别名路径转换成相对路径.
   *
   * @example  @/todo/entity.ts -> ../todo/entity.ts
   *
   * @param filePath 源文件地址, win32 or posix
   * @param importPath 映射路径
   * @returns
   */
  resolve(filePath: string, importPath: string): string | false {
    if (!this.pattern.test(importPath)) {
      return false
    }

    let mappingPath = this.mappings[0]
    let fallbackPath = this.mappings[1]

    let [relativePath, exists] = this._resolve(filePath, importPath, fallbackPath)

    if (!exists && !isNil(fallbackPath)) {
      ;[relativePath] = this._resolve(filePath, importPath, fallbackPath)
    }

    return this.toPosixPath(relativePath)
  }

  /**
   *
   */
  private _resolve(filePath: string, importPath: string, fallbackPath: string): [string, boolean] {
    return ['', true]
  }

  /**
   * Transform path to POSIX-style.
   * @param sourcePath
   */
  private toPosixPath(sourcePath: string) {
    return sourcePath.replace(/\\/g, '/')
  }

  /**
   * check file exists.
   * @param filePath
   */
  private exists(filePath: string) {
    return fs.existsSync(filePath) || this.extensions.some(ext => fs.existsSync(`${filePath}.${ext}`))
  }

  private static isWindows() {
    return process.platform === 'win32'
  }
}
