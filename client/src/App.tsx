// src/components/App.tsx
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import NoteList from './components/NoteList';
import CreateNoteModal from './components/CreateNoteModal';

const App: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div>
      <h1>Notes App</h1>
      <NoteList />
      <Button variant="primary" onClick={handleOpenCreateModal}>
        Create Note
      </Button>

      <CreateNoteModal
        show={showCreateModal}
        onHide={handleCloseCreateModal}
        refetchNotes={() => {}}
      />
    </div>
  );
};

export default App;
