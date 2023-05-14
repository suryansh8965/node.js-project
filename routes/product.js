
const mongoose =require('mongoose');

const productSchema=mongoose.Schema({

productname:String,
price:Number,
des:String,
userid:{type:mongoose.Types.ObjectId,
 ref:"user"},
pic:{
type:Array,
default:[]
},
sellerid:String

})

module.exports=mongoose.model('product',productSchema)