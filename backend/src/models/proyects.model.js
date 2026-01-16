import pool from '../db/db.js'

export const ProyectsModel = {

  ListClients: async () => {
    const { rows } = await pool.query(`
      SELECT * FROM public.clients
        ORDER BY id ASC LIMIT 100
    `)
    return rows
  },

  Addclient: async (name) => {
    const { rows } = await pool.query(`
      INSERT INTO public.clients (name)
      VALUES ($1)
      RETURNING *
    `, [name])
    return rows[0]
  },

  Addubication: async (data) => {
    const { rows } = await pool.query(`
      INSERT INTO public.client_locations (client_id, name, address, district_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [data.clientId, data.name, data.address, data.districtId])
    return rows[0]
  },

  ListUbicationsWId: async (clientId) => {
    const { rows } = await pool.query(`
      SELECT * FROM public.client_locations
        WHERE client_id = $1
        ORDER BY name
    `, [clientId])
    return rows
  },

  AddCostCenter: async (data) => {
    const { rows } = await pool.query(`
      INSERT INTO public.cost_centers (code, description)
      VALUES ($1, $2)
      RETURNING *
    `, [data.code, data.description])
    return rows[0]
  },

  ListCostCenters: async () => {
    const { rows } = await pool.query(`
      SELECT * FROM public.cost_centers
        ORDER BY description
    `)
    return rows
  },

  AddProyect: async (data) => {
    const { rows } = await pool.query(`
      INSERT INTO public.projects (client_id, location_id, cost_center_id, name)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [data.clientId, data.locationId, data.costCenterId, data.proyectName])
    return rows[0]
  },

  ListProyects: async () => {
    const { rows } = await pool.query(`
      SELECT projects.id, projects.name AS proyect_name, clients.name AS client_name,
             client_locations.name AS location_name, cost_centers.code AS costcenter_code ,projects.active
        FROM public.projects
        inner join public.clients on projects.client_id = clients.id
        inner join public.client_locations on projects.location_id = client_locations.id
        inner join public.cost_centers on projects.cost_center_id = cost_centers.id
        ORDER BY projects.id ASC LIMIT 100
    `)
    return rows
  },

  ListProyectWClientId: async (clientId) => {
    const { rows } = await pool.query(`
      SELECT * , cost_centers.code AS costcenter_code 
      FROM public.projects
        inner join public.cost_centers on projects.cost_center_id = cost_centers.id
        WHERE client_id = $1
        ORDER BY name
    `, [clientId])
    return rows
  },

}
