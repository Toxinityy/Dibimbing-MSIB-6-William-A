import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { CREATE_NOTE, GET_NOTES } from '../graphql/QueryClient';

interface CreateNoteModalProps {
  show: boolean;
  onHide: () => void;
  refetchNotes: () => void;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ show, onHide, refetchNotes }) => {
    const [formData, setFormData] = useState({ title: '', body: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const [createNote] = useMutation(CREATE_NOTE, {
        variables: { title: formData.title, body: formData.body },
        refetchQueries: [{ query: GET_NOTES}],
        onCompleted: () => {
        onHide();
        refetchNotes();
        },
    });

    const handleCreateNote = async () => {
        try {
        await createNote();
        } catch (error) {
        console.error('Error creating note:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Create Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group controlId="formBody">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter body"
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    />
                </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                Close
                </Button>
                <Button variant="primary" onClick={handleCreateNote}>
                Create Note
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateNoteModal;
