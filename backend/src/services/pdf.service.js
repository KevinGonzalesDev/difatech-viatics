import fs from 'fs'
import puppeteer from 'puppeteer'
import path from 'path'
import { formatDate } from '../utils/dateFormatter.js'

export const generateViaticPDF = async (data) => {

  const templatePath = path.resolve('src/templates/viatic-resumen.html')

  console.log(templatePath);

  let html = fs.readFileSync(templatePath, 'utf8')



  // Reemplazos simples
  html = html
    .replace('{{PRESENTACION}}', formatDate(data.presentation_date))
    .replace('{{ESTADO}}', data.estado)
    .replace('{{CODIGO_TRABAJADOR}}', data.codigo_trabajador)
    .replace('{{NOMBRE_COMPLETO}}', data.nombre_completo)
    .replace('{{PROYECT_NAME}}', data.proyect_name)
    .replace('{{CENTRO_COSTO}}', data.centro_costo)
    .replace('{{CLIENT_NAME}}', data.client_name)
    .replace('{{PLANTA_NAME}}', data.planta_name)
    .replace('{{START_MOV}}', formatDate(data.start_mov))
    .replace('{{END_MOV}}', formatDate(data.end_mov))
    .replace('{{ARRIVE_DATE}}', formatDate(data.arrive_date))
    .replace('{{EXIT_DATE}}', formatDate(data.exit_date))

  // Generar filas dinámicas
  const rows = data.depositos.map(d => `
    <tr>
      <td>${d.voucher}</td>
      <td>${d.fecha}</td>
      <td>S/ ${d.monto}</td>
    </tr>
  `).join('')

  html = html.replace('{{TABLE_ROWS}}', rows)

  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  return pdf
}

export const generateViaticliquidationPDF = async (data) => {

  const templatePath = path.resolve('src/templates/liquidation-gastos.html')


  let html = fs.readFileSync(templatePath, 'utf8')



  // Reemplazos simples
  html = html
    .replace('{{NRO_VIAJE}}', data.nro_viaje)
    .replace('{{CENTRO_COSTO}}', data.centro_costo)
    .replace('{{NOMBRE_COMPLETO}}', data.nombre_completo.toUpperCase())
    .replace('{{CODIGO_TRABAJADOR}}', data.codigo_trabajador)
    .replace('{{AREA_EMPLOY}}', data.area_employ)
    .replace('{{PROYECT_NAME}}', data.proyect_name)
    .replace('{{CLIENT_NAME}}', data.client_name)
    .replace('{{PLANTA_NAME}}', data.planta_name)
    .replace('{{PRESENTATION}}', formatDate(data.presentation_date))
    .replace('{{ESTADO}}', data.estado)
    .replace('{{START_MOV}}', formatDate(data.start_mov))
    .replace('{{END_MOV}}', formatDate(data.end_mov))



  const Declarationrows = data.declarations.map(d => {
    console.log(d);

    let hospAlim = ''
    let movilidad = ''
    let otros = ''

    switch (d.category) {
      case 'ALOJAMIENTO':
      case 'ALIMENTACION':
        hospAlim = `S/ ${Number(d.amount).toFixed(2)}`
        break

      case 'MOVILIDAD':
        movilidad = `S/ ${Number(d.amount).toFixed(2)}`
        break

      default:
        otros = `S/ ${Number(d.amount).toFixed(2)}`
    }

    return `
    <tr>
      <td>${d.document}</td>
      <td>${formatDate(d.fecha)}</td>
      <td>${d.description}</td>
      <td>${hospAlim}</td>
      <td>${movilidad}</td>
      <td>${otros}</td>
      <td>S/ ${Number(d.amount).toFixed(2)}</td>
    </tr>
  `
  }).join('')

  // Generar filas dinámicas

  let totalHospAlim = 0
  let totalMovilidad = 0
  let totalOtros = 0

  data.declarations.forEach(d => {
    switch (d.category) {
      case 'ALOJAMIENTO':
      case 'ALIMENTACION':
        totalHospAlim += Number(d.amount)
        break

      case 'MOVILIDAD':
        totalMovilidad += Number(d.amount)
        break

      default:
        totalOtros += Number(d.amount)
    }
  })

  const depositCodes = data.deposits
    .map(d => d.code)
    .join(', ')

  const depositCodesFormatted = `(${depositCodes})`

  const totalDeposits = data.deposits
    .reduce((acc, d) => acc + Number(d.amount), 0)


  html = html.replace('{{DECLARATION_ROWS}}', Declarationrows)
  html = html.replace('{{DEPOSIT_CODES}}', depositCodesFormatted)
  html = html.replace('{{TOTAL_DEPOSITS}}', `S/ ${totalDeposits.toFixed(2)}`)
  html = html.replace('{{TOTAL_HOSPALIM}}', `S/ ${totalHospAlim.toFixed(2)}`)
  html = html.replace('{{TOTAL_MOVILIDAD}}', `S/ ${totalMovilidad.toFixed(2)}`)
  html = html.replace('{{TOTAL_OTROS}}', `S/ ${totalOtros.toFixed(2)}`)
  html = html.replace('{{TOTAL_GENERAL}}', `S/ ${(totalHospAlim + totalMovilidad + totalOtros).toFixed(2)}`)

  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  return pdf
}

export const generateViaticMovilityPDF = async (data) => {

  const templatePath = path.resolve('src/templates/movility-gastos.html')


  let html = fs.readFileSync(templatePath, 'utf8')


  const formatMonthYear = (date) => {
    const d = new Date(date)

    const month = new Intl.DateTimeFormat('es-ES', {
      month: 'long'
    }).format(d)

    const year = d.getFullYear()

    return `${month.toUpperCase()} ${year}`
  }

  // Reemplazos simples
  html = html
    .replace('{{NRO_VIAJE}}', data.nro_viaje)
    .replace('{{NOMBRE_COMPLETO}}', data.nombre_completo.toUpperCase())
    .replace('{{CODIGO_TRABAJADOR}}', data.codigo_trabajador)
    .replace('{{PERIODO_MOV}}', formatMonthYear(data.end_mov))
    .replace('{{PRESENTATION}}', formatDate(data.presentation_date))
    .replace('{{ESTADO}}', data.estado)
    .replace('{{START_MOV}}', formatDate(data.start_mov))
    .replace('{{END_MOV}}', formatDate(data.end_mov))



  const Declarationrows = data.declarations.map(d => {

    return `
    <tr>
      <td>${formatDate(d.fecha)}</td>
      <td>${d.description}</td>
      <td>${d.origin}</td>
      <td>${d.destiny}</td>
      <td>S/ ${Number(d.amount).toFixed(2)}</td>
    </tr>
  `
  }).join('')

  // Generar filas dinámicas

  let totalMovilidad = 0
  let totalOtros = 0

  data.declarations.forEach(d => {
    switch (d.category) {
      case 'MOVILIDAD':
        totalMovilidad += Number(d.amount)
        break

      default:
        totalOtros += Number(d.amount)
    }
  })




  html = html.replace('{{DECLARATION_ROWS}}', Declarationrows)
  html = html.replace('{{TOTAL_MOVILIDAD}}', `S/ ${totalMovilidad.toFixed(2)}`)
  html = html.replace('{{TOTAL_OTROS}}', `S/ ${totalOtros.toFixed(2)}`)
  html = html.replace('{{TOTAL_GENERAL}}', `S/ ${(totalMovilidad + totalOtros).toFixed(2)}`)

  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()

  return pdf
}