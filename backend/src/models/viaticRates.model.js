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


  createViaticRate: async data => {
    const { rows } = await pool.query(`
      INSERT INTO viatic_rates
      (district_id, concept_id, amount)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [
      data.districtId,
      data.conceptId,
      data.amount,
    ])

    return rows[0]
  },

  updateViaticRate: async (data) => {
    console.log(data)
    const { rows } = await pool.query(`
      UPDATE viatic_rates SET
        district_id = $1,
        concept_id = $2,
        amount = $3
      WHERE id = $4
      RETURNING *
    `, [
      data.districtId,
      data.conceptId,
      data.amount,
      data.id,
    ])
    console.log(data)
    return rows[0]
  },

  desactivateViaticRate: async (id, active) => {
    const { rows } = await pool.query(`
      UPDATE viatic_rates SET
        active = $1
      WHERE id = $2
      RETURNING *
    `, [active, id])
    return rows[0]

  },



  deleteViaticRate: async id => {
    await pool.query(`DELETE FROM viatic_rates WHERE id = $1`, [id])
  },
}
