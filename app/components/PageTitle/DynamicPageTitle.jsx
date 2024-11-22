// Dynamic import module for PageTitle component

import dynamic from 'next/dynamic';

const PageTitle = dynamic(() => import('./PageTitle'), {
  ssr: false,
});

const DynamicPageTitle = (props) => {
  return <PageTitle {...props} />
}

export default DynamicPageTitle;