import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MasterControl from './components/MasterControl';
import GridCanvas from './components/GridCanvas';
import AddStreamModal from './components/AddStreamModal';

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MasterControl onAddStream={() => setModalOpen(true)} />
        <GridCanvas onAddStreamRequest={() => setModalOpen(true)} />
      </div>
      <AddStreamModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
