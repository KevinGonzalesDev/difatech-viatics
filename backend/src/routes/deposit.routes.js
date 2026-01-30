import { Router } from 'express'
import { addDepositViatic, editDepositViatic, getDepositsByViaticId, getDepositcountByViaticId, deleteDepositViatic } from '../controllers/deposit.controller.js'

const router = Router()


router.post('/', addDepositViatic)
router.put('/', editDepositViatic)
router.get('/find/:viaticId', getDepositsByViaticId)
router.get('/count/', getDepositcountByViaticId)
router.delete('/:depositId', deleteDepositViatic)


export default router
