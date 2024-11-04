'use client'

import BackButton from '@/components/BackButton/BackButton';
import ImageGallery from '@/components/ImageGallery/ImageGallery';

import styles from './page.module.scss';

export default function Designer() {
  const items = [
    {src: "https://fastly.picsum.photos/id/909/200/300.jpg"},
    {src: "https://fastly.picsum.photos/id/909/300/300.jpg"},
    {src: "https://fastly.picsum.photos/id/909/300/200.jpg"},
    {src: "https://fastly.picsum.photos/id/909/300/300.jpg"},
    {src: "https://fastly.picsum.photos/id/909/200/200.jpg"},
  ];

  return (
    <main className={styles.designerPage}>
      <BackButton />
      <h1>Designer</h1>
      <ImageGallery items={items}/>
    </main>
  );
}
