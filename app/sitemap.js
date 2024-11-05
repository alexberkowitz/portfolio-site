import { getProjects } from '@/utils/projects'

export const baseUrl = 'https://alexberkowitz.com';

export default async function sitemap() {
  let projects = getProjects().map((project) => ({
    url: `${baseUrl}/${project.slug}`,
    lastModified: project.metadata.publishedAt,
  }));

  let projectRoutes = ['', '/'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...projectRoutes, ...projects]
}