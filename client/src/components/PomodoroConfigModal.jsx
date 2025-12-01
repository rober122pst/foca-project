import { ChevronDown, ChevronUp, LoaderIcon, Timer, X } from 'lucide-react';
import { useEffect, useReducer, useState } from 'react';
import { initialPomodoroState, pomodoroReducer } from '../reducers/pomodoroConfigReducer';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './ui/modal';

import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useCreatePomodoroSession } from '../hooks/pomodoroHooks';
import { useEvents } from '../hooks/routineHooks';
import Button from './ui/Button';

export default function PomodoroConfigModal({ onClose }) {
    const navigate = useNavigate();

    const [send, setSend] = useState(false);

    const { data: pData, isPending: ispData, mutate } = useCreatePomodoroSession();

    const [state, dispatch] = useReducer(pomodoroReducer, initialPomodoroState);
    const { data, isPending } = useEvents({ type: 'TASK,HABIT,PROJECT', today: true });

    useEffect(() => {
        console.log(pData);

        if (pData && send) {
            navigate(`/pomodoro?session=${pData.eventId}`);
        }
    }, [pData, send, navigate]);

    const handleClick = () => {
        mutate({ eventId: state.eventId, cicle: state.breakCount, plannedDuration: state.focusTime });
        setSend(true);
    };

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
            <ModalContent className="box-border max-h-[97%] p-4">
                <form className="scrollbar-custom space-y-8 overflow-x-hidden overflow-y-auto px-3">
                    <div className="display-center flex flex-1 flex-col">
                        <div className="border-cream-200 dark:border-night-700 bg-cream-100 dark:bg-night-800 flex w-fit items-center rounded-lg border-2 text-base">
                            <div className="h-full w-full px-8 text-center align-middle">
                                <h1 className="text-4xl">{state.focusTime}</h1>
                                <p className="text-sm">min</p>
                            </div>
                            <div className="border-muted border-l">
                                <Button
                                    className="py-6"
                                    variant="ghost"
                                    onClick={() => dispatch({ type: 'INCREMENT' })}
                                    disabled={state.focusTime === 245}
                                >
                                    <ChevronUp />
                                </Button>
                                <Button
                                    className="py-6"
                                    variant="ghost"
                                    onClick={() => dispatch({ type: 'DECREMENT' })}
                                    disabled={state.focusTime === 10}
                                >
                                    <ChevronDown />
                                </Button>
                            </div>
                        </div>
                        <p className="mt-2 text-sm">
                            {state.breakCount === 0
                                ? 'Você não terá pausas'
                                : state.breakCount === 1
                                    ? 'Você terá só 1 pausa'
                                    : `Você terá ${state.breakCount} pausas`}
                        </p>
                    </div>
                    <div>
                        {!isPending ? (
                            <Select
                                onChange={(value) => dispatch({ type: 'SET_EVENT', payload: value.value })}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: '#1d1d1d',
                                        color: '#fff',
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: '#1d1d1d',
                                        color: '#fff',
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused ? '#9c173b' : '#1d1d1d',
                                        color: '#fff',
                                    }),
                                }}
                                options={data.map((e) => ({ value: e.id, label: `${e.type} | ${e.title}` }))}
                            />
                        ) : (
                            <LoaderIcon className="text-primary" />
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => handleClick()}
                            className="flex flex-1 gap-2"
                            disabled={isPending || !state.eventId}
                        >
                            <Timer className="size-4" />
                            Iniciar Foco
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
