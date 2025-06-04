import Text from '@/components/Text/Text';
import Link from '@/components/Link/Link';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Developer() {
  return (
    <main>
      <div style={{
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '2lh',
        padding: 'calc(var(--pagePadding) * 2) 0',
        }}>
        <p>
          <Text>
            I&apos;ve been developing websites and apps for over fifteen years. My specialty is front-end development&mdash;I&apos;m one of the few developers who actually loves CSS&mdash;and I&apos;m well-versed in many common frameworks and libraries. Currently, I&apos;m working as a <Text type="emphasis">Senior Web UI Application Developer at UScellular</Text>.
          </Text>
        </p>
        <p>
          <Text>
            The projects here represent a small sample of my personal and side work. If you&apos;d like to see my professional work, check out <Link href="https://uscellular.com">uscellular.com</Link>, I suppose.
          </Text>
        </p>
        <p>
          <Text>
            In case you were wondering, this site is built with Next.js. I used P5.js for some of the fancier effects; all other effects are pure CSS/JavaScript.
          </Text>
        </p>
      </div>
      <ProjectsList type="developer"/>
    </main>
  );
}
