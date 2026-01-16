import { ProyectsModel } from '../models/proyects.model.js'

export const listClients = async (req, res) => {
    try {
        const clients = await ProyectsModel.ListClients()
        res.json({ ok: true, data: clients })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
export const addClient = async (req, res) => {
    try {
        const { name } = req.body
        const newClient = await ProyectsModel.Addclient(name)
        res.json({ ok: true, data: newClient })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addUbication = async (req, res) => {
    try {
        const data = req.body
        const newUbication = await ProyectsModel.Addubication(data)
        res.json({ ok: true, data: newUbication })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listUbicationsWId = async (req, res) => {
    try {
        const { clientId } = req.params
        const ubications = await ProyectsModel.ListUbicationsWId(clientId)
        res.json({ ok: true, data: ubications })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addCostCenter = async (req, res) => {
    try {
        const data = req.body
        const newCostCenter = await ProyectsModel.AddCostCenter(data)
        res.json({ ok: true, data: newCostCenter })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listCostCenters = async (req, res) => {
    try {
        const costCenters = await ProyectsModel.ListCostCenters()
        res.json({ ok: true, data: costCenters })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const addProyect = async (req, res) => {
    try {
        const data = req.body
        const newProyect = await ProyectsModel.AddProyect(data)
        res.json({ ok: true, data: newProyect })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listProyects = async (req, res) => {
    try {
        const proyects = await ProyectsModel.ListProyects()
        res.json({ ok: true, data: proyects })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}

export const listProyectsWClientId = async (req, res) => {
    try {
        const { clientId } = req.params
        const proyects = await ProyectsModel.ListProyectWClientId(clientId)
        res.json({ ok: true, data: proyects })
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message })
    }
}
