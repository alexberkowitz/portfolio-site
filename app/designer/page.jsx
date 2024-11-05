import BackButton from '@/components/BackButton/BackButton';
// import ImageGallery from '@/components/ImageGallery/ImageGallery';
import { Projects } from '@/components/Projects/Projects';

import styles from './page.module.scss';

export default function Designer() {
  const items = [
    {
      src:  "https://loremflickr.com/200/300",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/300/300",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/300/200",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/300/300",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/200/200",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/301/200",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/302/200",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/303/200",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/200/201",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/200/202",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/200/203",
      href: "/"
    },
    {
      src:  "https://loremflickr.com/200/204",
      href: "/"
    },
  ];

  return (
    <main className={styles.designerPage}>
      <BackButton />
      <h1>Designer</h1>
      <Projects />
      {/* <ImageGallery items={items}/> */}
    </main>
  );
}