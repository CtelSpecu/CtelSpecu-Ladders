import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { renderInlineMarkdown } from './inline-markdown'

function render(text: string) {
  return renderToStaticMarkup(<>{renderInlineMarkdown(text)}</>)
}

describe('renderInlineMarkdown', () => {
  it('**加粗**', () => {
    expect(render('请 **先更新订阅** 再试')).toContain('<strong')
    expect(render('请 **先更新订阅** 再试')).toContain('先更新订阅')
  })

  it('*斜体* 不影响 **加粗**', () => {
    const html = render('**粗** 和 *斜*')
    expect(html).toContain('<strong')
    expect(html).toContain('<em')
  })

  it('~~删除线~~ 与 ==高亮==', () => {
    expect(render('~~旧~~ ==重点==')).toContain('<del')
    expect(render('~~旧~~ ==重点==')).toContain('<mark')
  })

  it('`代码`', () => {
    expect(render('执行 `clash`')).toContain('<code')
  })

  it('换行渲染成 <br />', () => {
    expect(render('第一行\n第二行')).toContain('<br/>')
    expect(render('第一行\n第二行')).toContain('第二行')
  })

  it('纯文本原样输出', () => {
    expect(render('没有标记的正文')).toBe('没有标记的正文')
  })
})
