import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { GET_DETAIL_NOTE } from '../graphql/QueryClient';

interface NoteDetailViewProps {
  noteId: number;
  onClose: () => void;
}

const NoteDetailView: React.FC<NoteDetailViewProps> = ({ noteId, onClose }) => {
    const { loading, error, data } = useQuery(GET_DETAIL_NOTE, {
        variables: { id: noteId },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { title, body, createdAt } = data.getDetailNote;
    const formatCreatedAt = new Date(createdAt*1).toLocaleString();
    // const test = new Date(createdAt*1000);
    // console.log(test);

    return (
        <Modal show={true} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Note Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>Title: {title}</p>
            <p>Body: {body}</p>
            <p>Created At: {formatCreatedAt}</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
            Close
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default NoteDetailView;
