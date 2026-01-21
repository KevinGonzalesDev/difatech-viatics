export const headersRoles = [
    { title: 'Nombre', key: 'name' },
    { title: 'Puesto', key: 'position' },
    { title: 'Correo', key: 'email' },
    { title: 'Rol', key: 'roles' },
    { title: 'Estado', key: 'active' },
    { title: 'Acciones', key: 'actions', sortable: false },
]

export const headerviaticsUser = [
    { title: 'ID', key: 'id' },
    { title: 'Empleado', key: 'employee_name' },
    { title: 'Tipo de Viático', key: 'type' },
    { title: 'Cliente', key: 'client_name' },
    { title: 'Ubicación', key: 'location_address' },
    { title: 'Fecha Inicio', key: 'startdate' },
    { title: 'Fecha Fin', key: 'enddate' },
    { title: 'Motivo', key: 'soli_reason' },
    { title: 'Estado', key: 'status' },
    { title: 'Acciones', key: 'actions' },
]

export const headersoliAdmviatics = [
    { title: 'Empleado', key: 'employee_name' },
    { title: 'Tipo de Viático', key: 'type' },
    { title: 'Cliente', key: 'client_name' },
    { title: 'Proyecto', key: 'project_name' },
    { title: 'Ubicación', key: 'location_name' },
    { title: 'Fecha Inicio', key: 'startdate' },
    { title: 'Fecha Fin', key: 'enddate' },
    { title: 'Motivo', key: 'soli_reason' },
    { title: 'Estado', key: 'status' },
    { title: 'Acciones', key: 'actions' },
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
    { title: 'Empleado', key: 'employee_name' },
    { title: 'Tipo de Viático', key: 'type' },
    { title: 'Cliente', key: 'client_name' },
    { title: 'Proyecto', key: 'proyect_name' },
    { title: 'Estado', key: 'status' },
    { title: 'Acciones', key: 'actions' },
]
