import { HomePageQueryResult } from '@/sanity.types';

const HomeTemplate = ({ homepage }: { homepage: HomePageQueryResult }) => {
  return (
    <div>
      <h1>{homepage?.name}</h1>
    </div>
  )
};

export default HomeTemplate;
