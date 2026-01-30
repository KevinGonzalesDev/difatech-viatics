import pool from '../db/db.js'

export const BudgetModel = {

    ListAllViaticaproved: async () => {
        const { rows } = await pool.query(`
SELECT viatics.*, 
		     u.first_name AS name,
			 u.last_name AS lastname,
             c.name AS client_name,
			 l.name AS location_name,
			 p.name AS proyect_name,
			 d.name as district_name,
			 d.id as district_id,
             b.amount_total AS budget_total,
             b.aditional,
			 b.days,
             b.id as budget_id,
             COALESCE(dp.deposit_amount, 0) AS deposit_amount
			 
			 
      FROM public.viatics
      left join viatic_budgets b on viatics.id = b.viatic_id
      LEFT JOIN (
        SELECT viatic_id, SUM(amount) AS deposit_amount
        FROM public.viatic_deposits
        GROUP BY viatic_id
    ) dp ON viatics.id = dp.viatic_id
      inner JOIN public.employees u ON viatics.user_id = u.id
      inner JOIN public.clients c ON viatics.client_id = c.id
      inner join public.projects p on viatics.proyect_id = p.id
      left JOIN public.client_locations l ON p.location_id = l.id
	  inner join public.districts d on l.district_id = d.id
        WHERE viatics.status = 'APROB_ADMIN' OR viatics.status = 'APROB_TESO'
        ORDER BY viatics.id DESC 
    `)
        return rows
    },

    listCostbyDistrict: async (districtId) => {
        const { rows } = await pool.query(`
       SELECT  
        v.id,
        c.id as concept_id,
        c.description as concept_name,
        v.frequency_type,
        v.frequency,
        c.code,
        v.amount
		FROM public.viatic_rates v
		inner join public.viatic_concepts c on v.concept_id = c.id
        WHERE district_id = $1
      `, [districtId])
        return rows
    },

    addBudgetViatic: async (data) => {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            // 1️⃣ Insertar presupuesto
            const insertQuery = `
      INSERT INTO public.viatic_budgets
      (viatic_id, district_id, days, aditional, amount_total, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

            const insertValues = [
                data.viaticId,
                data.districtId,
                data.days,
                data.aditional,
                data.totalAmount,
                data.dateCreated,
            ]

            const { rows } = await client.query(insertQuery, insertValues)

            // 2️⃣ Actualizar estado del viático
            const updateQuery = `
      UPDATE public.viatics
      SET status = 'APROB_TESO'
      WHERE id = $1
    `

            await client.query(updateQuery, [data.viaticId])

            await client.query('COMMIT')

            return rows[0]
        } catch (error) {
            await client.query('ROLLBACK')
            throw error
        } finally {
            client.release()
        }
    },

    editBudgetViatic: async (data) => {
        const { rows } = await pool.query(`
      UPDATE public.viatic_budgets
      SET days = $1,
          aditional = $2,
          amount_total = $3,
          updated_at = NOW()
      WHERE viatic_id = $4
      RETURNING *
    `, [
            data.days,
            data.aditional,
            data.totalAmount,
            data.viaticId,
        ])
        return rows[0]
    }
}