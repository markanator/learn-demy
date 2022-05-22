import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  //
};

const EnrolledUserLearnPage = (props: Props) => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <div>
      <h1>EnrolledUserLearnPage</h1>

      <pre>{JSON.stringify(slug || {}, null, 4)}</pre>
    </div>
  );
};

export default EnrolledUserLearnPage;
