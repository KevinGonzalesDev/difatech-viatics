import pool from '../db/db.js'

export const DepositModel = {



    addDepositViatic: async data => {
        const { rows } = await pool.query(`
      INSERT INTO public.viatic_deposits
      (viatic_id, date_deposit, amount, entity_financy,nro_voucher,type,observation,created_at, created_by , code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ,$9 ,$10)
      RETURNING *
    `, [
            data.viaticId,
            data.depositDate,
            data.amount,
            data.entityFinancy,
            data.nmrVoucher,
            data.typeDeposit,
            data.observations,
            data.createdAt,
            data.createdBy,
            data.codeDeposit,
        ])

        return rows[0]
    },

    editDepositViatic: async data => {
        const query = `
    UPDATE public.viatic_deposits SET
      date_deposit = $1,
      amount = $2,
      entity_financy = $3,
      nro_voucher = $4,
      type = $5,
      observation = $6
    WHERE id = $7
    RETURNING *`

        const values = [
            data.depositDate,
            data.amount,
            data.entityFinancy,
            data.nmrVoucher,
            data.typeDeposit,
            data.observations,
            data.depositId
        ]

        const { rows } = await pool.query(query, values)
        return rows[0]
    },

    getDepositsByViaticId: async viaticId => {
        const { rows } = await pool.query(`
      SELECT *
      FROM public.viatic_deposits
      WHERE viatic_id = $1
    `, [viaticId])
        return rows
    },

    getDepositcountByViaticId: async (viaticId, date) => {
        const { rows } = await pool.query(`
      SELECT COUNT(*) AS deposit_count
      FROM public.viatic_deposits
      WHERE viatic_id = $1 and date_deposit::date = $2;
    `, [viaticId, date])
        return rows[0].deposit_count
    },

    deleteDepositViatic: async depositId => {

        const { rows } = await pool.query(`
      DELETE FROM public.viatic_deposits
        WHERE id = $1
      RETURNING *
    `, [depositId])
        return rows[0]
    },


}