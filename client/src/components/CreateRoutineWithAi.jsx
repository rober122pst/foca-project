import { Plus, Stars, X } from 'lucide-react';
import { Label, TextArea } from './ui/forms';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './ui/modal';

import { useState } from 'react';
import { useCreateRoutineWithAi } from '../hooks/routineHooks';
import Button from './ui/Button';

export default function CreateRoutineWithAi({ onClose }) {
    const [prompt, setPrompt] = useState('');

    const { mutate, isPending, isError, error, isSuccess } = useCreateRoutineWithAi();

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate({ prompt });
    };

    if (error) console.error(error);

    return (
        <Modal className="w-full rounded-none sm:max-h-fit sm:max-w-lg sm:rounded-4xl" onClose={onClose}>
            <ModalHeader>
                <ModalTitle>
                    <Stars className="text-items-500" />
                    Criar com IA
                </ModalTitle>
                <Button variant="ghost" onClick={onClose} className="size-8">
                    <X className="size-4" />
                </Button>
            </ModalHeader>
            <ModalContent className="box-border max-h-[97%] p-4">
                <form
                    onSubmit={handleSubmit}
                    className="scrollbar-custom space-y-8 overflow-x-hidden overflow-y-auto px-3"
                >
                    <h1>
                        Use o Foca IA para parar de enrolar e montar rotinas como um chefe. Você fala, ele organiza.
                        Simples assim.
                    </h1>
                    <Label>
                        Descreva sua rotina
                        <TextArea
                            className="resize-none"
                            rows={7}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Conte o que você precisa: estudar, treinar, organizar a casa, focar no TDAH, montar uma rotina matinal… qualquer coisa. A IA transforma sua ideia em rotinas prontas, com horários e categorias certinhas. É só descrever o que você quer."
                            name="title"
                            autoComplete="off"
                        />
                    </Label>
                    {isError && (
                        <div className="flex-1 rounded-lg bg-red-600/10 p-2 text-center">
                            <p className="text-red-500">Ocorreu um erro. Tente novamente.</p>
                        </div>
                    )}
                    {isSuccess && (
                        <div className="flex-1 rounded-lg bg-green-600/10 p-2 text-center">
                            <p className="text-green-500">Rotina criada com sucesso.</p>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button type="submit" className="flex flex-1 gap-2" disabled={isPending}>
                            <Plus className="size-4" />
                            Criar rotina
                        </Button>
                        <Button
                            className="flex flex-1 gap-2"
                            disabled={isPending}
                            onClick={() => onClose()}
                            variant="outline"
                        >
                            <X className="size-4" />
                            Cancelar
                        </Button>
                    </div>
                </form>
            </ModalContent>
        </Modal>
    );
}
