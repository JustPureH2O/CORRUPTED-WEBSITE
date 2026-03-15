import { visit } from 'unist-util-visit'
import { fromHtml } from 'hast-util-from-html'
import { execa } from 'execa'

// 简单的内存缓存，避免重复调用 pandoc
const cache = new Map()

export default function rehypePandocLatex() {
  return async (tree, file) => {
    const promises = []

    visit(tree, 'element', (node, index, parent) => {
	  const classes = Array.isArray(node.properties.className)
        ? node.properties.className
        : []
      // 定位由 remark-math 生成的数学公式节点
      const isInline = classes.includes('math-inline')
      const isDisplay = classes.includes('math-display')
	  const isLang = classes.includes('language-math')
      if (!isInline && !isDisplay && !isLang) return

      // 获取 LaTeX 源码（节点内的文本内容）
      let latex = ''
      const collectText = (n) => {
        if (n.type === 'text') latex += n.value
        else if (n.children) n.children.forEach(collectText)
      }
      collectText(node)

	  // 格式化 LaTex，内联/块级
	  latex = isDisplay ? `$$${latex}$$` : `$${latex}$`;
	  
      // 如果缓存中有，直接替换节点并跳过 pandoc 调用
      if (cache.has(latex)) {
        const html = cache.get(latex)
        const newNode = fromHtml(html, { fragment: true }).children[0]
        parent.children.splice(index, 1, newNode)
        return // 注意：修改了 children 后遍历可能出错，但我们只替换当前节点，不继续遍历
      }

      // 否则调用 pandoc
      const promise = (async () => {
        try {
          // 调用 pandoc，输入 LaTeX 源码，输出带 MathML 的 HTML 片段
          const { stdout } = await execa('pandoc', [
            '-f', 'latex',
            '-t', 'html5',
            '--mathml',
            '--no-highlight'
          ], {
            input: latex,
          })
          // pandoc 输出可能包含完整的 HTML 结构（如 <!DOCTYPE ...>），我们只取 body 内的内容
          // 更稳妥的方式是使用 fromHtml 解析整个字符串，然后提取实际元素
          const fragment = fromHtml(stdout, { fragment: true })
          // 通常 pandoc 会返回一个包含数学元素的 <span> 或 <div>
          const newNode = fragment.children.length === 1 ? fragment.children[0] : fragment

          // 存入缓存
          cache.set(latex, stdout)

          // 替换原节点
          parent.children.splice(index, 1, newNode)
        } catch (error) {
		  const id = error.name.toLowerCase()
		  file.message('Pandoc Render Failed!', {
			ancestors: [parent, element],
			error,
			place: element.position,
			id,
		    source: 'rehype-pandoc-latex'
		  })
          // 失败时保留原节点，但可能仍包含 LaTeX 源码，你可以选择插入错误提示
        }
      })()

      promises.push(promise)
    })

    await Promise.all(promises)
  }
}