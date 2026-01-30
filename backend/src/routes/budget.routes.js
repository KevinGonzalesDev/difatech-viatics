import { Router } from 'express'
import { listApprovedViatics, listCostByDistrict, addBudgetViatic, editBudgetViatic } from '../controllers/budget.cotroller.js'

const router = Router()


router.get('/', listApprovedViatics)
router.post('/', addBudgetViatic)
router.put('/', editBudgetViatic)
router.get('/listCostByDistrict/:districtId', listCostByDistrict)





export default router
