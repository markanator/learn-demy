import React from 'react';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';

type Props = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  values: {
    name: string;
    description: string;
    price: string;
    uploading: boolean;
    paid: string;
    loading: boolean;
    category: string;
  };
  imgPreview?: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CourseCreateForm = ({
  handleSubmit,
  values,
  handleChange,
  handleImage,
  imgPreview,
}: Props) => {
  return (
    <Form onSubmit={handleSubmit} className="form">
      <Form.Group className="mb-3">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <textarea
          name="description"
          placeholder="Description"
          cols={7}
          rows={7}
          value={values.description}
          className="form-control"
          onChange={handleChange}
        ></textarea>
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Select
              name="paid"
              style={{ width: '100%' }}
              value={values.paid}
              onChange={handleChange}
              required
            >
              <option>--- Select an option ---</option>
              <option value={'true'}>Paid</option>
              <option value={'false'}>Free</option>
            </Form.Select>
          </Form.Group>
        </Col>
        {values.paid === 'true' && (
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="1.00"
                min="1.00"
                max="599.99"
                step="1"
                name="price"
                inputMode="numeric"
                required
                aria-label="Dollar amount (with dot and two decimal places)"
                onChange={handleChange}
              />
            </InputGroup>
          </Col>
        )}
      </Row>

      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          name="category"
          className="form-control"
          placeholder="Category"
          value={values.category}
          onChange={handleChange}
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label className="btn btn-outline-secondary btn-block text-left">
              {values.loading ? 'Uploading' : 'Image Upload'}
              <Form.Control
                type="file"
                name="image"
                className="w-100"
                onChange={handleImage}
                accept="image/*"
                hidden
              />
            </Form.Label>
          </Form.Group>
        </Col>
        {imgPreview && (
          <Col>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgPreview}
              alt="iamge preview"
              className="img-fluid"
              height={100}
              width={100}
            />
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <Button type="submit" disabled={values.loading || values.uploading}>
            {values.loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CourseCreateForm;