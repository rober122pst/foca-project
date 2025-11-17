import { defaults } from 'chart.js/auto';
import { ChevronDown, ChevronUp, ClockFading } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

export default function ChardsOverview() {
    const focusTimeData = {
        totalMinutesCurrent: 309,
        totalMinutesPrevious: 280,
        diffPercentage: 10,
        data: [
            { day: 'Sex', minutes: 60, previous: 50 },
            { day: 'Sáb', minutes: 45, previous: 40 },
            { day: 'Dom', minutes: 30, previous: 20 },
            { day: 'Seg', minutes: 50, previous: 60 },
            { day: 'Ter', minutes: 40, previous: 30 },
            { day: 'Qua', minutes: 25, previous: 40 },
            { day: 'Qui', minutes: 59, previous: 40 },
        ],
    };

    const chartFocusMinuteData = {
        labels: focusTimeData.data.map((d) => d.day),
        datasets: [
            {
                label: 'Essa semana',
                data: focusTimeData.data.map((d) => d.minutes),
                borderColor: '#ff0546',
                backgroundColor: '#ff0546',
                borderRadius: 5,
            },
            {
                label: 'Semana passada',
                data: focusTimeData.data.map((d) => d.previous),
                borderColor: '#0098db',
                backgroundColor: '#0098db',
                borderRadius: 5,
            },
        ],
    };

    const optionsFocusMinutes = {
        // Limpando o gráfico: sem grid, sem ticks, só barras + legenda + tooltip
        scales: {
            x: {
                grid: { display: false }, // tira o grid do eixo X
                ticks: { color: '#b6afaf' }, // tira os ticks
                border: { display: false },
            },
            y: {
                grid: { display: false }, // tira o grid do eixo Y
                ticks: { display: false }, // oculta os números do eixo Y
                border: { display: false },
            },
        },

        plugins: {
            legend: {
                display: true, // deixa só a legenda
                labels: {
                    color: '#b6afaf',
                    labels: {
                        padding: 10,
                        boxWidth: 12,
                    },
                },
                position: 'bottom',
            },

            tooltip: {
                enabled: true, // habilita os tooltips
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#b6afaf',
                bodyColor: '#b6afaf',
            },
        },
    };

    const distributionData = [
        { label: 'Estudos', value: 40, color: '#ff0546' },
        { label: 'Trabalho', value: 30, color: '#9c173b' },
        { label: 'Lazer', value: 20, color: '#450327' },
        { label: 'Exercícios', value: 9, color: '#17001d' },
        { label: 'Outros', value: 1, color: '#0098db' },
    ];

    const chartDistributionData = {
        labels: distributionData.map((d) => d.label),
        datasets: [
            {
                data: distributionData.map((d) => d.value),
                backgroundColor: distributionData.map((d) => d.color),
            },
        ],
    };

    const optionsDistribution = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#b6afaf',
                },
                position: 'bottom',
            },
        },
    };

    return (
        <div className="grid gap-5 lg:grid-cols-2">
            <Card className="min-w-0">
                <CardContent className="w-full p-4">
                    <div className="text-md font-extrabold text-[#b6afaf]">
                        <p>Minutos focados</p>
                        <strong className="text-items-500 text-5xl">{focusTimeData.totalMinutesCurrent}</strong>
                        <small className="text-xs">
                            {focusTimeData.diffPercentage > 0 ? (
                                <div>
                                    <ChevronUp className="text-accent-500 mr-1.5 inline" />
                                    {focusTimeData.diffPercentage}% a mais que semana passada
                                </div>
                            ) : (
                                <div>
                                    <ChevronDown className="text-items-500 mr-1.5 inline" />
                                    {focusTimeData.diffPercentage}% a menos que semana passada
                                </div>
                            )}
                        </small>
                    </div>
                    <div className="mt-2 h-[200px] w-full min-w-0">
                        <Bar data={chartFocusMinuteData} options={optionsFocusMinutes} />
                    </div>
                </CardContent>
            </Card>
            <Card className="min-w-0">
                <CardHeader>
                    <CardTitle>
                        <ClockFading className="text-items-500 mr-1.5 inline" />
                        Distribuição de tempo
                    </CardTitle>
                </CardHeader>
                <CardContent className="w-full p-4">
                    <div className="h-[200px] w-full min-w-0">
                        <Pie data={chartDistributionData} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
