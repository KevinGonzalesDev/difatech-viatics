import { ViaticRatesModel } from '../models/viaticRates.model.js'

export const listViaticConcepts = async (req, res) => {
    try {
        const concepts = await ViaticRatesModel.listviaticConcepts()
        res.json({ ok: true, data: concepts })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listViaticrates = async (req, res) => {
    try {
        const rates = await ViaticRatesModel.listViaticrates()
        res.json({ ok: true, data: rates })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const createViaticRate = async (req, res) => {
    try {
        const data = req.body
        const rate = await ViaticRatesModel.createViaticRate(data)
        res.json({ ok: true, data: rate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const updateViaticRate = async (req, res) => {
    try {
        const data = req.body
        const rate = await ViaticRatesModel.updateViaticRate(data)
        res.json({ ok: true, data: rate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const desactivateViaticRate = async (req, res) => {
    try {
        const { id } = req.params
        const { active } = req.body
        const rate = await ViaticRatesModel.desactivateViaticRate(id, active)
        res.json({ ok: true, data: rate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteViaticRate = async (req, res) => {
    try {
        await ViaticRatesModel.deleteViaticRate(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

