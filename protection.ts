const ALLOWED_ROOTS = [
  "README.md",
  "index.html",
  "src/",
];

export function guardPath(path: string): void {
  const ok = ALLOWED_ROOTS.some(root => {
    if (root.endsWith("/")) {
      return path.startsWith(root);
    }
    return path === root;
  });

  if (!ok) {
    throw new Error(`Path '${path}' is not in the allowed modification set.`);
  }
}
