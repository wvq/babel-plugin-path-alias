import fs, { stat } from 'fs'
import path from 'path'
import { isNil, toPosixPath } from './util'

export default class PathMapper {
  // 文件扩展名
  private extensions: string[]

  /**
   * 项目根路径.
   * @example
   * posix: '/home/project/src'
   * win32: 'C:\\project\\src'
   */
  private baseUrl: string

  /**
   * 映射路径.
   * @example
   * posix: ['/home/project/src/app/*']
   * win32: ["C::\\project\\src\\app\\*"]
   */
  private mappings: string[]

  // 别名路径
  // eg : '@views/*'
  private aliasPath: string

  // 匹配规则.
  // eg: @views/* => /^@views\/(.+)$/
  private pattern: RegExp

  /**
   *
   * @param baseUrl eg: './src'
   * @param aliasPath  eg: @app/*
   * @param mappings  eg: ['./app/*', './template/app/*']
   * @param extensions eg: ['ts', 'js', 'tsx', 'jsx']
   */
  constructor(baseUrl: string, aliasPath: string, mappings: string[], extensions: string[]) {
    this.baseUrl = path.resolve(baseUrl)
    this.aliasPath = aliasPath
    this.extensions = extensions
    this.mappings = mappings.map(m => path.resolve(this.baseUrl, m))

    this.pattern = new RegExp(`^${aliasPath.replace(/\*$/, '(.+)')}$`)
  }

  test(importPath: string): boolean {
    return this.pattern.test(importPath)
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
  resolve(filePath: string, importPath: string): string {
    let mappingPath = this.mappings[0]
    let fallbackPath = this.mappings[1]

    let [relativePath, exists] = this._resolve(filePath, importPath, mappingPath)

    if (!exists && !isNil(fallbackPath)) {
      ;[relativePath] = this._resolve(filePath, importPath, fallbackPath)
    }

    return toPosixPath(relativePath)
  }

  private _resolve(filePath: string, importPath: string, mappingPath: string): [string, boolean] {
    let replacement = this.pattern.exec(importPath)!.at(1) as string

    let absolutePath = mappingPath.replace(/\*$/, replacement)

    let exists = this.exists(importPath)

    let relativePath = path.relative(path.dirname(filePath), absolutePath)

    if (!/^\./.test(relativePath)) {
      relativePath = `./${relativePath}`
    }

    return [relativePath, exists]
  }

  /**
   * Check file exists.
   * If <filePath> is directory, check <filePath>/index.[extension] exists.
   *
   * @param filePath
   */
  private exists(filePath: string) {
    // If is directory, resolve filePath to <filePath>/index.
    if (fs.existsSync(filePath)) {
      let stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        filePath = path.resolve(filePath, 'index')
      }
    }
    return fs.existsSync(filePath) || this.extensions.some(ext => fs.existsSync(`${filePath}.${ext}`))
  }
}
