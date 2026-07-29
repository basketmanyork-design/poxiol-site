export type CmsPortableTextNode =
  | {
      _key: string
      _type: 'block'
      style?: string
      listItem?: 'bullet' | 'number'
      children?: Array<{text?: string}>
    }
  | {
      _key: string
      _type: 'tableBlock'
      caption?: string
      rows?: Array<{cells?: string[]}>
    }
  | {
      _key: string
      _type: 'callout'
      title?: string
      body?: string
      tone?: 'info' | 'warning' | 'success'
    }

export type CmsPortableContent =
  | {kind: 'heading'; key: string; level: 2 | 3 | 4; text: string}
  | {kind: 'paragraph'; key: string; text: string}
  | {kind: 'list'; key: string; ordered: boolean; items: string[]}
  | {kind: 'table'; key: string; caption?: string; rows: string[][]}
  | {kind: 'callout'; key: string; title?: string; body?: string; tone: 'info' | 'warning' | 'success'}

function blockText(node: Extract<CmsPortableTextNode, {_type: 'block'}>) {
  return (node.children || []).map((child) => child.text || '').join('')
}

export function normalizePortableText(nodes: CmsPortableTextNode[]): CmsPortableContent[] {
  const output: CmsPortableContent[] = []

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]

    if (node._type === 'tableBlock') {
      output.push({
        kind: 'table',
        key: node._key,
        caption: node.caption,
        rows: (node.rows || []).map((row) => row.cells || []),
      })
      continue
    }

    if (node._type === 'callout') {
      output.push({
        kind: 'callout',
        key: node._key,
        title: node.title,
        body: node.body,
        tone: node.tone || 'info',
      })
      continue
    }

    const text = blockText(node)
    if (!text) continue

    if (node.listItem) {
      const items = [text]
      while (index + 1 < nodes.length) {
        const next = nodes[index + 1]
        if (next._type !== 'block' || next.listItem !== node.listItem) break
        index += 1
        items.push(blockText(next))
      }
      output.push({kind: 'list', key: node._key, ordered: node.listItem === 'number', items})
      continue
    }

    if (/^h[2-4]$/.test(node.style || '')) {
      output.push({
        kind: 'heading',
        key: node._key,
        level: Number((node.style || 'h2').slice(1)) as 2 | 3 | 4,
        text,
      })
      continue
    }

    output.push({kind: 'paragraph', key: node._key, text})
  }

  return output
}
