import pool from '../db/db.js'

export const ViaticRatesModel = {

  listviaticConcepts: async () => {
    const { rows } = await pool.query(`
      SELECT * FROM viatic_concepts ORDER BY description
    `)
    return rows
  },

  listViaticrates: async () => {
    const { rows } = await pool.query(`
      SELECT vr.*, d.name AS district_name, vc.description AS concept_description
      FROM viatic_rates vr
      JOIN districts d ON vr.district_id = d.id
      JOIN viatic_concepts vc ON vr.concept_id = vc.id
      ORDER BY d.name, vc.description
    `)
    return rows
  },

  create: async data => {
    const { rows } = await pool.query(`
      INSERT INTO viatic_rates
      (district_id, concept_id, amount, active)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      data.districtID,
      data.conceptId,
      data.amount,

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
