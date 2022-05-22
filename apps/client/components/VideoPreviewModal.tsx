import { partial } from 'lodash';
import React from 'react';
import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';

type Props = {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  preview: string;
};

const VideoPreviewModal = ({ preview, setShowModal, showModal }: Props) => {
  return (
    <Modal show={showModal} onHide={partial(setShowModal, false)} size="lg">
      <div className="m-0 p-0">
        <ReactPlayer url={preview} playing={showModal} controls width="100%" height="100%" />
      </div>
    </Modal>
  );
};

export default VideoPreviewModal;
