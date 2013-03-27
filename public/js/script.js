var UPCModel = Backbone.Model.extend({
	urlRoot: "/upc/",
	idAttribute: "id",

	defaults: {
		"valid": "true",
		"number": "0",
		// "itemname": "UPC Database Testing Code",
		// "description": "http:\/\/upcdatabase.org\/code\/0111222333446",
		"price": 1.25,
		"ratingsup": 0,
		"ratingsdown": 0
	},

	initialize: function (options){
		this.on("sync", function (){
			if(this.get("id") == this.get("number")){
				this.set("id", new Date().getTime());
			}
		})
	}
});

var shoppingCart = new Backbone.Collection({
	model: UPCModel
});

var ShoppingCartView = Backbone.View.extend({
	initialize: function (options){
		this.listenTo(this.collection, "add", this.addItem);
	},

	addItem: function (model){
		console.log(arguments);
		var el = $("<div>");
		new UPCView({
			model: model,
			el: el
		}).render();

		this.$(".fm-items").append(el);
	},

	handleChange: function (){
		this.$(".fm-total", "$54.00")
	}
});

var UPCView = Backbone.View.extend({
	initialize: function (options){
		this.listenTo(this.model, "change", this.render);
	},

	render: function (){
		this.$el.html(this.model.get("itemname") + " - $" +this.model.get("price"));
	}
});

var shoppingCartView = new ShoppingCartView({
	el: ".sidebar-nav",
	collection: shoppingCart
});

var code = "",
	timeout = false;

$(window).keypress(function (event){
	code += String.fromCharCode(event.which);
	if(timeout){
		clearTimeout(timeout);
	}

	timeout = setTimeout(handleNewBarcode, 50);
});

var handleNewBarcode = function (){

	var myCode = code.replace(/\s+/g, '');
	code = "";
	timeout = false;

	if(myCode.length){

		console.log(myCode);

		var upc = new UPCModel({id: myCode});
		shoppingCart.add(upc);

		upc.fetch();

	}
}


