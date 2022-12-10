const express = require ('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const Arsenal = require ('./models/arsenal');
const cors = require('cors')
mongoose.connect(`mongodb+srv://mongo_arsenal:mongo_arsenal@cluster-t1-lp2.nsr9ne2.mongodb.net/arsenal?retryWrites=true&w=majority`)
.then(() => {
    console.log ("Conexão OK")
   }).catch(() => {
    console.log("Conexão NOK")
   });
   
app.use (bodyParser.json());

app.use (cors())

app.post ('/api/arsenal', (req, res, next) => {
    var item = req.body.tropa;
    console.log(item)
    tipo = item.tipo.toUpperCase().trim()
    nome = item.nome.toUpperCase().trim()
    quantidade = item.quantidade
    if(Number(quantidade)<=0){
        return res.status(201).json({mensagem: 'Quantidade Inválida', arsenal:[], tipo: 'inválido'})
    }
    Arsenal.find({'nome':`${nome}`}).then((list_find) =>
    {
        console.log(list_find)
        if (list_find.length === 0){
            const arsenal = new Arsenal({
                tipo: tipo,
                nome: nome,
                quantidade: quantidade
                })
            console.log (arsenal);
            arsenal.save().then(() => {
            Arsenal.find().then((arsenal_atualizado) => {
                res.status(201).json({mensagem: 'Item inserido no arsenal', arsenal:arsenal_atualizado, tipo: 'novo'})
            }).catch((e)=>{
                console.log(e.message)
                res.status(500).json({mensagem: "Erro ao inserir informações", tipo: "erro"})})
        })} else {
                Arsenal.find().then((arsenal_atual) => 
                res.status(201).json({mensagem: 'Item já inserido no arsenal', arsenal:arsenal_atual, tipo: 'existente'})
                ).catch((e)=>{
                    console.log(e.message)
                    res.status(500).json({mensagem: "Erro ao recuperar informações", tipo: "erro"})})
            }
        }).catch((e)=>{
            console.log(e.message)
            res.status(500).json({mensagem: "Erro ao fazer requisição de adicionar informações", tipo: "erro"})})
});

app.delete ('/api/arsenal/:nome', (req, res, next) => {
    Arsenal.deleteOne( { nome: `${req.params.nome}` }).then(() => {
        Arsenal.find().then((arsenal) => 
        res.status(201).json({mensagem: 'Item Deletado com Sucesso!', arsenal:arsenal, tipo: 'sucesso'})
        ).catch((e)=>{
            console.log(e.message)
            res.status(500).json({mensagem: "Erro ao deletar informações", tipo: "erro"})})
    }).catch((e)=>{
        console.log(e.message)
        res.status(500).json({mensagem: "Erro ao fazer requisição para deletar informações", tipo: "erro"})})
});

app.put ('/api/arsenal/:nome', (req, res, next) => {
    Arsenal.updateOne( { nome: `${req.params.nome}` }, { quantidade: `${req.body.quantidade}` }).then(() => {
        Arsenal.find().then((arsenal) => 
        res.status(201).json({mensagem: 'Item Atualizado com Sucesso!', arsenal:arsenal, tipo: 'sucesso'})
        ).catch((e)=>{
            console.log(e.message)
            res.status(500).json({mensagem: "Erro ao atualizar item", tipo: "erro"})})
    }).catch((e)=>{
        console.log(e.message)
        res.status(500).json({mensagem: "Erro ao fazer requisição de atualizar", tipo: "erro"})})
});   
   
app.get('/api/arsenal', (req, res, next) => {
    Arsenal.find().then(item => {
        res.status(200).json({
        mensagem: "Sucesso ao coletar dados do arsenal!",
        arsenal: item,
        tipo: 'sucesso'
        });
        }).catch((e)=>{
            console.log(e.message)
            res.status(500).json({mensagem: "Erro ao recuperar informações", tipo: "erro"})})
});
   
module.exports = app;