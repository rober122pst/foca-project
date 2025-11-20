export async function getUserAchievements(prisma, profileId, take = 4) {
    // Busca todas as conquistas + progresso do usuário (se existir)
    const achievements = await prisma.achiviement.findMany({
        include: {
            userAchiviements: {
                where: { profileId },
                take: 1,
            },
        },
    });

  // Agora transformamos para um array com dados unificados
    const mapped = achievements.map(a => {
        const ua = a.userAchiviements[0];

        return {
            id: a.id,
            name: a.name,
            description: a.description,
            icon: a.iconUrl,
            total: a.total ?? null,
            rarity: a.rarity,
            xpReward: a.xpReward,
            coinReward: a.coinReward,
            progress: ua?.progress ?? 0,
            unlocked: ua?.achievedAt ? true : false,
            achievedAt: ua?.achievedAt ?? null,
        };
    });

    // Ordenação:
    // 1. Desbloqueadas primeiro (achievedAt != null)
    // 2. Dentro delas → mais recentes primeiro
    // 3. Depois bloqueadas → maior progresso/total primeiro
    const ordered = mapped.sort((a, b) => {
        // a desbloqueada e b não
        if (a.achievedAt && !b.achievedAt) return -1;
        if (!a.achievedAt && b.achievedAt) return 1;

        // Se ambas desbloqueadas → ordena por achievedAt DESC
        if (a.achievedAt && b.achievedAt) {
            return new Date(b.achievedAt) - new Date(a.achievedAt);
        }

        // Se ambas bloqueadas → ordena por % de progresso
        const progressA = a.total === null ? 0 : a.progress / a.total;
        const progressB = b.total === null ? 0 : b.progress / b.total;

        return progressB - progressA;
    });

    // Retorna só 4 itens
    return ordered.slice(0, take);
}
