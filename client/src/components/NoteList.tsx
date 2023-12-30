import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { GET_NOTES, DELETE_NOTE, EDIT_NOTE} from '../graphql/QueryClient';
import NoteDetailView from './NoteDetailView';

interface Note {
    id: number;
    title: string;
    body: string;
}

const NoteList: React.FC = () => {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    const { loading, error, data} = useQuery(GET_NOTES);
    const [editNote] = useMutation(EDIT_NOTE);
    const [deleteNote] = useMutation(DELETE_NOTE, {
        refetchQueries: [{ query: GET_NOTES }],
    });

    const handleViewNote = (id: number) => {
        setSelectedNoteId(id);
    };
    
    const handleEditNote = (note: Note) => {
        setSelectedNote(note);
        setShowModal(true);
    };

    const handleDeleteNote = async (id: number) => {
        try {
            await deleteNote({
                variables: { id },
            });
            console.log("kedelete")
            // refetch();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleCloseModal = () => {
        setSelectedNote(null);
        setShowModal(false);
        setSelectedNoteId(null);
    };

    const handleEditNoteSubmit = async (id: number, title: string, body: string) => {
        try {
        const result = await editNote({ variables: { id, title, body } });
        if(result.data.editNote) {
            console.log('Note edited successfully!');
        } else {
            console.log('Failed to edit note.');
        }
        handleCloseModal();
        } catch (error) {
        console.error('Error editing note:', error);
        }
    };

    if(loading) return <p>Loading...</p>;
    if(error) return <p>Error: {error.message}</p>;

    const notes = data.notes as Note[];

    return (
        <div>
            {notes.length === 0 ? (
                <p>Tidak ada catatan</p>
            ) : (
                <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notes.map((note) => (
                        <tr key={note.id}>
                        <td>{note.id}</td>
                        <td>{note.title}</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <Button variant="primary" onClick={() => handleViewNote(note.id)}>
                                View
                                </Button>
                                <Button variant="warning" onClick={() => handleEditNote(note)}>
                                Edit
                                </Button>{' '}
                                <Button variant="danger" onClick={() => handleDeleteNote(note.id)}>
                                Delete
                                </Button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                {selectedNoteId && <NoteDetailView noteId={selectedNoteId} onClose={handleCloseModal} />}
                </div>
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Group controlId="formTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={selectedNote ? selectedNote.title : ''}
                            onChange={(e) =>
                            setSelectedNote((prevNote) => ({
                                ...prevNote!,
                                title: e.target.value,
                            }))
                            }
                        />
                        </Form.Group>

                        <Form.Group controlId="formBody">
                        <Form.Label>Body</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter body"
                            value={selectedNote ? selectedNote.body : ''}
                            onChange={(e) =>
                            setSelectedNote((prevNote) => ({
                                ...prevNote!,
                                body: e.target.value,
                            }))
                            }
                        />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() =>
                        handleEditNoteSubmit(
                            selectedNote!.id,
                            selectedNote!.title,
                            selectedNote!.body
                        )}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default NoteList;
