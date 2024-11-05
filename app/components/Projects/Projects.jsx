/*
Projects logic based on https://github.com/vercel/examples/tree/main/solutions/blog/app/blog
*/

import Link from '@/components/Link/Link';
import { getProjects } from '@/utils/projects';

export function Projects(props) {
  let allProjects = getProjects(props.type);

  return (
    <div>
      {allProjects
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            hoverTarget={true}
            >
            <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
              <p className="text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums">
                {project.metadata.publishedAt}
              </p>
              <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                {project.metadata.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}