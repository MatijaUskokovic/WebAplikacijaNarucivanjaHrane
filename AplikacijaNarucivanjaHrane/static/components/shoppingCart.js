Vue.component("shoppingCart", {
	data: function () {
		    return {
			  customer: {shoppingCart: {items: []}},
              count: 0,
              restaurant: {}
		    }
	},
	template: ` 
<div>
    <h3>Korpa</h3>
    <hr/>
    <table border="1" v-bind:hidden="customer.shoppingCart.items.length == 0">
        <tr bgcolor="lightgray">
            <th colspan="2">Artikl</th>
            <th>Cena</th>
            <th>Količina</th>
            <th>Ukupno</th>
        </tr>
        <tr v-for="cartItem in customer.shoppingCart.items">
            <td><img :src="cartItem.item.image" width="100" height="70"></td>
            <td>{{cartItem.item.name}}</td>
            <td>{{cartItem.item.price}}</td>
            <td><input type="text" v-model="cartItem.count" @change="changeCount(cartItem)" @mouseenter="saveCount(cartItem.count)"></td>
            <td>{{cartItem.totalPrice}}</td>
            <td><button @click="removeItemFromCart(cartItem)">Izbaci</button></td>
        </tr>
    </table>

    <b v-bind:hidden="customer.shoppingCart.items.length != 0">Vaša korpa je trenutno prazna</b>
    
    <hr/>
    <div v-bind:hidden="customer.shoppingCart.items.length == 0">
        <table>
        <tr>
            <td>UKUPNO:</td>
            <td>{{customer.shoppingCart.totalPrice}} din</td>
        </tr>
        <tr>
            <button @click="createOrder()">Poruči</button>
        </tr>
        </table>
    </div>
</div>
`
	, 
	mounted () {
		this.getLoggedUser();
    },
	methods: {
		getLoggedUser : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
                if (response.data.role == "Kupac"){
                    this.customer = response.data;
                    // dobavljanje restorana
                    for (let scItem of this.customer.shoppingCart.items){
                        this.restaurant = scItem.item.restaurant;
                        break;
                    }
                } else {
                    router.push('/')
                }
			})
            .catch(function(error){
                router.push('/');
            })
		},
        removeItemFromCart : function(cartItem) {
            let index = this.customer.shoppingCart.items.indexOf(cartItem);
            if (index > -1) {
                this.customer.shoppingCart.items.splice(index, 1);
            }
            this.saveChangeOnServer();
        },
        saveCount : function(count) {
            if (!isNaN(count) && count > 0){
                this.count = count;
            }
        },
        changeCount : function(cartItem) {
            if (isNaN(cartItem.count) || cartItem.count <= 0){
                cartItem.count = this.count;
            }
            else{
                this.saveChangeOnServer();
            }
        },
        saveChangeOnServer : function() {
            let jsonShoppingCart = JSON.stringify(this.customer.shoppingCart);
            axios
			.post('rest/shoppingCarts', jsonShoppingCart)
			.then(response => {
                this.customer.shoppingCart = response.data;
			})
			.catch(function(error){
				alert('Neuspešna izmena korpe')
			})
        },
        createOrder : function() {
            let date = new Date();
            let order = {
                orderedItems : this.customer.shoppingCart.items,
                restaurantOfOrder: this.restaurant,
                dateOfOrder: date.getTime(),
                price: this.customer.shoppingCart.totalPrice,
                customer: this.customer,
                status: 'Obrada'
            };
            let jsonOrder = JSON.stringify(order);
            axios
            .post('rest/orders', jsonOrder)
            .then(response => {
                this.customer.shoppingCart = {customerId: this.customer.id, items: []};
                alert("Uspešno kreirana porudžbina")
                this.calculatePointsAndAddOrder(response.data);
                this.saveChangeOnServer();
            })
            .catch(function(error) {
                alert("Neuspešno kreiranje porudžbine")
            })
        },
        calculatePointsAndAddOrder : function(order) {
            this.customer.pointsCollected = Number(this.customer.pointsCollected) + Math.round((order.price/1000) * 133);
            this.customer.allOrders.push(order);
            let user = JSON.stringify(this.customer);
            axios
			.put('rest/customers/' + this.customer.id, user)
			.then(response => {
                
			})
			.catch(function(error){
				alert('Greška prilikom dodavanja bodova')
			})
        }
	}
});