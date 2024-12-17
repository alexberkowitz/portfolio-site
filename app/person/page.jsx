import Text from '@/components/Text/Text';
import Link from '@/components/Link/Link';

import styles from './page.module.scss';

export default function Person() {
  return (
    <main className={styles.personPage}>

      <div className={styles.portrait}>
        <img src="/media/portrait.jpg" alt="Photo of Alex"/>
      </div>

      <div className={styles.bio}>
        <h1 className={styles.title}>Hi, I&rsquo;m Alex.</h1>
        <p>
          I&rsquo;m a designer, developer, & maker from Chicago. I love designing interfaces, slinging code, building brands, and creating things of all types. No matter the medium, every project I work on is designed with intent and crafted with care.
          <br/><br/>
          I&rsquo;m currently working as a <Text type="emphasis">Senior Front-End Developer at UScellular</Text>, helping to build new experiences&mdash;and keep the old ones from falling apart&mdash;across all platforms.
          <br/><br/>
          When I&rsquo;m not lost in JavaScript debugging hell, I can usually be found working on new <Link href="/designer">designs</Link> or tinkering with some <Link href="/maker">project</Link>. But sometimes I get tired of doing those things and just hang out with my cat and my wife (in that order).
          <br/><br/>
          For more info on my work experience and skillset, check out my <Link href="/resume">digital résumé</Link>. If you&rsquo;d like to talk about my work, or if you have a project you&rsquo;d like to discuss, feel free to <Link href="mailto:alex@alexberkowitz.com">get in touch</Link>.
        </p>
      </div>

    </main>
  );
}