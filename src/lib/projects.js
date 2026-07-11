const projectModules = import.meta.glob('/src/content/portfolio/*.mdx', { eager: true });
const imageModules = import.meta.glob('/src/images/**/*.{avif,gif,jpeg,jpg,png,webp}', {
  eager: true,
  import: 'default'
});

export function resolveImage(imagePath) {
  if (!imagePath) return '';

  const normalizedPath = imagePath
    .replace(/^(\.\.\/)+images\//, '/src/images/')
    .replace(/^\/src\/images\//, '/src/images/');

  return imageModules[normalizedPath] || imagePath;
}

export function getAllProjects() {
  return Object.entries(projectModules)
    .map(([path, module]) => {
      const slug = path.match(/\/portfolio\/([^/]+)\.mdx$/)?.[1];

      return {
        id: path,
        slug,
        Content: module.default,
        frontmatter: module.frontmatter,
        marqueeImage: resolveImage(module.frontmatter?.marqueeImage)
      };
    })
    .filter((project) => project.slug && project.frontmatter?.published !== false)
    .sort((a, b) => (a.frontmatter.sortOrder ?? 999) - (b.frontmatter.sortOrder ?? 999));
}

export function getMainProjects() {
  return getAllProjects().filter((project) => project.frontmatter.isMainProject);
}

export function getFeaturedProjects() {
  return getAllProjects().filter((project) => project.frontmatter.isFeatured);
}

export function getProjectBySlug(slug) {
  return getAllProjects().find((project) => project.slug === slug);
}
