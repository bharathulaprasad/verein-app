import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import { Package, FileText, Library } from 'lucide-react';
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

async function getPackageInfo() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  try {
    const fileContents = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(fileContents);
    return {
      name: packageJson.name,
      version: packageJson.version,
      license: packageJson.license,
      dependencies: packageJson.dependencies,
      devDependencies: packageJson.devDependencies,
    };
  } catch (error) {
    console.error("Could not read package.json", error);
    return null;
  }
}

export default async function ChangelogPage() {
  // Fetch both content and package info concurrently
  const [content, packageInfo] = await Promise.all([
    getChangelogContent(),
    getPackageInfo()
  ]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <FileText className="text-blue-600 dark:text-blue-400 w-8 h-8" />
        <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-400">
          Changelog & Release Notes
        </h1>
      </div>
      {packageInfo && (
        <div className="mb-8 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
          <Package className="w-5 h-5 text-slate-400" />
          <span className="font-mono capitalize">{packageInfo.name}</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">v{packageInfo.version}</span>
        </div>
      )}
      <div 
        className="prose prose-blue dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }} 
      />

      {packageInfo && (packageInfo.dependencies || packageInfo.devDependencies) && (
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <Library className="text-blue-600 dark:text-blue-400 w-8 h-8" />
            <h2 className="text-3xl font-extrabold text-blue-900 dark:text-blue-400">
              Projekt-Abhängigkeiten
            </h2>
          </div>

          {packageInfo.dependencies && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">Dependencies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                {Object.entries(packageInfo.dependencies).sort().map(([name, version]) => (
                  <div key={name} className="font-mono flex justify-between">
                    <span className="text-slate-800 dark:text-slate-200">{String(name)}</span>
                    <span className="text-slate-500 dark:text-slate-400">{String(version)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {packageInfo.devDependencies && (
            <div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-3">Dev Dependencies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                {Object.entries(packageInfo.devDependencies).sort().map(([name, version]) => (
                  <div key={name} className="font-mono flex justify-between">
                    <span className="text-slate-800 dark:text-slate-200">{String(name)}</span>
                    <span className="text-slate-500 dark:text-slate-400">{String(version)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}