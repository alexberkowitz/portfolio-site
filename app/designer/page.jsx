import Text from '@/components/Text/Text';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Designer() {

  return (
    <main>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', alignSelf: 'center'}}>
        <Text>
          For as long as I&lsquo;ve been using computers (since <Text type="emphasis">the 90s</Text>!) I&lsquo;ve been using them to design things. I started with graphic design all the way back in elementary school, and quickly picked up 3D modeling and animation soon thereafter. I now have a degree in 3D Digital Graphics from The Rochester Institute of Technology, and have held professional positions as a Motion Graphics Artist, Graphic Designer, and UI/UX Designer.
        </Text>
      </p>
      <ProjectsList type="designer"/>
    </main>
  );
}