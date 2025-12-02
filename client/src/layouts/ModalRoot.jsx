import { AnimatePresence } from 'motion/react';
import CreateRoutineModal from '../components/CreateRoutineModal';
import CreateRoutineWithAi from '../components/CreateRoutineWithAi';
import EditRoutineModal from '../components/EditRoutineModal';
import PomodoroConfigModal from '../components/PomodoroConfigModal';
import { useModalStore } from '../stores/useModalStore';

export default function ModalRoot() {
    const { currentModal, modalData, closeModal } = useModalStore();

    const modals = {
        'create-routine': <CreateRoutineModal onClose={closeModal} />,
        'edit-routine': <EditRoutineModal onClose={closeModal} payload={modalData} />,
        'create-routine-ai': <CreateRoutineWithAi onClose={closeModal} />,
        'config-pomodoro': <PomodoroConfigModal onClose={closeModal} />,
    };

    return <AnimatePresence>{currentModal && <div key={currentModal}>{modals[currentModal]}</div>}</AnimatePresence>;
}
