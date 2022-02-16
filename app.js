const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
var reload = require('reload')
const app = express()
app.use(bodyParser.json())
app.use(cors())

var users = [];
/*
general architecture
	server is center of activity
	client posts finished drink orders to server
	menu + queue polls server asking for a list of orders
	menu + queue sets a timer when an order is received, and then>
	menu + queue posts orders that should be ready to serve
	bar polls server asking for a list of finished drinks

	Client / menu / bar should all be seperate clients, all accessing same Vue client server, at different routes
*/


/* drink prototype
drink = {
	item:"Matcha",
	name:"Howard",
	id:"!21de1dn1vd12s"
}
*/
var users = [];
var drinkLists = [];
// drinkLists = [{
// 	ip:#######
// 	ready_drinks:[],
// 	ordered_drinks:[]
// }]
var all_letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';

function checkForUser(ip){
	var foundList = false;
	var myList = {
		ip:ip,
		ready_drinks:[],
		ordered_drinks:[]
	}
	drinkLists.forEach((ls)=>{
		if(ls.ip == ip){
			foundList = true;
			myList = ls	
			return myList
		}
	});
	if(!foundList){
		drinkLists.push(myList);
	}
	return myList
}

app.get('/drinks',(req,res)=>{

	var myList = checkForUser(req.ip);
	var delete_these = req.query.delete;
	delete_these = delete_these.split("0")
	delete_these.forEach((id)=>{
		myList.ordered_drinks.forEach((child,i)=>{
			if(child.id == id){
				myList.ordered_drinks.splice(i,1)
			}
		})

	})
	res.send(myList.ordered_drinks);

});

function generate_id(len){
	var name = ""
	while(len > 0){
		var index = Math.random() * all_letters.length;
		index = Math.floor(index);
		name += all_letters[index]
		len --;
	}
	return name
}

app.post('/drinks',(req,res)=>{
	var myList = checkForUser(req.ip);
	var drink = {
		name:req.body.name,
		item:req.body.item,
		id:generate_id(32)
	}
	myList.ordered_drinks.push(drink);
	if(drink.name && drink.item){
		res.sendStatus(200)
	}
	else{
		res.sendStatus(404)
	}
})

app.get('/drinks_ready',(req,res)=>{
	var myList = checkForUser(req.ip);
	res.send(myList.ready_drinks);
	ready_drinks = [];
});

app.post('/drinks_ready',(req,res)=>{
	var myList = checkForUser(req.ip);
	var drink = {
		name:req.body.name,
		item:req.body.item
	}
	myList.ready_drinks.push(drink);
	res.sendStatus(200)
})


app.post('/location',(req,res)=>{
	var myIP = req.ip;
	var user = {
		ip:myIP,
		location:req.body.location,
		trackerID:req.body.trackerID
	}
	console.log(user.location);
	console.log(user.trackerID);
	console.log(user.ip);
	users.push(user);
	res.sendStatus(200)
});


app.get('/location',(req,res)=>{
	var myIP = req.ip;
	var user = {
		ip:myIP,
		location:req.body.location,
		trackerID:req.body.trackerID
	}
	console.log(user.location);
	console.log(user.trackerID);
	console.log(user.ip);
	users.push(user);
	res.sendStatus(200)
});
app.listen(process.env.PORT || 8081,()=>{
	console.log(". . .")
	console.log("Server started on IP " +" port 8081")
	console.log(". . .")
})