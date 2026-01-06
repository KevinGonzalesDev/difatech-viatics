import { Router } from 'express'
import {
    createProvince,
    createDistrict,
    deleteProvince,
    deleteDistrict,
    listDepartments,
    listProvinces,
    listProvincesWId,
    listDistrictsWId,
} from '../controllers/locations.controller.js'

const router = Router()


router.get('/departments', listDepartments)
router.get('/provinces', listProvinces)
router.get('/provinces/department/:departmentId', listProvincesWId)
router.get('/provinces/districts/:provinceId', listDistrictsWId)
router.post('/provinces', createProvince)
router.post('/districts', createDistrict)
router.delete('/provinces/:id', deleteProvince)
router.delete('/districts/:id', deleteDistrict)

export default router
