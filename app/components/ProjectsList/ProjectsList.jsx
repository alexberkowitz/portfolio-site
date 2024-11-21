/*
Projects logic based on https://github.com/vercel/examples/tree/main/solutions/blog/app/blog
*/

import Link from '@/components/Link/Link';
import { getProjects } from '@/utils/projects';

import styles from './projectsList.module.scss';

export function ProjectsList(props) {
  let allProjects = getProjects(props.type);

  const coverImage = (source, alt) => {
    const videoTypes = ["mp4"];

    // Support videos and images
    if( videoTypes.indexOf(source?.split('.')[1]) >= 0 ){
      return (
        <video
          className={styles.cover}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          >
        <source src={source} type="video/mp4"></source>
      </video>
      )
    } else {
      return <img src={source} alt={alt} className={styles.cover} />
    }
  }

  return (
    <ul className={styles.projectsList}>
      {allProjects
        .sort((a, b) => { return a.metadata.title < b.metadata.title ? -1 : 1 }) // Alphabetical sorting
        .map((project) => (
          <li key={project.slug} style={{
            '--colSpan': project.metadata.width,
            '--rowSpan': project.metadata.height,
          }}>
            <Link
              href={`/projects/${project.slug}`}
              >
              {coverImage(project.metadata.cover, project.metadata.title)}
              <div className={styles.info}>
                <p className={styles.type}>{project.metadata.type}</p>
                <p className={styles.title}>{project.metadata.title}</p>
              </div>
            </Link>
          </li>
        ))}
    </ul>
  )
}