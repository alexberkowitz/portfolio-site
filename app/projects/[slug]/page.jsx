import BackButton from '@/components/BackButton/BackButton';
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
    <main className={styles.projectPage}>

      <div className={styles.info}>
        <h1 className={styles.title}>
          <span>{project.metadata.title}</span>
        </h1>

        <dl className={styles.details}>
          <dt>Role</dt>
          <dd>{project.metadata.role}</dd>
          <dt>Completed</dt>
          <dd style={{whiteSpace: 'nowrap'}}>{project.metadata.date}</dd>
        </dl>
      </div>

      <CustomMDX source={project.content} />

      <BackButton />
    </main>
  )
}