import { AnimatePresence } from 'motion/react';
import CreateRoutineModal from '../components/CreateRoutineModal';
import { useModalStore } from '../../stores/useModalStore';

export default function ModalRoot() {
    const { currentModal, modelData, closeModal } = useModalStore();

    const modals = {
        'create-routine': <CreateRoutineModal onClose={closeModal} />,
    };

    return <AnimatePresence>{currentModal && <div key={currentModal}>{modals[currentModal]}</div>}</AnimatePresence>;
}
