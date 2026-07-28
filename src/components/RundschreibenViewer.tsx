"use client";

import { useState } from "react";
import { FileNode } from "@/lib/pdfScanner";

interface Props {
  tree: FileNode[];
  defaultSelectedPdf: string | null;
}

export default function RundschreibenViewer({ tree, defaultSelectedPdf }: Props) {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(defaultSelectedPdf);
  // Expand all root folders by default
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    tree.forEach((node) => {
      if (node.type === "folder") initial[node.relativePath] = true;
    });
    return initial;
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full bg-gray-100 overflow-hidden font-sans">
      {/* LEFT SIDEBAR: Folder Tree */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800 text-base">Archiv Rundschreiben</h2>
          <p className="text-xs text-gray-500">Wählen Sie ein Dokument aus</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {tree.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">Keine PDFs gefunden in `public/rundschreiben`.</p>
          ) : (
            <TreeItem
              nodes={tree}
              selectedPdf={selectedPdf}
              onSelectPdf={setSelectedPdf}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
            />
          )}
        </div>
      </aside>

      {/* CENTER / MAIN: PDF Viewer */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-200">
        {selectedPdf ? (
          <>
            {/* Top Bar / Actions */}
            <header className="bg-white px-6 py-3 border-b border-gray-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                  PDF
                </span>
                <span className="text-sm font-medium text-gray-700 truncate">
                  {selectedPdf.split("/").pop()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                >
                  ↗ In neuem Tab öffnen
                </a>
                <a
                  href={selectedPdf}
                  download
                  className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition"
                >
                  ↓ Herunterladen
                </a>
              </div>
            </header>

            {/* Embedded PDF Container */}
            <div className="flex-1 p-4 overflow-hidden">
              <object
                key={selectedPdf} // Key forces re-render when switching files
                data={selectedPdf}
                type="application/pdf"
                className="w-full h-full rounded border border-gray-300 shadow-sm bg-white"
              >
                <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white rounded">
                  <p className="text-gray-700 font-medium mb-2">
                    Vorschau kann nicht direkt geladen werden.
                  </p>
                  <a
                    href={selectedPdf}
                    download
                    className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    PDF Herunterladen
                  </a>
                </div>
              </object>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Bitte wählen Sie ein Rundschreiben aus dem Archiv aus.
          </div>
        )}
      </main>
    </div>
  );
}

// Recursive Tree Node Renderer Component
interface TreeItemProps {
  nodes: FileNode[];
  selectedPdf: string | null;
  onSelectPdf: (path: string) => void;
  expandedFolders: Record<string, boolean>;
  onToggleFolder: (path: string) => void;
  level?: number;
}

function TreeItem({
  nodes,
  selectedPdf,
  onSelectPdf,
  expandedFolders,
  onToggleFolder,
  level = 0,
}: TreeItemProps) {
  return (
    <ul className="space-y-1">
      {nodes.map((node) => {
        const isFolder = node.type === "folder";
        const isExpanded = expandedFolders[node.relativePath];
        const isSelected = selectedPdf === node.relativePath;

        return (
          <li key={node.relativePath}>
            {isFolder ? (
              <div>
                <button
                  onClick={() => onToggleFolder(node.relativePath)}
                  style={{ paddingLeft: `${level * 12 + 8}px` }}
                  className="w-full flex items-center gap-2 py-1.5 px-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded text-left transition"
                >
                  <span>{isExpanded ? "📂" : "📁"}</span>
                  <span className="truncate">{node.name}</span>
                  <span className="ml-auto text-[10px] text-gray-400">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </button>

                {isExpanded && node.children && (
                  <TreeItem
                    nodes={node.children}
                    selectedPdf={selectedPdf}
                    onSelectPdf={onSelectPdf}
                    expandedFolders={expandedFolders}
                    onToggleFolder={onToggleFolder}
                    level={level + 1}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={() => onSelectPdf(node.relativePath)}
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                className={`w-full flex items-center gap-2 py-1.5 px-2 text-xs rounded text-left transition ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>📄</span>
                <span className="truncate">{node.name}</span>
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}