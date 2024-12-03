import Text from '@/components/Text/Text';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Developer() {
  return (
    <main>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', alignSelf: 'center'}}>
        <Text>
          I&lsquo;ve been developing websites and apps for over fifteen years. My passion is front-end development&mdash;I&lsquo;m one of the few developers who actually loves CSS&mdash;and I&lsquo;m well-versed in many common frameworks and libraries. Currently, I&lsquo;m working as a <Text type="accent">Senior Web UI Application Developer at UScellular</Text>.
          <br/><br/>
          In case you were wondering, this site is built with Next.js. P5.js is used for some of the fancier effects; all other effects are pure CSS/JavaScript.
        </Text>
      </p>
      <ProjectsList type="developer"/>
    </main>
  );
}
