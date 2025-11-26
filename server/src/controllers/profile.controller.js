import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProfile(req, res) {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "acesso negado" });
    }

    try {
        const user = await prisma.user.findUnique({ where: {userId} });
        const userProfile = await prisma.profile.findUnique({ where: {userId} });
        const userGamefication = userProfile.gamefication ?? { level: 1, xp: 0 };

        return res.json({
            name: user.name,
            profilePic: userProfile.picUrl,
            banner: userProfile.bannerUrl,
            bio: userProfile.bio,
            follows: {
                followers: userProfile.followers,
                following: userProfile.following
            },
            levelProgress:{
                level: userGamefication.level,
                currentXp: userGamefication.xp,
                nextLevelXp: userGamefication ? (userGamefication.level + 1) * 100 : 100
            },
            achievements: userProfile.userAchiviements,
        })
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar dados do profile" });
    }
}