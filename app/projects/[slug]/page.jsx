import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/MDX/MDX';
import { getProjects } from '@/utils/projects';
import { baseUrl } from '@/sitemap';

import styles from './page.module.scss';

export async function generateStaticParams() {
  let projects = getProjects();

  return projects.map((project) => ({
    slug: project.slug
  }));
}

export function generateMetadata({ params }) {
  let project = getProjects().find((project) => project.slug === params.slug)
  if (!project) {
    return
  }

  let {
    title,
    date,
    cover
  } = project.metadata

  return {
    title,
    description: title,
    openGraph: {
      title,
      type: 'article',
      publishedTime: date,
      url: `${baseUrl}/${project.slug}`,
      image: [
        {
          url: cover,
        },
      ],
    },
    twitter: {
      card: cover,
      title,
      description: title,
      images: [cover],
    },
  }
}

export default function Project({ params }) {
  let project = getProjects().find((project) => project.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <main className={styles.projectPage}>

      <div className={styles.info}>
        <div className={styles.title}>
          <h1>
            <span className={styles.textWrapper}>{project.metadata.title}</span>
          </h1>
        </div>

        <dl className={styles.details}>
          <dt>Role</dt>
          <dd>{project.metadata.role}</dd>
          {project.metadata.date && (<>
            <dt>Completed</dt>
            <dd style={{whiteSpace: 'nowrap'}}>{project.metadata.date}</dd>
          </>)}
          {project.metadata.tools && (<>
            <dt>Tools Used</dt>
            <dd>{project.metadata.tools}</dd>
          </>)}
        </dl>
      </div>

      <article>
        <CustomMDX source={project.content} />
      </article>
      
    </main>
  )
}