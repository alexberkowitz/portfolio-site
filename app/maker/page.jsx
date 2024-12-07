import Text from '@/components/Text/Text';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';
import Link from '@/components/Link/Link';

export default function Maker() {
  return (
    <main>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', alignSelf: 'center'}}>
        <Text>
          For all of the love that I hold for digital content creation, I also really, really enjoy making physical products. I have an extensive history as an amateur maker & product designer. I&lsquo;ve designed products for companies, such as the <Link href="/projects/mercury">Mercury Knife</Link> for Kizer, as well as for myself. I&lsquo;m well-versed in CAD/CAM, 3D printing, CNC machining, and a whole slew of other manufacturing processes ranging from DIY to industrial.
          <br/><br/>
          If you want to keep up with my latest projects, check out my <Link href="https://www.instagram.com/alex.berkowitz">Instagram page</Link>.
        </Text>
      </p>
      <ProjectsList type="maker"/>
    </main>
  );
}