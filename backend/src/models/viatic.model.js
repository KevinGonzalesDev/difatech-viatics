import pool from '../db/db.js'

export const ViaticModel = {

  ListAllViatic: async () => {
    const { rows } = await pool.query(`
      SELECT viatics.*, first_name AS name, u.last_name AS lastname,
             c.name AS client_name, l.address AS location_address
      FROM public.viatics
      inner JOIN public.employees u ON viatics.user_id = u.id
      inner JOIN public.clients c ON viatics.client_id = c.id
      inner JOIN public.client_locations l ON viatics.location_id = l.id
    `)
    return rows
  },

  ListViaticbyID: async (userId) => {
    const { rows } = await pool.query(`
      SELECT viatics.*, first_name AS name, u.last_name AS lastname,
             c.name AS client_name, l.address AS location_address
      FROM public.viatics
      inner JOIN public.employees u ON viatics.user_id = u.id
      inner JOIN public.clients c ON viatics.client_id = c.id
      inner JOIN public.client_locations l ON viatics.location_id = l.id
        WHERE user_id = $1
    `, [userId])
    return rows
  },

  editsoliViatic: async data => {
    const query = `
    UPDATE public.viatics SET
      client_id = $1,
      location_id = $2,
      type = $3,
      presentation_date = $4,
      start_mov = $5,
      end_mov = $6,
      soli_reason = $7
    WHERE id = $8
    RETURNING *`

    const values = [
      data.clientId,
      data.locationId,
      data.type,
      data.presentationDate,
      data.startDate,
      data.endDate,
      data.soliReason,
      data.viaticId
    ]

    const { rows } = await pool.query(query, values)
    return rows[0]
  },

  addViatic: async data => {
    const { rows } = await pool.query(`
      INSERT INTO public.viatics
      (user_id, client_id, location_id, type, start_mov, end_mov, soli_reason, status ,presentation_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9)
      RETURNING *
    `, [
      data.userId,
      data.clientId,
      data.locationId,
      data.type,
      data.startDate,
      data.endDate,
      data.soliReason,
      'SOLICITED',
      data.presentationDate,
    ])

    return rows[0]
  },

  aprobeViatic: async data => {
    const { rows } = await pool.query(`
      UPDATE public.viatics
        SET status = $1, aproved_date = $2 , aproved_userid = $3, proyect_id = $4
        WHERE id = $5
      RETURNING *
    `, [
      'APROB_ADMIN',
      data.approvalDate,
      data.approvedBy,
      data.projectId,
      data.viaticId,
    ])

    return rows[0]
  },
}