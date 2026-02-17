export const headersRoles = [
    { title: 'Nombre', key: 'name' },
    { title: 'Puesto', key: 'position' },
    { title: 'Correo', key: 'email' },
    { title: 'Rol', key: 'roles' },
    { title: 'Estado', key: 'active' },
    { title: 'Acciones', key: 'actions', sortable: false },
]

export const headerviaticsUser = [
    // { title: 'ID', key: 'id' },
    { title: 'Codigo', key: 'code' },
    { title: 'Empleado', key: 'employee_name' },
    { title: 'Tipo de Viático', key: 'type' },
    { title: 'Proyecto', key: 'project_name' },
    { title: 'Cliente', key: 'client_name' },
    { title: 'Ubicación', key: 'location_name' },
    { title: 'Fecha Inicio', key: 'startdate' },
    { title: 'Fecha Fin', key: 'enddate' },
    { title: 'Motivo', key: 'soli_reason' },
    { title: 'Estado', key: 'status' },
    { title: 'Acciones', key: 'actions' },
]

export const headersoliAdmviatics = [
    { title: 'Empleado', key: 'employee_name' },
    { title: 'Tipo de Viático', align: 'center', key: 'type' },
    { title: 'Cliente', align: 'center', key: 'client_name' },
    { title: 'Proyecto', align: 'left', key: 'project_name' },
    { title: 'Ubicación', align: 'center', key: 'location_name' },
    { title: 'Fecha Inicio', align: 'center', key: 'startdate' },
    { title: 'Fecha Fin', align: 'center', key: 'enddate' },
    { title: 'Estado', align: 'center', key: 'status' },
    { title: 'Acciones', align: 'center', key: 'actions' },
]

export const headersBudgetlist = [
    { title: 'Distrito', key: 'district_name' },
    { title: 'Concepto', key: 'concept_description' },
    { title: 'Monto', key: 'amount' },
    { title: 'Estado', key: 'active' },
    { title: 'Acciones', key: 'actions', sortable: false },
]

export const headersdepartmentlist = [
    { title: 'Departamento', key: 'name' },
    { title: 'Estado', key: 'active' },
    { title: 'Acciones', key: 'actions' },
]

export const groupProvince = [{ key: 'department_name', order: 'asc' }]

export const headersprovincelist = [
    { title: 'Departamento', key: 'department_name' },
    { title: 'Provincia', key: 'name' },
    { title: 'Estado', key: 'active' },
    { title: 'Acciones', key: 'actions' },
]


export const groupDistrict = [{ key: 'province_name', order: 'asc' }]

export const headersdistricts = [

    { title: 'Provincia', key: 'province_name' },
    { title: 'Distrito', key: 'name' },
    { title: 'Estado', key: 'active' },
    { title: 'Acciones', key: 'actions' },
]

export const headersProyects = [
    { title: 'Nombre del proyecto', key: 'project_name' },
    { title: 'Cliente', key: 'client_name' },
    { title: 'Ubicación', key: 'location_name' },
    { title: 'Centro de costo', key: 'cost_center_code', sortable: false },
    { title: 'Estado', key: 'active' },
    { title: 'Acciones', key: 'actions', sortable: false },
]

export const headersClients = [
    { title: 'Cliente', key: 'name' },
    { title: 'Activo', key: 'active' },
    { title: 'Acciones', key: 'actions', sortable: false },
]


export const groupUbications = [{ key: 'client_name', order: 'asc' }]

export const headersUbications = [
    // { title: 'Cliente', key: 'client_name' },
    { title: 'Nombre de la ubicación', key: 'location_name' },
    { title: 'Dirección', key: 'address' },
    { title: 'Distrito', key: 'district_name' },
    { title: 'Activo', key: 'active' },
    { title: 'Acciones', key: 'actions', sortable: false },
]


export const headersSoliTesoreria = [
    { title: 'Empleado', key: 'employee_name' },
    { title: 'Monto Solicitado', key: 'requested_amount' },
    { title: 'Fecha de Solicitud', key: 'request_date' },
    { title: 'Estado', key: 'status' },
]

export const headersBudgetViatics = [
    { title: 'VIATICO', key: 'code' },
    { title: 'Empleado', key: 'employee_name' },
    { title: 'Tipo de Viático', key: 'type' },
    { title: 'Cliente', key: 'client_name' },
    { title: 'Proyecto', key: 'proyect_name' },
    { title: 'Presupuestado', key: 'budget_total' },
    { title: 'Saldo', key: 'deposit_amount' },
    { title: 'Estado', key: 'status' },
    { title: 'Acciones', key: 'actions' },
]

export const headerCostBudget = [
    { title: 'Concepto', key: 'concept_name' },
    { title: 'Tipo', key: 'frequency_type' },
    { title: 'Frecuencia', key: 'frequency' },
    { title: 'Monto', key: 'amount' },
    { title: 'Subtotal', key: 'subtotal' },
]



export const headersDepositsList = [
    { title: 'Codigo', key: 'code' },
    { title: 'Fecha', key: 'date_deposit' },
    { title: 'Monto', key: 'amount' },
    { title: 'Voucher', key: 'voucher' },
    { title: 'Tipo', key: 'type' },
    { title: 'Acciones', key: 'actions' },
]

export const headersConceptsList = [
    { title: 'Descripción', key: 'description' },
    { title: 'Acciones', key: 'actions' },
]


export const headersDeclarationsUser = [
    { title: 'Viatico', key: 'viatic_code' },
    { title: 'Proyecto', key: 'project' },
    { title: 'Cliente', key: 'client' },
    { title: 'Saldo', key: 'balance' },
    { title: 'Declarado', key: 'declare_amount' },
    { title: 'Estado', key: 'status' },
    { title: 'Acciones', key: 'actions' },
]

export const headersLiquidationsUser = [
    { title: 'TIPO', key: 'document_type' },
    { title: 'DOCUMENTO', key: 'document_number' },
    { title: 'FECHA', key: 'expense_date' },
    { title: 'DESCRIPCION', key: 'option_name' },
    { title: 'COSTO', key: 'amount' },
    { title: 'ACCIONES', key: 'actions', align: 'end' },
]

export const headersMovilityUser = [
    { title: 'FECHA', key: 'expense_date' },
    { title: 'MOTIVO', key: 'option_name' },
    { title: 'DESDE', key: 'travel_from' },
    { title: 'HASTA', key: 'travel_to' },
    { title: 'MONTO', key: 'amount' },
    { title: 'ACCIONES', key: 'actions', align: 'end' },
]

export const headersDDJJAlimUser = [
    { title: 'FECHA', key: 'expense_date' },
    { title: 'DESCRIPCION', key: 'option_name' },
    { title: 'MONTO', key: 'amount' },
    { title: 'ACCIONES', key: 'actions', align: 'end' },
]

export const headersDDJJMovUser = [
    { title: 'FECHA', key: 'expense_date' },
    { title: 'MOTIVO', key: 'option_name' },
    { title: 'DESDE', key: 'travel_from' },
    { title: 'HASTA', key: 'travel_to' },
    { title: 'MONTO', key: 'amount' },
    { title: 'ACCIONES', key: 'actions', align: 'end' },
]

export const headersLiquidationConfig = [
    { title: 'TIPO', key: 'document_type' },
    { title: 'CATEGORIA', key: 'category' },
    { title: 'OPCION', key: 'label' },
    { title: 'ACCIONES', key: 'actions', sortable: false },
]

export const groupConfigurations = [{ key: 'document_type', order: 'asc' }]
