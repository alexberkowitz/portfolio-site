import { notFound } from 'next/navigation';
import { CustomMDX } from '@/components/MDX/MDX';
import { getProjects } from '@/utils/projects';
import { baseUrl } from '@/sitemap';

import styles from './page.module.scss';

export async function generateStaticParams() {
  let projects = getProjects('designer')

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export function generateMetadata({ params }) {
  let project = getProjects('designer').find((project) => project.slug === params.slug)
  if (!project) {
    return
  }

  let {
    title,
    date,
    role,
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
    <main>

      <div className={styles.info}>
        <div className={styles.title}>
          <span>
            <h1>{project.metadata.title}</h1>
          </span>
        </div>

        <dl className={styles.details}>
          <dt>Role</dt>
          <dd>{project.metadata.role}</dd>
          <dt>Completed</dt>
          <dd style={{whiteSpace: 'nowrap'}}>{project.metadata.date}</dd>
        </dl>
      </div>

      <article className={styles.projectPage}>
        <CustomMDX source={project.content} />
      </article>
      
    </main>
  )
}