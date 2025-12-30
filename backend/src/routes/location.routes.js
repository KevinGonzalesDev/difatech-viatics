import { Router } from 'express'
import {
    createProvince,
    createDistrict,
    deleteProvince,
    deleteDistrict,
} from '../controllers/locations.controller.js'

const router = Router()

router.post('/provinces', createProvince)
router.post('/districts', createDistrict)
router.delete('/provinces/:id', deleteProvince)
router.delete('/districts/:id', deleteDistrict)

export default router
