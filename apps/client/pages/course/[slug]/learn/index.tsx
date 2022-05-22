import { useEnrolledCourseDetails } from '../../../../async/rq/user';
import { useRouter } from 'next/router';
import React from 'react';

type Props = {
  //
};

const EnrolledUserLearnPage = (props: Props) => {
  const router = useRouter();
  const { slug } = router.query;
  const { data, isLoading, error } = useEnrolledCourseDetails(slug as string);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    // @ts-ignore
    return <div>{error?.message}</div>;
  }

  return (
    <div>
      <h1>EnrolledUserLearnPage</h1>

      <pre>{JSON.stringify(data || {}, null, 4)}</pre>
    </div>
  );
};

export default EnrolledUserLearnPage;
