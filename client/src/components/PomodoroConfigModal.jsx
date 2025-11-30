import { Timer, X } from 'lucide-react';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './ui/modal';

import Button from './ui/Button';

export default function PomodoroConfigModal({ onClose }) {
    return (
        <Modal className="w-full rounded-none sm:max-h-fit sm:max-w-lg sm:rounded-4xl" onClose={onClose}>
            <ModalHeader>
                <ModalTitle>
                    <Timer className="text-items-500" />
                    Iniciar Pomodoro
                </ModalTitle>
                <Button variant="ghost" onClick={onClose} className="size-8">
                    <X className="size-4" />
                </Button>
            </ModalHeader>
            <ModalContent className="box-border max-h-[97%] p-4"></ModalContent>
        </Modal>
    );
}
