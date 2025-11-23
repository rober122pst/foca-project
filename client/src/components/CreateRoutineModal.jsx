import { CalendarPlus, Palette, Plus, X } from 'lucide-react';
import TimePicker, { InputText, Label } from './ui/forms';
import { Modal, ModalContent, ModalHeader, ModalTitle } from './ui/modal';

import { useState } from 'react';
import Button from './ui/Button';

export default function CreateRoutineModal({ isOpen, onClose }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        days: [],
        startTime: '12:00',
        endTime: '13:00',
        color: '#fb2c36',
    });

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

    const weekDays = [
        { id: '0', label: 'Dom' },
        { id: '1', label: 'Seg' },
        { id: '2', label: 'Ter' },
        { id: '3', label: 'Qua' },
        { id: '4', label: 'Qui' },
        { id: '5', label: 'Sex' },
        { id: '6', label: 'Sáb' },
    ];

    return (
        <Modal className="w-full max-w-lg" isOpen={isOpen}>
            <ModalHeader>
                <ModalTitle>
                    <CalendarPlus className="text-items-500" />
                    Criar rotina
                </ModalTitle>
                <Button variant="ghost" onClick={onClose} className="size-8">
                    <X className="size-4" />
                </Button>
            </ModalHeader>
            <ModalContent className="p-4">
                <form className="flex flex-1 flex-col gap-8">
                    <Label required>
                        Título
                        <InputText placeholder="Ex.: Treinar futebol, Estudar programação..." name="title" />
                    </Label>
                    <Label>
                        Descrição (Opicional)
                        <InputText placeholder="Detalhes sobre essa atividade..." name="description" />
                    </Label>
                    <Label>
                        Dias da semana
                        <div className="flex flex-wrap justify-around gap-2">
                            {weekDays.map((day) => {
                                const isSelected = false;
                                return (
                                    <Button
                                        variant="outline"
                                        key={day.id}
                                        type="button"
                                        onClick={() => {}}
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 ${
                                            isSelected ? 'scale-105 bg-indigo-600 text-white shadow-md' : ''
                                        }`}
                                    >
                                        {day.label.slice(0, 1)}
                                    </Button>
                                );
                            })}
                        </div>
                        <p className="text-medium mt-1 ml-1 text-xs">
                            {form.days.length === 0
                                ? 'Selecione pelo menos um dia'
                                : `${form.days.length} dia(s) selecionado(s)`}
                        </p>
                    </Label>
                    <div className="flex gap-2">
                        <Label className="flex-1">
                            Início
                            <TimePicker
                                value={form.startTime}
                                onChange={(newTime) => {
                                    setForm((prev) => ({ ...prev, startTime: newTime }));
                                }}
                            />
                        </Label>
                        <Label className="flex-1">
                            Término
                            <TimePicker
                                value={form.endTime}
                                onChange={(newTime) => {
                                    setForm((prev) => ({ ...prev, endTime: newTime }));
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
                                    onClick={() => setForm({ ...form, color: c })}
                                    className={`h-8 w-8 cursor-pointer rounded-full border-2 transition-transform ${form.color === c ? 'border-medium scale-110' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Selecionar cor ${c}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div
                        className="h-2 w-full rounded-full transition-colors duration-300"
                        style={{ backgroundColor: form.color }}
                    ></div>
                    <div className="flex gap-2">
                        <Button type="submit" className="flex flex-1 gap-2">
                            <Plus className="size-4" />
                            Criar rotina
                        </Button>
                    </div>
                </form>
            </ModalContent>
        </Modal>
    );
}
