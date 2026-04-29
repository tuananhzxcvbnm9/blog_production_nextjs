import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import DOMPurify from 'isomorphic-dompurify';

export async function renderMarkdown(content: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(content);
  return DOMPurify.sanitize(String(processed));
}
