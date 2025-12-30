import { Router } from 'express'
import {
    createRate,
    updateRate,
    deleteRate,
} from '../controllers/viaticRates.controller.js'

const router = Router()

router.post('/', createRate)
router.put('/:id', updateRate)
router.delete('/:id', deleteRate)

export default router
