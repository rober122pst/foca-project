import { getTimeDistribution } from "../services/stats.services.js";

export async function getTimeDistributionChard(req, res) {
    try {
        const data = await getTimeDistribution(req.userId)
        
        return res.json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }

}