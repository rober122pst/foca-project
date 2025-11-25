import { AnimatePresence } from 'motion/react';
import { useModalStore } from '../../stores/useModalStore';
import CreateRoutineModal from '../components/CreateRoutineModal';
import EditRoutineModal from '../components/EditRoutineModal';

export default function ModalRoot() {
    const { currentModal, modalData, closeModal } = useModalStore();

    const modals = {
        'create-routine': <CreateRoutineModal onClose={closeModal} />,
        'edit-routine': <EditRoutineModal onClose={closeModal} payload={modalData} />,
    };

    return <AnimatePresence>{currentModal && <div key={currentModal}>{modals[currentModal]}</div>}</AnimatePresence>;
}
