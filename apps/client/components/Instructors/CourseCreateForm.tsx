import { Course, IS3Image } from '../../types';
import React, { useState } from 'react';
import { Button, Form, Row, Col, InputGroup, Badge, Image } from 'react-bootstrap';
import FileResizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { createCourse, removeInitialImage, uploadImageToS3 } from '../../async/api/courses';
import { useRouter } from 'next/router';

type Props = {
  course?: Course;
  isEditing?: boolean;
};

const initialState = {
  name: '',
  description: '',
  price: 9.99,
  paid: '',
  category: '',
  loading: false,
};

const CourseCreateForm = ({ course, isEditing = false }: Props) => {
  const router = useRouter();
  const [values, setValues] = useState(
    { ...course, paid: course?.paid.toString(), loading: false } ?? initialState
  );
  const [image, setImage] = useState<IS3Image>(course?.image ?? undefined);
  const [imgPreview, setImgPreview] = useState(course?.image?.Location ?? '');
  const [uploadButtonText, setUploadButtonText] = useState<'Image Upload' | string>('Image Upload');

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (event) => {
    event.preventDefault();
    setValues({ ...values, loading: true });
    const file = event.target.files[0];
    if (file) {
      setImgPreview(window.URL.createObjectURL(file));
      setUploadButtonText(file.name);

      // resize
      FileResizer.imageFileResizer(file, 1280, 720, 'JPEG', 100, 0, async (uri) => {
        try {
          const { data } = await uploadImageToS3({ image: uri as string });
          setImage(data as IS3Image);
          toast.success('Image uploaded successfully');
        } catch (error) {
          console.warn(error?.message);
          toast.error('Image uploaded failed. Please try again');
        } finally {
          setValues({ ...values, loading: false });
        }
      });
    }
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });

    try {
      await removeInitialImage(image);
      setImgPreview('');
      setImage(undefined);
      setUploadButtonText('Image Upload');
    } catch (error) {
      console.warn(error?.message);
      toast.error('Image uploaded failed. Please try again');
    } finally {
      setValues({ ...values, loading: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    try {
      await createCourse({ ...values, image });
      toast.success('Course created successfully. Redirecting to courses page');
      router.push('/instructor');
      setValues(initialState);
    } catch (error) {
      console.warn(error?.message);
      toast.error('Image uploaded failed. Please try again');
    } finally {
      setValues({ ...values, loading: false });
    }
  };
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
                name="price"
                pattern="^\d+(\.|\,)\d{2}$"
                required
                aria-label="Dollar amount (with dot and two decimal places)"
                value={values.price}
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
              <span>{uploadButtonText}</span>
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
          <Col className="position-relative">
            <Row className="position-relative">
              <Col>
                <Badge
                  pill
                  onClick={handleRemove}
                  className="position-absolute cursor-pointer"
                  style={{ top: '-5px', left: '0px', cursor: 'pointer' }}
                >
                  X
                </Badge>
                <Image
                  src={imgPreview}
                  alt="iamge preview"
                  className="img"
                  style={{ objectFit: 'cover' }}
                  height={100}
                  width="auto"
                />
              </Col>
              <Col>
                {isEditing && image && (
                  <Image
                    src={image?.Location}
                    alt="imge preview"
                    className="img"
                    style={{ objectFit: 'cover' }}
                    height={100}
                    width="auto"
                  />
                )}
              </Col>
            </Row>
          </Col>
        )}
      </Row>

      <Row>
        <Col>
          <Button type="submit" disabled={values.loading}>
            {values.loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CourseCreateForm;
