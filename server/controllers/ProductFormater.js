const getUnits = (product) => {
    
      translate = {
        'UND' : 'Unidad',
        'PZA' : 'Pieza',
        'CAJ' : 'Caja',
        'BLT' : 'Bulto'
      }
    const array = [];
    if(product.equi_uni2 > 1){
      array.push(
        ({
          extra_unit     : translate[product.suni_venta],
          qty_to_show    : this._product.equi_uni2
        })
      )
    }else if(product.equi_uni3 > 1) {
      array.push(
        ({
          extra_unit     : translate[product.tuni_venta.trim()],
          qty_to_show    : product.equi_uni3
        })
      )
    }
    return array;
}
module.exports = getUnits;