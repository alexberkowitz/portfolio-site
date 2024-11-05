import { getProjects } from '@/utils/projects'

export const baseUrl = 'https://alexberkowitz.com';

export default async function sitemap() {
  let designerProjects = getProjects('designer').map((project) => ({
    url: `${baseUrl}/designer/${project.slug}`,
    lastModified: project.metadata.publishedAt,
  }));

  let designerRoutes = ['', '/designer'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...designerRoutes, ...designerProjects]
}