import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const documents = [
  {
    id: 'overview',
    title: 'RERA XML Feed Specification overview',
    description: 'Purpose, data model, synchronization model, and documentation entry points.',
    file: 'README.md'
  },
  {
    id: 'specification',
    title: 'Complete RERA XML Feed Specification',
    description: 'Normative feed structure, fields, values, validation rules, and synchronization guidance.',
    file: 'import-specification.md'
  },
  {
    id: 'examples',
    title: 'XML examples',
    description: 'Complete XML feed examples for common listing types.',
    file: 'examples.md'
  },
  {
    id: 'engineering-prompt',
    title: 'Engineering prompt for a RERA XML feed integration',
    description: 'A ready-to-use coding-agent prompt for integrating feed generation into an existing project.',
    file: 'engineering-prompt.md'
  },
  {
    id: 'changelog',
    title: 'Specification changelog',
    description: 'Version history and changes to the specification.',
    file: 'changelog.md'
  }
]

const byId = new Map(documents.map(document => [document.id, document]))

export async function readDocument(id) {
  const document = byId.get(id)

  if (!document) {
    throw new Error(`Unknown document: ${id}`)
  }

  return {
    ...document,
    text: await readFile(resolve(projectRoot, document.file), 'utf8')
  }
}

export function splitIntoSections(document) {
  const lines = document.text.split('\n')
  const headings = []

  for (let index = 0; index < lines.length; index += 1) {
    const match = /^(#{1,6})\s+(.+)$/.exec(lines[index])
    if (match) headings.push({ index, title: match[2] })
  }

  if (headings.length === 0) {
    return [{ title: document.title, startLine: 1, endLine: lines.length, text: document.text }]
  }

  return headings.map((heading, index) => {
    const endIndex = headings[index + 1]?.index ?? lines.length
    return {
      title: heading.title,
      startLine: heading.index + 1,
      endLine: endIndex,
      text: lines.slice(heading.index, endIndex).join('\n').trim()
    }
  })
}

export async function searchDocumentation(query, options = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
  const selectedDocuments = options.document
    ? [await readDocument(options.document)]
    : await Promise.all(documents.map(document => readDocument(document.id)))

  const results = selectedDocuments
    .flatMap(document => splitIntoSections(document).map(section => ({ document, section })))
    .map(result => {
      const title = result.section.title.toLocaleLowerCase()
      const text = result.section.text.toLocaleLowerCase()
      const exactMatches = text.split(normalizedQuery).length - 1
      const matchedTokens = tokens.filter(token => text.includes(token)).length
      const titleMatches = tokens.filter(token => title.includes(token)).length
      const score = exactMatches * 20 + matchedTokens * 2 + titleMatches * 5
      return { ...result, score }
    })
    .filter(result => result.score > 0)
    .sort((left, right) => right.score - left.score || left.section.startLine - right.section.startLine)
    .slice(0, options.maxResults ?? 8)

  return results.map(({ document, section }) => ({
    document: document.id,
    file: document.file,
    heading: section.title,
    startLine: section.startLine,
    endLine: section.endLine,
    excerpt: makeExcerpt(section.text, normalizedQuery, tokens)
  }))
}

function makeExcerpt(text, query, tokens) {
  const normalizedText = text.toLocaleLowerCase()
  let matchIndex = normalizedText.indexOf(query)

  if (matchIndex === -1) {
    matchIndex = tokens.reduce((index, token) => {
      if (index !== -1) return index
      return normalizedText.indexOf(token)
    }, -1)
  }

  const maxLength = 1400
  if (text.length <= maxLength) return text

  const start = Math.max(0, matchIndex - 300)
  const end = Math.min(text.length, start + maxLength)
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`
}
