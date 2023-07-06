import PathMapper from '../path-mapper'

describe('path-mapper', () => {
  let ROOT = process.cwd()

  let rootMapper1 = new PathMapper('.', '@/*', ['src/*'])
  let rootMapper2 = new PathMapper('.', '#/*', ['src/*'])
  let rootMapper3 = new PathMapper('.', '~/*', ['src/*'])

  let moduleMapper = new PathMapper('.', '@app/*', ['src/app/*'])

  it('test match', () => {
    expect(rootMapper1.test('')).toBeFalsy()
    expect(rootMapper1.test('@/')).toBeFalsy()
    expect(rootMapper1.test('@/some/module')).toBeTruthy()
    expect(rootMapper1.test('#/some/module')).toBeFalsy()
    expect(rootMapper2.test('#/some/module')).toBeTruthy()
    expect(rootMapper3.test('~/some/module')).toBeTruthy()
    expect(moduleMapper.test('')).toBeFalsy()
    expect(moduleMapper.test('@/app')).toBeFalsy()
    expect(moduleMapper.test('@app/')).toBeFalsy()
    expect(moduleMapper.test('@app/*')).toBeTruthy()
    expect(moduleMapper.test('@app/some/module')).toBeTruthy()
  })

  it('match result', () => {})
})
