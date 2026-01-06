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

export const createRate = async (req, res) => {
    try {
        const rate = await ViaticRatesModel.create(req.body)
        res.json({ ok: true, data: rate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const updateRate = async (req, res) => {
    try {
        const rate = await ViaticRatesModel.update(req.params.id, req.body)
        res.json({ ok: true, data: rate })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteRate = async (req, res) => {
    try {
        await ViaticRatesModel.remove(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

