const getConnection = require('../database/connection');

const getUnits = require('./ProductFormater')

const {toFixed, number_format} = require('./numberFormats')

const queryTasa = async () => {
  const pool = await getConnection()

  const {recordset} = await pool.request()
  .query("SELECT * FROM Consu_Tasa WHERE co_mone = 'US$'");

  return recordset.length === 0 ? {
    co_mone : 'US$',
    mone_des : 'Dolares Americanos',
    cambio : 0,
    cambio_show : "0"
  } : {
    co_mone : recordset[0].co_mone,
    mone_des : recordset[0].mone_des,
    cambio : recordset[0].cambio,
    cambio_show : number_format(recordset[0].cambio,2,',','.')
  }

}

const getTasa = async (req, res) => {
  const pool = await getConnection()

  const result = await pool.request()
  .query("SELECT * FROM Consu_Tasa WHERE co_mone = 'US$'")

  if(result.recordset.length === 0){
    res.status(200).json([])
  }

  const tasa = [{
    co_mone : result.recordset[0].co_mone,
    mone_des : result.recordset[0].mone_des,
    cambio : result.recordset[0].cambio,
    cambio_show : number_format(result.recordset[0].cambio,2,',','.')
  }]

  res.status(200).json(tasa)
}


const getProduct = async (req, res) => {

  const { barcode } = req.body

  console.log(req.body);
  if(!barcode) { 
    res.json({not_found:true})

    return
  }

  const pool = await getConnection()

  let result = await pool.request()
  .query(`SELECT * FROM Consu_Art WHERE ref like '%${barcode}%'`)

  if(result.recordset.length === 0) {
    //es un producto de la balanza
    let pluCode       = barcode.slice(1,6);
    let intWeight     = barcode.slice(6,8);
    let decimalWeight = barcode.slice(8,11);
    
    result = await pool.request().query(`
      SELECT *,
      'is_plu' as is_plu,
      '${intWeight}' as int_weight,
      '${decimalWeight}' as decimal_weight
      FROM Consu_Art WHERE modelo like '%${pluCode}%'
    `)

    if(result.recordset.length === 0) { 
      res.json({not_found:true})
      return
    }
  }

  const tasa = await queryTasa()

  const productFormated = formatPresentation(result.recordset, tasa);

  res.json({
    product : productFormated,
    tasa
  })
}

const formatPresentation = ( product , tasa) => {

  if( product.length === 0 ) return [];

  if(product[0].is_plu) {
    return formatPluProduct(product[0], tasa)
  }
  
  return formatNormalProduct(product[0], tasa)
}

const formatPluProduct = (product, tasa) => {
  product.is_plu = true;
  product.prec_vta1_num = Number(product.prec_vta1)

  product.precioFormated = number_format(toFixed(product.prec_vta1_num, 2),2,',','.')

  product.peso   = Number(`${product.int_weight}.${product.decimal_weight}`)

  product.pesoFormated = number_format(toFixed(product.peso, 3),3,',','.')

  product.total  = Number(product.peso * product.prec_vta1_num)

  product.totalFormated = number_format(toFixed(product.total, 2),2,',','.')

  product.precioBs = Number(toFixed(product.total, 2) * tasa.cambio)

  product.precioBsFormated = number_format(toFixed(product.precioBs, 2),2,',','.')

  product.aditional_units = getUnits(product)

  return product;
}

const formatNormalProduct = (product, tasa) => {

  product.prec_vta1 = Number(product.prec_vta1);

  product.precio_formated = number_format(toFixed(product.prec_vta1, 2),2,',','.')

  product.precioBs = Number(toFixed(product.prec_vta1, 2) * tasa.cambio)

  product.precioBsFormated = number_format(toFixed(product.precioBs, 2),2,',','.')

  product.aditional_units = getUnits(product)

  return product;
}


module.exports = {getTasa, getProduct}