import pool from '../db/db.js'

export const ViaticRatesModel = {
    create: async data => {
        const { rows } = await pool.query(`
      INSERT INTO viatic_rates
      (district_id, breakfast, lunch, dinner, mobility, active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
            data.district_id,
            data.breakfast,
            data.lunch,
            data.dinner,
            data.mobility,
            data.active ?? true,
        ])
        return rows[0]
    },

    update: async (id, data) => {
        const { rows } = await pool.query(`
      UPDATE viatic_rates SET
        breakfast = $1,
        lunch = $2,
        dinner = $3,
        mobility = $4,
        active = $5
      WHERE id = $6
      RETURNING *
    `, [
            data.breakfast,
            data.lunch,
            data.dinner,
            data.mobility,
            data.active,
            id,
        ])
        return rows[0]
    },

    remove: async id => {
        await pool.query(`DELETE FROM viatic_rates WHERE id = $1`, [id])
    },
}
