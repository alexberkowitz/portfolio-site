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
    publishedAt: publishedTime,
    summary: description,
    image,
  } = project.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/${project.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function Project({ params }) {
  let project = getProjects().find((project) => project.slug === params.slug)

  if (!project) {
    notFound()
  }

  return (
    <>

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

      <main className={styles.projectPage}>
      <CustomMDX source={project.content} />
      </main>
      
    </>
  )
}