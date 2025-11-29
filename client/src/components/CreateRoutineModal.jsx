import { AlertCircle, Briefcase, Calendar, CalendarPlus, CheckSquare2, Palette, Plus, Repeat, X } from 'lucide-react';
import { useEffect, useReducer } from 'react';
import { initialRoutinesFormState, routineFormReducer } from '../reducers/routinesReducer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DayPicker, InputText, Label, TimePicker } from './ui/forms';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './ui/modal';

import Select from 'react-select';
import { useCreateRoutine } from '../hooks/routineHooks';
import Button from './ui/Button';

export default function CreateRoutineModal({ onClose }) {
    const { mutate, isPending } = useCreateRoutine();

    const [state, dispatch] = useReducer(routineFormReducer, initialRoutinesFormState);

    const handleSubmit = (e) => {
        e.preventDefault();

        mutate(
            {
                title: state.title,
                type: state.type,
                description: state.description,
                dtstart: new Date(
                    Date.UTC(
                        state.dtstart.getFullYear(),
                        state.dtstart.getMonth(),
                        state.dtstart.getDate(),
                        state.startTime.split(':').map(Number)[0] + state.dtstart.getTimezoneOffset() / 60,
                        state.startTime.split(':').map(Number)[1]
                    )
                ).toISOString(),

                dtend: new Date(
                    Date.UTC(
                        state.dtstart.getFullYear(),
                        state.dtstart.getMonth(),
                        state.dtstart.getDate(),
                        state.endTime.split(':').map(Number)[0] + state.dtstart.getTimezoneOffset() / 60,
                        state.endTime.split(':').map(Number)[1]
                    )
                ).toISOString(),
                deadline: state.deadline
                    ? new Date(
                        Date.UTC(
                              state.deadline.getFullYear(),
                            state.deadline.getMonth(),
                              state.deadline.getDate(),
                            state.deadlineTime.split(':').map(Number)[0] + state.deadline.getTimezoneOffset() / 60,
                              state.deadlineTime.split(':').map(Number)[1]
                          )
                    ).toISOString()
                    : null,
                rrule: buildRRule(state.rruleConfig),
                tag: state.tag,
                color: state.color,
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

    const buildRRule = (config) => {
        if (!config.enabled) return null;

        let rule = `FREQ=${config.freq}`;
        if (config.interval > 1) rule += `;INTERVAL=${config.interval}`;

        if (config.freq === 'WEEKLY' && config.byDay.length > 0) {
            rule += `;BYDAY=${config.byDay.join(',')}`;
        }

        if (config.endType === 'UNTIL' && config.untilDate) {
            // RRule precisa de formato YYYYMMDDTHHMMSSZ geralmente, simplificando:
            const d = new Date(config.untilDate);
            const iso = d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            rule += `;UNTIL=${iso}`;
        } else if (config.endType === 'COUNT' && config.count) {
            rule += `;COUNT=${config.count}`;
        }

        return rule;
    };

    useEffect(() => {
        console.log({
            title: state.title,
            type: state.type,
            description: state.description,
            dtstart: new Date(
                Date.UTC(
                    state.dtstart.getFullYear(),
                    state.dtstart.getMonth(),
                    state.dtstart.getDate(),
                    state.startTime.split(':').map(Number)[0] + state.dtstart.getTimezoneOffset() / 60,
                    state.startTime.split(':').map(Number)[1]
                )
            ).toISOString(),

            dtend: new Date(
                Date.UTC(
                    state.dtstart.getFullYear(),
                    state.dtstart.getMonth(),
                    state.dtstart.getDate(),
                    state.endTime.split(':').map(Number)[0] + state.dtstart.getTimezoneOffset() / 60,
                    state.endTime.split(':').map(Number)[1]
                )
            ).toISOString(),
            deadline: state.deadline
                ? new Date(
                    Date.UTC(
                        state.deadline.getFullYear(),
                        state.deadline.getMonth(),
                        state.deadline.getDate(),
                        state.deadlineTime.split(':').map(Number)[0] + state.deadline.getTimezoneOffset() / 60,
                        state.deadlineTime.split(':').map(Number)[1]
                    )
                  ).toISOString()
                : null,
            rrule: buildRRule(state.rruleConfig),
            tag: state.tag,
            color: state.color,
        });
    }, [state]);

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

    const typeList = [
        { id: 'TASK', icon: CheckSquare2, label: 'Tarefa' },
        { id: 'HABIT', icon: Repeat, label: 'Hábito' },
        { id: 'EVENT', icon: Calendar, label: 'Evento' },
        { id: 'PROJECT', icon: Briefcase, label: 'Projeto' },
    ];

    return (
        <Modal className="w-full rounded-none sm:max-h-fit sm:max-w-lg sm:rounded-4xl" onClose={onClose}>
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
                    <div className="flex gap-2">
                        {typeList.map((type) => (
                            <Button
                                key={type.id}
                                variant={type.id === state.type ? 'default' : 'outline'}
                                onClick={() => dispatch({ type: 'SET_TYPE', value: type.id })}
                            >
                                <type.icon className="size-4" />
                                {type.label}
                            </Button>
                        ))}
                    </div>
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

                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <DayPicker
                                value={state.dtstart}
                                onChange={(newDate) => {
                                    dispatch({ type: 'SET_FIELD', field: 'dtstart', value: newDate });
                                }}
                            />
                        </div>
                        <div className="flex flex-1 items-center gap-2">
                            <TimePicker
                                value={state.startTime}
                                onChange={(newTime) => {
                                    dispatch({ type: 'SET_FIELD', field: 'startTime', value: newTime });
                                }}
                            />
                            <span>até</span>
                            <TimePicker
                                value={state.endTime}
                                onChange={(newTime) => {
                                    dispatch({ type: 'SET_FIELD', field: 'endTime', value: newTime });
                                }}
                            />
                        </div>
                    </div>

                    {state.type === 'TASK' && (
                        <div className="fade-in bg-items-500/20 border-border rounded-lg border p-4">
                            <div className="text-items-500 mb-2 flex items-center gap-2">
                                <AlertCircle className="size-4" />
                                <span className="text-sm font-semibold">Prazo Obrigatório</span>
                            </div>
                            <div className="flex gap-2">
                                <DayPicker
                                    value={state.deadline}
                                    onChange={(newDate) => {
                                        dispatch({ type: 'SET_FIELD', field: 'deadline', value: newDate });
                                    }}
                                />
                                <TimePicker
                                    value={state.deadlineTime}
                                    onChange={(newTime) => {
                                        dispatch({ type: 'SET_FIELD', field: 'deadlineTime', value: newTime });
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {state.rruleConfig.enabled && (
                        <Card className="border-cream-200 dark:border-night-700 bg-cream-100 dark:bg-night-800 w-full rounded-lg py-4">
                            <CardHeader>
                                <CardTitle className="font-medium">
                                    <Repeat className="size-4" /> Recorrência
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4">
                                <div className="mt-3 flex w-full flex-1 items-center gap-2">
                                    <Label className="w-2/3">
                                        Frequência
                                        <Select
                                            onChange={(value) =>
                                                dispatch({ type: 'SET_RRULE', field: 'freq', value: value.value })
                                            }
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    backgroundColor: '#1d1d1d',
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
                                            options={[
                                                { value: 'DAILY', label: 'Diária' },
                                                { value: 'WEEKLY', label: 'Semanal' },
                                                { value: 'MONTHLY', label: 'Mensal' },
                                                { value: 'YEARLY', label: 'Anual' },
                                            ]}
                                        />
                                    </Label>
                                    <div className="flex w-1/3 items-end gap-1.5">
                                        <Label>
                                            A cada
                                            <InputText
                                                className="bg-cream-100 dark:bg-night-900"
                                                type="number"
                                                min="1"
                                                value={state.rruleConfig.interval}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'SET_RRULE',
                                                        field: 'interval',
                                                        value: parseInt(e.target.value),
                                                    })
                                                }
                                            />
                                        </Label>
                                        <span className="text-medium align-middle text-sm">
                                            {state.rruleConfig.freq === 'DAILY'
                                                ? 'dias'
                                                : state.rruleConfig.freq === 'WEEKLY'
                                                    ? 'semanas'
                                                    : state.rruleConfig.freq === 'MONTHLY'
                                                        ? 'meses'
                                                        : 'anos'}
                                        </span>
                                    </div>
                                </div>
                                {state.rruleConfig.freq === 'WEEKLY' && (
                                    <div>
                                        <Label>Repetir em</Label>
                                        <div className="flex justify-between">
                                            {[
                                                { value: 'SU', label: 'Domingo' },
                                                { value: 'MO', label: 'Segunda' },
                                                { value: 'TU', label: 'Terça' },
                                                { value: 'WE', label: 'Quarta' },
                                                { value: 'TH', label: 'Quinta' },
                                                { value: 'FR', label: 'Sexta' },
                                                { value: 'SA', label: 'Sábado' },
                                            ].map((day) => (
                                                <button
                                                    key={day.value}
                                                    type="button"
                                                    title={day.label}
                                                    onClick={() => dispatch({ type: 'TOGGLE_DAY', day: day.value })}
                                                    className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                                        state.rruleConfig.byDay.includes(day.value)
                                                            ? 'bg-accent-500 text-cream-100'
                                                            : 'bg-night-700 text-cream-100 hover:bg-night-700/60'
                                                    }`}
                                                >
                                                    {day.label[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {state.type === 'PROJECT' && (
                                    <Label className="w-fit">
                                        Termina em
                                        <DayPicker
                                            className="w-fit"
                                            value={
                                                state.rruleConfig.untilDate
                                                    ? new Date(state.rruleConfig.untilDate)
                                                    : new Date()
                                            }
                                            onChange={(newTime) => {
                                                dispatch({ type: 'SET_RRULE', field: 'untilDate', value: newTime });
                                            }}
                                        />
                                    </Label>
                                )}
                            </CardContent>
                        </Card>
                    )}

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
