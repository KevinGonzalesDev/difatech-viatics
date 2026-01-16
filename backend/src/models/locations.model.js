import pool from '../db/db.js'

export const LocationsModel = {

    ListDepartments: async () => {
        const { rows } = await pool.query(`
      SELECT * FROM departments ORDER BY name
    `)
        return rows
    },


    ListProvinces: async () => {
        const { rows } = await pool.query(`
      SELECT p.id, p.name, d.name AS department_name , d.id AS department_id, p.active
        FROM provinces p
        JOIN departments d ON p.department_id = d.id
        ORDER BY d.name, p.name
    `)
        return rows
    },


    ListProvincesWId: async departmentId => {
        const { rows } = await pool.query(`
      SELECT * FROM provinces
      WHERE department_id = $1
        ORDER BY name
    `, [departmentId])
        return rows
    },

    ListDistricWId: async provinceId => {
        const { rows } = await pool.query(`
      SELECT * FROM districts
      WHERE province_id = $1
        ORDER BY name
    `, [provinceId])
        return rows
    },

    ListAllDistricts: async () => {
        const { rows } = await pool.query(`
      SELECT d.id, d.name, p.name AS province_name, dep.name AS department_name
        FROM districts d
        JOIN provinces p ON d.province_id = p.id
        JOIN departments dep ON p.department_id = dep.id
        ORDER BY dep.name, p.name, d.name
    `)
        return rows
    },

    DesactivateDepartment: async (id, active) => {
        const { rows } = await pool.query(`
      UPDATE departments
        SET active = $1
        WHERE id = $2
        RETURNING *
    `, [active, id])
        return rows[0]
    },

    DesactivateProvince: async (id, active) => {
        const { rows } = await pool.query(`
      UPDATE provinces
        SET active = $1
        WHERE id = $2
        RETURNING *
    `, [active, id])
        return rows[0]
    },


    createProvince: async data => {
        const { rows } = await pool.query(`
      INSERT INTO provinces (department_id, name)
      VALUES ($1, $2)
      RETURNING *
    `, [data.department_id, data.name])
        return rows[0]
    },

    createDistrict: async data => {
        const { rows } = await pool.query(`
      INSERT INTO districts (province_id, name)
      VALUES ($1, $2)
      RETURNING *
    `, [data.province_id, data.name])
        return rows[0]
    },

    deleteProvince: async id => {
        await pool.query(`DELETE FROM provinces WHERE id = $1`, [id])
    },

    deleteDistrict: async id => {
        await pool.query(`DELETE FROM districts WHERE id = $1`, [id])
    },
}
