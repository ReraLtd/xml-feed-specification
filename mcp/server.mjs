#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/server'
import { serveStdio } from '@modelcontextprotocol/server/stdio'
import * as z from 'zod/v4'

import { documents, readDocument, searchDocumentation } from './documentation.mjs'

const documentIds = documents.map(document => document.id)
const documentId = z.enum(documentIds)

function createServer() {
  const server = new McpServer(
    { name: 'rera-xml-documentation', version: '1.0.0' },
    {
      instructions: 'Use search_documentation to find relevant rules, then read_documentation when the full source is needed. Treat the specification document as normative and examples as illustrative.'
    }
  )

  for (const document of documents) {
    const uri = `rera-docs://documents/${document.id}`
    server.registerResource(
      document.id,
      uri,
      {
        title: document.title,
        description: document.description,
        mimeType: 'text/markdown'
      },
      async () => {
        const loaded = await readDocument(document.id)
        return { contents: [{ uri, mimeType: 'text/markdown', text: loaded.text }] }
      }
    )
  }

  server.registerTool(
    'list_documentation',
    {
      title: 'List RERA XML documentation',
      description: 'List the documentation sources available from this server.',
      inputSchema: z.object({})
    },
    async () => ({
      content: [{ type: 'text', text: JSON.stringify(documents, null, 2) }]
    })
  )

  server.registerTool(
    'read_documentation',
    {
      title: 'Read RERA XML documentation',
      description: 'Read one complete Markdown document from the RERA XML feed specification.',
      inputSchema: z.object({
        document: documentId.describe('Document id returned by list_documentation')
      })
    },
    async ({ document }) => {
      const loaded = await readDocument(document)
      return { content: [{ type: 'text', text: loaded.text }] }
    }
  )

  server.registerTool(
    'search_documentation',
    {
      title: 'Search RERA XML documentation',
      description: 'Search headings and content across the specification, examples, overview, and changelog. Returns ranked excerpts with source lines.',
      inputSchema: z.object({
        query: z.string().trim().min(1).describe('Text, XML element, enum value, or phrase to find'),
        document: documentId.optional().describe('Optional document id to search'),
        maxResults: z.number().int().min(1).max(20).default(8).describe('Maximum number of matches')
      })
    },
    async ({ query, document, maxResults }) => {
      const results = await searchDocumentation(query, { document, maxResults })
      return {
        content: [{
          type: 'text',
          text: results.length > 0
            ? JSON.stringify(results, null, 2)
            : `No documentation matches found for: ${query}`
        }]
      }
    }
  )

  return server
}

serveStdio(createServer, {
  onerror: error => console.error(error)
})
