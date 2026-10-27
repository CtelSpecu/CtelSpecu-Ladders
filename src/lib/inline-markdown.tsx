import type { ReactNode } from 'react'

/**
 * 极简行内 Markdown：**加粗**、*斜体*、~~删除线~~、==高亮==、`代码`，换行渲染为 <br />。
 * 只返回 React 节点，不经过 dangerouslySetInnerHTML。
 */
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|==[^=]+==|`[^`]+`)/g

function renderLine(line: string, prefix: string): ReactNode[] {
  return line
    .split(INLINE)
    .filter((chunk) => chunk.length > 0)
    .map((chunk, index) => {
      const key = `${prefix}-${index}`

      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return (
          <strong key={key} className="font-semibold text-foreground">
            {chunk.slice(2, -2)}
          </strong>
        )
      }
      if (chunk.startsWith('~~') && chunk.endsWith('~~')) {
        return <del key={key}>{chunk.slice(2, -2)}</del>
      }
      if (chunk.startsWith('==') && chunk.endsWith('==')) {
        return (
          <mark key={key} className="rounded-sm bg-primary/15 px-0.5 text-foreground">
            {chunk.slice(2, -2)}
          </mark>
        )
      }
      if (chunk.startsWith('`') && chunk.endsWith('`')) {
        return (
          <code key={key} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">
            {chunk.slice(1, -1)}
          </code>
        )
      }
      if (chunk.startsWith('*') && chunk.endsWith('*')) {
        return <em key={key}>{chunk.slice(1, -1)}</em>
      }
      return chunk
    })
}

export function renderInlineMarkdown(text: string): ReactNode[] {
  return text.split('\n').flatMap((line, index) =>
    index === 0
      ? renderLine(line, `line-${index}`)
      : [<br key={`break-${index}`} />, ...renderLine(line, `line-${index}`)],
  )
}
