import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'See what\'s new in the latest version of the SVS-NBG website.',
};

async function getChangelogContent() {
  // We go to the project root to find the CHANGELOG.md
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  try {
    const fileContents = await fs.readFile(changelogPath, 'utf8');
    // Convert markdown to HTML
    const htmlContent = await marked(fileContents);
    return htmlContent;
  } catch (error) {
    console.error("Could not read CHANGELOG.md", error);
    return '<p>Changelog could not be loaded. Please try again later.</p>';
  }
}

export default async function ChangelogPage() {
  const content = await getChangelogContent();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400 mb-8">
        Changelog & Release Notes
      </h1>
      <div 
        className="prose prose-blue dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    </div>
  );
}