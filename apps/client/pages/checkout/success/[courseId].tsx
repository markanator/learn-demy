import { SyncOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useValidateStripePurchase } from '../../../async/rq/courses';
import ProtectedUserPage from '../../../components/ProtectedPages/UserRotues';

type Props = {
  //
};

const OrderSuccessPage = (props: Props) => {
  const router = useRouter();
  const { courseId } = router.query;

  const { data, isLoading, error } = useValidateStripePurchase(courseId as string);

  useEffect(() => {
    if (!isLoading && !error && data) {
      toast.success('Purchase Successful');
      router.push(`/course/${data?.slug}/learn`);
    } else if (!isLoading && error) {
      toast.success('Purchase Failed');
      router.push('/user');
    }
  }, [data, error, isLoading, router]);

  return (
    <ProtectedUserPage showSidebar={false}>
      <Row className="row text-center">
        <Col>
          <div className="d-flex justify-content-center p-5">
            <SyncOutlined spin className="display-4 text-success p-5" />
          </div>
        </Col>
      </Row>
    </ProtectedUserPage>
  );
};

export default OrderSuccessPage;
