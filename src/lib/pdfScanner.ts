import fs from "fs";
import path from "path";

export interface FileNode {
  name: string;
  relativePath: string; // URL path relative to /public (e.g. "/rundschreiben/2026/07-Juli.pdf")
  type: "file" | "folder";
  children?: FileNode[];
}

/**
 * Recursively scans public/rundschreiben and builds a folder tree structure.
 * Automatically sorts entries in descending order so newest years/months appear first.
 */
export function getRundschreibenTree(): FileNode[] {
  const baseDir = path.join(process.cwd(), "public", "rundschreiben");

  if (!fs.existsSync(baseDir)) {
    return [];
  }

  function readDirectory(dirPath: string, urlPath: string): FileNode[] {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    // Sort descending (e.g. "2026" before "2025", "07" before "06")
    items.sort((a, b) => b.name.localeCompare(a.name, undefined, { numeric: true }));

    const nodes: FileNode[] = [];

    for (const item of items) {
      // Ignore hidden files like .DS_Store
      if (item.name.startsWith(".")) continue;

      const fullPath = path.join(dirPath, item.name);
      const currentUrlPath = `${urlPath}/${item.name}`;

      if (item.isDirectory()) {
        const children = readDirectory(fullPath, currentUrlPath);
        // Only include folder if it contains files
        if (children.length > 0) {
          nodes.push({
            name: item.name,
            relativePath: currentUrlPath,
            type: "folder",
            children,
          });
        }
      } else if (item.isFile() && item.name.toLowerCase().endsWith(".pdf")) {
        nodes.push({
          name: item.name,
          relativePath: currentUrlPath,
          type: "file",
        });
      }
    }

    return nodes;
  }

  return readDirectory(baseDir, "/rundschreiben");
}

/**
 * Finds the first (latest) PDF file in the tree to use as default.
 */
export function findLatestPdf(nodes: FileNode[]): string | null {
  for (const node of nodes) {
    if (node.type === "file") {
      return node.relativePath;
    }
    if (node.type === "folder" && node.children) {
      const found = findLatestPdf(node.children);
      if (found) return found;
    }
  }
  return null;
}