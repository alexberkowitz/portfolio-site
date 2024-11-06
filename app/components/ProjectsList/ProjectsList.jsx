/*
Projects logic based on https://github.com/vercel/examples/tree/main/solutions/blog/app/blog
*/

import Link from '@/components/Link/Link';
import { getProjects } from '@/utils/projects';

import styles from './projectsList.module.scss';

export function ProjectsList(props) {
  let allProjects = getProjects(props.type);

  return (
    <ul className={styles.projectsList}>
      {allProjects
        .sort((a, b) => { return a.metadata.title < b.metadata.title ? -1 : 1 }) // Alphabetical sorting
        .map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              noTarget={true}
              >
              <img src={project.metadata.cover} className={styles.cover} />
              <div className={styles.info}>
                <p className={styles.title}>
                  {project.metadata.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
    </ul>
  )
}