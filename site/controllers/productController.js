let {validationResult} = require ('express-validator');
const fs = require('fs');
const path = require('path');
const deleteFailureFile = path.join(__dirname, '../public/images/products/');
const allFunctions = require("../helpers/allFunctions");
let db = require("../database/models");

const productController = {
    detail: async (req,res)=>{
        try{
            const detalleProducto = await db.Product.findByPk(req.params.id);
            return res.render("products/product-detail",{product: detalleProducto})

        } catch (errors) {
            return res.send("Ha ocurrido un error en el pedido a la base de datos: ", errors);
        }
    },
    cart: (req,res)=>{
        return res.render("products/product-cart")
    },
    productPage: async (req,res)=>{
        try{
            const products = await db.Product.findAll();
            return res.render("products/products", {products: products})
        } catch (errors) {
            return res.send("Ha ocurrido un error en el pedido a la base de datos: ", errors);
        }
    },
    create: (req,res)=>{
        return res.render("products/create-product")
    },
    store: async (req,res, next)=>{
        try {
            const errors = validationResult(req);
        
            if(!errors.isEmpty()){
                    res.render("products/create-product", {errors: errors.mapped()});
                    return req.files[0] && req.files[0].filename ? fs.unlinkSync(deleteFailureFile + req.files[0].filename) : " ";
                }
            
            await db.Product.create({
                name: req.body.name,
                price: req.body.price,
                introduction: req.body.introduction,
                description: req.body.description,
                weight_KG: req.body.weight,
                size: req.body.size,
                material: req.body.material,
                category: req.body.category,
                homepage: req.body.homepage,
                image: req.files[0].filename
            });        
            return res.redirect('/admin');
        } catch (errors) {
            return res.send("Ha ocurrido un error en el pedido a la base de datos: ", errors);
        } 
    },
    edit: async (req,res)=>{
        try {
            const id = req.params.id;
            const products = await db.Product.findAll();
            const productToEdit = products.find((product)=>product.id==id);   
            return res.render("products/edit-product", {productToEdit:productToEdit});
        } catch (errors) {
            return res.send("Ha ocurrido un error en el pedido a la base de datos: ", errors);
        } 
    },
    editProduct: async (req,res)=>{
        try {
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                const id = req.params.id;
                const products = await db.Product.findAll();
                const productToEdit = products.find((product)=>product.id==id);
                
                res.render("products/edit-product", {errors: errors.mapped(), productToEdit:productToEdit});
                return req.files[0] && req.files[0].filename ? fs.unlinkSync(deleteFailureFile + req.files[0].filename) : " ";
                }

            const products = await db.Product.findAll();
            const id = req.params.id;

            const editedProduct = await db.Product.update({
                name: req.body.name,
                price: req.body.price,
                introduction: req.body.introduction,
                description: req.body.description,
                weight_KG: req.body.weight,
                size: req.body.size,
                material: req.body.material,
                category: req.body.category,
                homepage: req.body.homepage,
                image: req.files[0] ? req.files[0].filename : product.image
            }, { where: { id: 1 }});
            return res.redirect("/admin")
        } catch (errors) {
            return res.send("Ha ocurrido un error en el pedido a la base de datos: ", errors);
        } 
    },
    destroy: async (req,res)=>{
        try {
            const id = req.params.id;
            await db.Product.destroy({
                where: { id: id }
            })        
            return res.redirect("/admin");
        } catch (errors) {
            return res.send("Ha ocurrido un error en el pedido a la base de datos: ", errors);
        }
    }
}

module.exports=productController;

