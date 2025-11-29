import { CalendarPlus, Palette, Pen, X } from 'lucide-react';
import { InputText, Label, TimePicker } from './ui/forms';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './ui/modal';

import { useReducer } from 'react';
import { usePatchRoutine } from '../hooks/routineHooks';
import { routineFormReducer } from '../reducers/routinesReducer';
import { toUTCISOTimeOnly } from '../utils/formatTime';
import Button from './ui/Button';

export default function EditRoutineModal({ onClose, payload }) {
    const { mutate, isPending } = usePatchRoutine();

    const [state, dispatch] = useReducer(routineFormReducer, payload);

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate(
            {
                id: payload.id,
                payload: {
                    ...state,
                    startTime: toUTCISOTimeOnly(state.startTime),
                    endTime: toUTCISOTimeOnly(state.endTime),
                },
            },
            {
                onSuccess: () => {
                    console.log('mandou');
                    dispatch({ type: 'RESET' });
                    onClose();
                },
            }
        );
    };

    const colorPalette = [
        '#fb2c36', // Vermelho
        '#ff6900', // Laranja
        '#00c951', // Verde
        '#2b7fff', // Azul
        '#615fff', // Índigo
        '#ad46ff', // Roxo
        '#f6339a', // Rosa
        '#6a7282', // Cinza
    ];

    // TODO: isso aqui vai ser personalizado depois. o usuario vai poder criar tags
    const tagsList = ['Trabalho', 'Estudo', 'Saúde', 'Lazer', 'Casa', 'Pessoal', 'Espiritual', 'Financeiro'];

    const weekDays = [
        { id: 'SUN', label: 'Dom' },
        { id: 'MON', label: 'Seg' },
        { id: 'TUE', label: 'Ter' },
        { id: 'WED', label: 'Qua' },
        { id: 'THU', label: 'Qui' },
        { id: 'FRI', label: 'Sex' },
        { id: 'SAT', label: 'Sáb' },
    ];

    return (
        <Modal className="w-full rounded-none sm:max-h-[841px] sm:max-w-lg sm:rounded-4xl" onClose={onClose}>
            <ModalHeader>
                <ModalTitle>
                    <CalendarPlus className="text-items-500" />
                    Criar evento
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
                            placeholder="Ex.: Treinar futebol, Estudar programação..."
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
                        Dias da semana
                        <div className="flex flex-wrap justify-around gap-2">
                            {weekDays.map((day) => {
                                const isSelected = state.days.includes(day.id);
                                return (
                                    <Button
                                        variant="outline"
                                        key={day.id}
                                        type="button"
                                        onClick={() => dispatch({ type: 'TOGGLE_DAY', value: day.id })}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                                            isSelected
                                                ? 'bg-accent-500 dark:bg-accent-500 hover:bg-accent-600 dark:hover:bg-accent-600 scale-105 text-white shadow-md'
                                                : ''
                                        }`}
                                    >
                                        {day.label.slice(0, 1)}
                                    </Button>
                                );
                            })}
                        </div>
                        <p className="text-medium mt-1 ml-1 text-xs">
                            {state.days.length === 0
                                ? 'Selecione pelo menos um dia'
                                : `${state.days.length} dia(s) selecionado(s)`}
                        </p>
                    </Label>
                    <Label>
                        Etiqueta
                        <div className="flex flex-wrap justify-around gap-2">
                            {tagsList.map((tag) => {
                                const isSelected = state.tag === tag;

                                return (
                                    <Button
                                        key={tag}
                                        variant="outline"
                                        onClick={() => dispatch({ type: 'SET_FIELD', field: 'tag', value: tag })}
                                        className={`${isSelected && 'border-items-500 dark:border-items-500'}`}
                                    >
                                        {tag}
                                    </Button>
                                );
                            })}
                        </div>
                    </Label>
                    <div className="flex gap-2">
                        <Label className="flex-1">
                            Início
                            <TimePicker
                                value={state.startTime}
                                onChange={(newTime) => {
                                    dispatch({ type: 'SET_FIELD', field: 'startTime', value: newTime });
                                }}
                            />
                        </Label>
                        <Label className="flex-1">
                            Término
                            <TimePicker
                                value={state.endTime}
                                onChange={(newTime) => {
                                    dispatch({ type: 'SET_FIELD', field: 'endTime', value: newTime });
                                }}
                            />
                        </Label>
                    </div>
                    <div>
                        <Label>
                            <div className="flex items-center gap-2">
                                <Palette className="size-4" />
                                Cor da etiqueta
                            </div>
                        </Label>
                        <div className="mt-1.5 flex flex-1 flex-wrap justify-around">
                            {colorPalette.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'color', value: c })}
                                    className={`h-8 w-8 cursor-pointer rounded-full border-2 transition-transform ${state.color === c ? 'border-medium scale-110' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Selecionar cor ${c}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div
                        className="h-2 w-full rounded-full transition-colors duration-300"
                        style={{ backgroundColor: state.color }}
                    ></div>
                    <div className="flex gap-2">
                        <Button type="submit" className="flex flex-1 gap-2" disabled={isPending}>
                            <Pen className="size-4" />
                            Editar rotina
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
