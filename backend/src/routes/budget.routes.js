import { Router } from 'express'
import { listApprovedViatics } from '../controllers/budget.cotroller.js'

const router = Router()


router.get('/listApprovedViatics', listApprovedViatics)



export default router
