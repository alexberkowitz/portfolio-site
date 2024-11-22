import Button from '@/components/Button/Button';

const DynamicPageTitle = dynamic(() => import('@/components/PageTitle/PageTitle'), {
  ssr: false,
});

import styles from './page.module.scss';

export default function Maker() {
  return (
    <main className={styles.linksPage}>
      <DynamicPageTitle marquee>Links</DynamicPageTitle>
      <ul className={styles.links}>
        <li>
          <Button href="/">My Site</Button>
        </li>
        
        <li>
          <Button href="https://www.instagram.com/alex.berkowitz/">Instagram</Button>
        </li>
        <li>
          <Button href="https://www.printables.com/social/397588-alexberkowitz/about">Printables</Button>
        </li>
        <li>
          <Button href="https://intergalactic.design/">Intergalactic Design Co.</Button>
        </li>
        <li>
          <Button href="https://lucida.alexberkowitz.com">Lucida</Button>
        </li>
      </ul>
    </main>
  );
}
