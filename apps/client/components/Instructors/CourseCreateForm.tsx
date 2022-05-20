import { Course, IS3Image, Lesson } from '../../types';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Row, Col, InputGroup, Badge, Image } from 'react-bootstrap';
import FileResizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import RearrangeLessons from './courseForms/ReArrangeLessons';
import UpdateLessonModal from './courseForms/UpdateLessonModal';
import {
  useCreateCourseMutation,
  useRemoveImageMutation,
  useUpdateCourseMutation,
  useUploadImageMutation,
} from '../../async/rq/courses';

type Props = {
  course?: Course;
  isEditing?: boolean;
};

const initialState = {
  name: '',
  description: '',
  price: 9.99,
  paid: false,
  category: '',
  lessons: [],
  loading: false,
};

export type SlimCourse = Omit<Course, '_id' | 'slug' | 'published' | 'instructor'>;

const CourseCreateForm = ({ course, isEditing = false }: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState<SlimCourse>(
    (course && {
      ...course,
    }) ||
      initialState
  );
  const [image, setImage] = useState<IS3Image>(course?.image ?? undefined);
  const [imgPreview, setImgPreview] = useState(course?.image?.Location ?? '');
  const [uploadButtonText, setUploadButtonText] = useState<'Image Upload' | string>('Image Upload');
  // edit lessons state
  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [currentLessonToEdit, setCurrentLessonToEdit] = useState<Lesson>(null);

  // RQ
  const { mutateAsync: uploadImageToS3 } = useUploadImageMutation();
  const { mutateAsync: removeInitialImage } = useRemoveImageMutation();
  const { mutateAsync: createCourse } = useCreateCourseMutation();
  const { mutateAsync: updateCourse } = useUpdateCourseMutation();

  useEffect(() => {
    if (course) {
      const tempCourse: SlimCourse = {
        lessons: course.lessons,
        name: course.name,
        description: course.description,
        price: course.price,
        paid: course.paid,
        category: course.category,
        image: course.image,
      };
      if (tempCourse !== values) {
        setValues({
          ...course,
        });
      }
      return;
    }
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  const openEditLessonModal = useCallback(
    (lesson: Lesson) => () => {
      setCurrentLessonToEdit(lesson);
      setIsEditLessonModalOpen(true);
    },
    []
  );

  const closeEditLessonModal = useCallback(() => {
    setIsEditLessonModalOpen(false);
    setCurrentLessonToEdit(null);
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (event) => {
    event.preventDefault();
    setIsLoading(true);
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
          setIsLoading(false);
        }
      });
    }
  };

  const handleRemoveImage = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await removeInitialImage(image);
      setImgPreview('');
      setImage(undefined);
      setUploadButtonText('Image Upload');
    } catch (error) {
      console.warn(error?.message);
      toast.error('Image uploaded failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createCourse({ ...values, image });
      toast.success('Course created successfully. Redirecting to courses page');
      router.push('/instructor');
      setValues(initialState);
    } catch (error) {
      console.warn(error?.message);
      toast.error('Image uploaded failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = async (e?: any) => {
    e?.preventDefault();
    if (!isEditing || !course?.slug) {
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await updateCourse({ courseSlug: course?.slug, data: { ...values, image } });
      if (data?.course) {
        console.log('updatedCourse', data?.course);
        setValues(data.course);
        setImage(data.course?.image);
        setImgPreview(data.course?.image?.Location ?? '');
        toast.success('Course updated successfully');
      }
    } catch (error) {
      console.warn(error?.message);
      toast.error('Course update failed. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={!isEditing ? handleSubmit : handleUpdate} className="form">
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
                value={String(values.paid)}
                onChange={handleChange}
                required
              >
                <option>--- Select an option ---</option>
                <option value={'true'}>Paid</option>
                <option value={'false'}>Free</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {values.paid && (
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
                    onClick={handleRemoveImage}
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
              </Row>
            </Col>
          )}
        </Row>

        <Row>
          <Col className=" d-flex justify-content-center align-items-center">
            <Button
              type="submit"
              disabled={isLoading}
              variant={classNames({ success: isEditing, primary: !isEditing })}
              className="w-25 my-3"
            >
              {isLoading ? 'Saving...' : !isEditing ? 'Save & Continue' : 'Update Course'}
            </Button>
          </Col>
        </Row>
      </Form>
      {isEditing && values?.lessons?.length && (
        <>
          <RearrangeLessons
            values={values}
            setValues={setValues}
            afterChange={handleUpdate}
            openEditLessonModal={openEditLessonModal}
          />
          <UpdateLessonModal
            isOpen={isEditLessonModalOpen}
            handleClose={closeEditLessonModal}
            currentLessonToEdit={currentLessonToEdit}
            setCurrentLessonToEdit={setCurrentLessonToEdit}
          />
        </>
      )}
    </>
  );
};

export default CourseCreateForm;
