import Text from '@/components/Text/Text';
import Link from '@/components/Link/Link';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Designer() {

  return (
    <main>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', marginLeft: 'var(--pagePadding)'}}>
        <Text>
          For as long as I&lsquo;ve been using computers (since <Text style="emphasis">the 90s</Text>!) I&lsquo;ve been using them to design things. I started with graphic design all the way back in elementary school, and quickly picked up 3D modeling and animation soon thereafter. I now have a degree in 3D Digital Graphics from The Rochester Institute of Technology, and have held professional positions as a Motion Graphics Artist, Graphic Designer, and UI/UX Designer.
        </Text>
      </p>
      <Link href="/maker">To Maker</Link>
      <ProjectsList type="designer"/>
    </main>
  );
}