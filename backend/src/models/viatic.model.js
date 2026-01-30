import pool from '../db/db.js'

export const ViaticModel = {

  ListAllViatic: async () => {
    const { rows } = await pool.query(`
        SELECT 
      v.*,
      u.first_name AS name,
      u.last_name AS lastname,
      c.name AS client_name,
      l.name AS location_name,
      p.name AS project_name,
      p.cost_center_code AS project_code
    FROM public.viatics v
    LEFT JOIN public.projects p 
      ON v.proyect_id = p.id
    INNER JOIN public.employees u 
      ON v.user_id = u.id
    INNER JOIN public.clients c 
      ON v.client_id = c.id
    LEFT JOIN public.client_locations l 
      ON p.location_id = l.id
    ORDER BY v.id DESC;
    `)
    return rows
  },

  ListViaticbyID: async (userId) => {
    const { rows } = await pool.query(`
      SELECT viatics.*, first_name AS name, u.last_name AS lastname,
             c.name AS client_name, p.name AS project_name, l.name AS location_name
      FROM public.viatics
      inner JOIN public.employees u ON viatics.user_id = u.id
      inner JOIN public.clients c ON viatics.client_id = c.id
      left join public.projects p ON viatics.proyect_id = p.id
      left JOIN public.client_locations l ON p.location_id = l.id
        WHERE user_id = $1
    `, [userId])
    return rows
  },

  editsoliViatic: async data => {
    const query = `
    UPDATE public.viatics SET
      client_id = $1,
      proyect_id = $2,
      type = $3,
      presentation_date = $4,
      start_mov = $5,
      end_mov = $6,
      soli_reason = $7
    WHERE id = $8
    RETURNING *`

    const values = [
      data.clientId,
      data.projectId,
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

  getViaticcountByUserId: async (userId, date, excludeId) => {
    console.log('model', userId, date);
    const { rows } = await pool.query(`
      SELECT COUNT(*) AS viatic_count
      FROM public.viatics
      WHERE user_id = $1 
      AND   start_mov::date = $2
      AND ($3::int IS NULL OR id <> $3)
    `, [userId, date, excludeId])
    return rows[0].viatic_count
  },


  addViatic: async data => {
    const { rows } = await pool.query(`
      INSERT INTO public.viatics
      (user_id, client_id, proyect_id, type, start_mov, end_mov, soli_reason, status ,presentation_date , code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9 ,$10)
      RETURNING *
    `, [
      data.userId,
      data.clientId,
      data.projectId,
      data.type,
      data.startDate,
      data.endDate,
      data.soliReason,
      'SOLICITED',
      data.presentationDate,
      data.codeViatic,
    ])

    return rows[0]
  },

  deleteViatic: async viaticId => {
    const { rows } = await pool.query(`
      DELETE FROM public.viatics
        WHERE id = $1
      RETURNING *
    `, [viaticId])

    return rows[0]
  },

  aprobeViatic: async data => {
    console.log(data);
    const { rows } = await pool.query(`
      UPDATE public.viatics
        SET status = $1, aproved_date = $2 , aproved_userid = $3
        WHERE id = $4
      RETURNING *
    `, [
      'APROB_ADMIN',
      data.approvalDate,
      data.approvedBy,
      data.viaticId,
    ])

    return rows[0]
  },

  refusedViatic: async data => {
    console.log(data);


    const { rows } = await pool.query(`
      UPDATE public.viatics
        SET status = $1
        WHERE id = $2
      RETURNING *
    `, [
      'REFUSED',
      data.viaticId,
    ])

    return rows[0]
  }
}