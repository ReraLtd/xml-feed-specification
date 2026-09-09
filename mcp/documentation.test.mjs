import assert from 'node:assert/strict'
import test from 'node:test'

import { documents, readDocument, searchDocumentation, splitIntoSections } from './documentation.mjs'

test('all advertised documents can be read', async () => {
  for (const document of documents) {
    const loaded = await readDocument(document.id)
    assert.equal(loaded.file, document.file)
    assert.match(loaded.text, /^# /)
  }
})

test('documents are split into source-addressable sections', async () => {
  const document = await readDocument('specification')
  const sections = splitIntoSections(document)

  assert.ok(sections.length > 10)
  assert.equal(sections[0].startLine, 1)
  assert.ok(sections.every(section => section.endLine >= section.startLine))
})

test('search finds XML elements in the normative specification', async () => {
  const results = await searchDocumentation('development_id', {
    document: 'specification',
    maxResults: 3
  })

  assert.ok(results.length > 0)
  assert.equal(results[0].document, 'specification')
  assert.match(results[0].excerpt, /development_id/i)
  assert.ok(results[0].startLine > 0)
})

test('search respects its result limit', async () => {
  const results = await searchDocumentation('listing', { maxResults: 2 })
  assert.ok(results.length <= 2)
})
