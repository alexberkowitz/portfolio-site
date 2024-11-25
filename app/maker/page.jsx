import Text from '@/components/Text/Text';
import { ProjectsList } from '@/components/ProjectsList/ProjectsList';

export default function Maker() {
  return (
    <main>
      <p style={{padding: 'calc(var(--pagePadding) * 2) 0', alignSelf: 'center'}}>
        <Text>
          For all of the love that I hold for digital content creation, I also really love making real, physical products. I have an extensive history as an amateur maker & product designer. I've designed products for companies, such as the Mercury Knife for Kizer, as well as for myself. I'm well-versed in CAD/CAM, 3D printing, CNC machining, and a whole slew of other manufacturing processes ranging from DIY to industrial. 
        </Text>
      </p>
      <ProjectsList type="maker"/>
    </main>
  );
}