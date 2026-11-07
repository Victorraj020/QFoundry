/**
 * @file types.ts
 * @description Common type definitions for the QFoundry website.
 */

export type PageId =
  | 'home'
  | 'extension'
  | 'npm'
  | 'vicnlp'
  | 'docs'
  | 'playground'
  | 'terminal'
  | 'research';

export interface DocSection {
  id: string;
  title: string;
  items: DocItem[];
}

export interface DocItem {
  id: string;
  title: string;
  category: string;
  badge?: string;
  content: string; // Markdown / HTML formatted
  toc: { id: string; title: string }[];
}

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  snippet: string;
  pageId: PageId;
  docId?: string;
}

