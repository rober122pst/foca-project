import { CalendarPlus, Plus, X } from 'lucide-react';
import { initialTasksFormState, taskFormReducer } from '../reducers/tasksReducer';
import { InputText, Label } from './ui/forms';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './ui/modal';

import { useReducer } from 'react';
import { useCreateTask } from '../hooks/taskHooks';
import Button from './ui/Button';

export default function CreateTaskModal({ onClose }) {
    const { mutate, isPending } = useCreateTask();

    const [state, dispatch] = useReducer(taskFormReducer, initialTasksFormState);

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate(
            { ...state, deadline: new Date(state.deadline).toISOString() },
            {
                onSuccess: () => {
                    console.log('mandou');
                    dispatch({ type: 'RESET' });
                    onClose();
                },
            }
        );
    };

    const priorities = [
        { id: 'LOW', label: 'Baixa' },
        { id: 'MEDIUM', label: 'Média' },
        { id: 'HIGH', label: 'Alta' },
    ];

    return (
        <Modal className="w-full rounded-none sm:max-h-fit sm:max-w-lg sm:rounded-4xl" onClose={onClose}>
            <ModalHeader>
                <ModalTitle>
                    <CalendarPlus className="text-items-500" />
                    Criar tarefa
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
                    <Label>
                        Título
                        <InputText
                            value={state.title}
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'title', value: e.target.value })}
                            placeholder="Ex.: Atividade de ciências, tarefa de português..."
                            name="title"
                            autoComplete="off"
                        />
                    </Label>
                    <Label>
                        Descrição (Opicional)
                        <InputText
                            value={state.description}
                            onChange={(e) =>
                                dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })
                            }
                            placeholder="Detalhes sobre essa atividade..."
                            name="description"
                            autoComplete="off"
                        />
                    </Label>
                    <Label>
                        Prazo
                        <InputText
                            value={state.deadline}
                            type="datetime-local"
                            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'deadline', value: e.target.value })}
                            name="deadline"
                            autoComplete="off"
                        />
                    </Label>
                    <div>
                        <Label>Prioridade</Label>
                        <div className="mt-0.5 flex justify-between">
                            {priorities.map((priority) => {
                                const isSelected = state.priority.includes(priority.id);
                                return (
                                    <Button
                                        key={priority.id}
                                        variant="outline"
                                        onClick={() =>
                                            dispatch({ type: 'SET_FIELD', field: 'priority', value: priority.id })
                                        }
                                        className={`${isSelected && 'border-items-500 dark:border-items-500'}`}
                                    >
                                        {priority.label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" className="flex flex-1 gap-2" disabled={isPending}>
                            <Plus className="size-4" />
                            Criar tarefa
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
