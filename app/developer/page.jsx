import Text from '@/components/Text/Text';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Developer() {
  return (
    <main>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', alignSelf: 'center'}}>
        <Text>
          I&rsquo;ve been developing websites and apps for over fifteen years. My passion is front-end development&mdash;I&rsquo;m one of the few developers who actually loves CSS&mdash;and I&rsquo;m well-versed in many common frameworks and libraries. Currently, I&rsquo;m working as a <Text type="emphasis">Senior Web UI Application Developer at UScellular</Text>.
          <br/><br/>
          In case you were wondering, this site is built with Next.js. I used P5.js for some of the fancier effects; all other effects are pure CSS/JavaScript.
        </Text>
      </p>
      <ProjectsList type="developer"/>
    </main>
  );
}
