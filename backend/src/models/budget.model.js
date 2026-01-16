import pool from '../db/db.js'

export const BudgetModel = {

    ListAllViaticaproved: async () => {
        const { rows } = await pool.query(`
      SELECT viatics.*, first_name AS name, u.last_name AS lastname,
             c.name AS client_name, l.address AS location_address , p.name AS proyect_name
      FROM public.viatics
      inner JOIN public.employees u ON viatics.user_id = u.id
      inner JOIN public.clients c ON viatics.client_id = c.id
      inner JOIN public.client_locations l ON viatics.location_id = l.id
      inner join public.projects p on viatics.proyect_id = p.id
        WHERE viatics.status = 'APROB_ADMIN'

    `)
        return rows
    },
}