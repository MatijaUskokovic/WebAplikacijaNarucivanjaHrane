Vue.component("orders", {
	data: function () {
		    return {
			  loggedUser: {},
              allOrders: {},
              ordersToShow: {}
		    }
	},
	template: ` 
<div>
    <h3>Prikaz porudžbina</h3>
    <table border="1">
        <tr bgcolor="lightgray">
            <th>Šifra porudžbine</th>
            <th>Status porudžbine</th>
            <th>Datum porudžbine</th>
            <th>Restoran</th>
            <th>Tip restorana</th>
            <th>Ukupno</th>
        </tr>
        <tr v-for="order in ordersToShow">
            <td>{{order.id}}</td>
            <td>{{order.status}}</td>
            <td>{{order.dateOfOrder | dateFormat('DD.MM.YYYY')}}</td>
            <td>{{order.restaurantOfOrder.name}}</td>
            <td>{{order.restaurantOfOrder.type}}</td>
            <td>{{order.price}}</td>
        </tr>
    </table>
</div>
`
	, 
	mounted () {
		this.getLoggedUserAndOrders();
    },
	methods: {
        getLoggedUserAndOrders : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				this.loggedUser = response.data;
                this.getAppropriateOrders();
			})
            .catch(function(error){
                router.push('/');
            })
		},
        getAppropriateOrders : function() {
            // Kupac ima prikaz svih svojih porudzbina
            if (this.loggedUser.role == 'Kupac'){
                this.allOrders = this.loggedUser.allOrders;
                this.ordersToShow = this.allOrders;
            }
            // Dostavljac ima prikaz svih porudzbina koje su u statutu "Ceka_dostavljaca" i prikaz svih za koje je on zaduzen
            else if (this.loggedUser.role == 'Dostavljac'){
                
            }
            // Menadzer ima prikaz svih porudzbina koje su vezane za njegov restoran
            else if(this.loggedUser.role == 'Menadzer'){
                if (this.loggedUser.restaurant.id != null && this.loggedUser.restaurant.id != -1){
                    axios
                    .get('rest/ordersOfRestaurant/' + this.loggedUser.restaurant.id)
                    .then(response => {
                        this.allOrders = response.data;
                        this.ordersToShow = response.data;
                    })
                }
                
            }
        }
	},
    filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	}
   	}
});