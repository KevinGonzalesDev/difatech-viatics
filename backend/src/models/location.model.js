import pool from '../db/db.js'

export const LocationsModel = {
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
