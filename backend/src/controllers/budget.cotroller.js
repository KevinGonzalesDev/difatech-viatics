import { BudgetModel } from '../models/budget.model.js'

export const listApprovedViatics = async (req, res) => {
    try {
        const viatics = await BudgetModel.ListAllViaticaproved()
        res.json({ ok: true, data: viatics })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
