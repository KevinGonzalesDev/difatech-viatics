import { Router } from 'express'
import {
    listClients,
    addClient,
    addUbication,
    listUbicationsWId,
    addCostCenter,
    listCostCenters,
    addProyect,
    listProyects,
    listProyectsWClientId
} from '../controllers/proyects.controller.js'

const router = Router()


router.get('/clients', listClients)
router.post('/clients', addClient)
router.post('/ubications', addUbication)
router.get('/ubications/:clientId', listUbicationsWId)
router.post('/costcenters', addCostCenter)
router.get('/costcenters', listCostCenters)
router.post('/proyects', addProyect)
router.get('/proyects', listProyects)
router.get('/proyects/client/:clientId', listProyectsWClientId)


export default router
