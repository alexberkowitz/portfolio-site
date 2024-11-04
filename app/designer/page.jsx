'use client'

import BackButton from '@/components/BackButton/BackButton';
import ImageGallery from '@/components/ImageGallery/ImageGallery';

import styles from './page.module.scss';

export default function Designer() {
  const items = [
    {src: "https://loremflickr.com/200/300"},
    {src: "https://loremflickr.com/300/300"},
    {src: "https://loremflickr.com/300/200"},
    {src: "https://loremflickr.com/300/300"},
    {src: "https://loremflickr.com/200/200"},
    {src: "https://loremflickr.com/301/200"},
    {src: "https://loremflickr.com/302/200"},
    {src: "https://loremflickr.com/303/200"},
    {src: "https://loremflickr.com/200/201"},
    {src: "https://loremflickr.com/200/202"},
    {src: "https://loremflickr.com/200/203"},
    {src: "https://loremflickr.com/200/204"},
  ];

  return (
    <main className={styles.designerPage}>
      <BackButton />
      <h1>Designer</h1>
      <ImageGallery items={items}/>
    </main>
  );
}
