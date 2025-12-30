import { LocationsModel } from '../models/locations.model.js'

export const createProvince = async (req, res) => {
    try {
        const province = await LocationsModel.createProvince(req.body)
        res.json({ ok: true, data: province })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const createDistrict = async (req, res) => {
    try {
        const district = await LocationsModel.createDistrict(req.body)
        res.json({ ok: true, data: district })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteProvince = async (req, res) => {
    try {
        await LocationsModel.deleteProvince(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const deleteDistrict = async (req, res) => {
    try {
        await LocationsModel.deleteDistrict(req.params.id)
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
