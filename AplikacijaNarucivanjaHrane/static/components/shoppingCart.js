Vue.component("shoppingCart", {
	data: function () {
		    return {
			  customer: {shoppingCart: {items: []}}
		    }
	},
	template: ` 
<div>
    <h3>Korpa</h3>
    <hr/>
    <table border="1" v-bind:hidden="customer.shoppingCart.items.length == 0">
        <tr bgcolor="lightgray">
            <th>Artikl</th>
            <th>Cena</th>
            <th>Količina</th>
            <th>Ukupno</th>
        </tr>
        <tr v-for="cartItem in customer.shoppingCart.items">
            <td>{{cartItem.item.name}}</td>
            <td>{{cartItem.item.price}}</td>
            <td>{{cartItem.count}}</td>
            <td>{{cartItem.totalPrice}}</td>
        </tr>
    </table>

    <b v-bind:hidden="customer.shoppingCart.items.length != 0">Vaša korpa je trenutno prazna</b>
    
    <hr/>
    <div v-bind:hidden="customer.shoppingCart.items.length != 0">
        <table>
        <tr>
            <td>UKUPNO:</td>
            <td>{{customer.shoppingCart.totalPrice}}</td>
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
                } else {
                    router.push('/')
                }
			})
            .catch(function(error){
                router.push('/');
            })
		}
	}
});