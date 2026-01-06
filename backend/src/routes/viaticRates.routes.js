import { Router } from 'express'
import {
    createRate,
    updateRate,
    deleteRate,
    listViaticConcepts,
    listViaticrates,
} from '../controllers/viaticRates.controller.js'

const router = Router()

router.post('/', createRate)
router.put('/:id', updateRate)
router.delete('/:id', deleteRate)
router.get('/concepts', listViaticConcepts)
router.get('/', listViaticrates)

export default router
