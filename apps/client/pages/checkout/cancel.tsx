import ProtectedUserPage from '../../components/ProtectedPages/UserRotues';
import React from 'react';
import { CloudSyncOutlined } from '@ant-design/icons';
import { Col, Row } from 'react-bootstrap';

type Props = {
  //
};

const PurchaseCancellationPage = (props: Props) => {
  return (
    <ProtectedUserPage showSidebar={false}>
      <Row className="row text-center">
        <Col>
          <CloudSyncOutlined className="display-1 text-danger p-5" />
          <h5 className="lead">Payment failed. Try again.</h5>
        </Col>
        {/* <Col md={3}></Col> */}
      </Row>
    </ProtectedUserPage>
  );
};

export default PurchaseCancellationPage;
