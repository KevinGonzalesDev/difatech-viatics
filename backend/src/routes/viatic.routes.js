import { Router } from 'express'
import {
    addViatic,
    ListViaticbyID,
    ListAllViatic,
    aprobeViatic,
    editsoliViatic,

} from '../controllers/viatic.controller.js'

const router = Router()

router.get('/listallviatics', ListAllViatic)
router.get('/listviaticbyid/:userId', ListViaticbyID)
router.post('/addviatics', addViatic)
router.put('/aprobeviatic', aprobeViatic)
router.put('/editsoliviatic', editsoliViatic)


export default router
