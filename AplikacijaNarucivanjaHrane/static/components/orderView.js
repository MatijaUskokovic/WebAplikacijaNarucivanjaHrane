Vue.component("orderView", {
	data: function () {
		    return {
			  loggedUser: {},
              order: {customer: {}}
		    }
	},
	template: ` 
<div v-if="order">
    <h3>Porudžbina broj: {{order.id}}</h3>
    <p>Kupac: {{order.customer.name}} {{order.customer.surname}}</p>
    <p>Datum porudzbine: {{order.dateOfOrder | dateFormat('DD.MM.YYYY')}}</p>
    <hr/>
    <table border="1">
        <tr bgcolor="lightgray">
            <th colspan="2">Artikl</th>
            <th>Cena</th>
            <th>Količina</th>
            <th>Ukupno</th>
        </tr>
        <tr v-for="cartItem in order.orderedItems">
            <td><img :src="cartItem.item.image" width="100" height="70"></td>
            <td>{{cartItem.item.name}}</td>
            <td>{{cartItem.item.price}}</td>
            <td>{{cartItem.count}}</td>
            <td>{{cartItem.totalPrice}}</td>
        </tr>
    </table>
    
    <hr/>
    <div>
        <table>
        <tr>
            <td><b>UKUPNO:</b></td>
            <td>{{order.price}} din</td>
        </tr>
        </table>
    </div>
</div>
`
	, 
	mounted () {
		this.getLoggedUserAndOrder();
    },
	methods: {
		getLoggedUserAndOrder : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
                this.loggedUser = response.data;
                this.getSelectedOrder();
			})
            .catch(function(error){
                router.push('/');
            })
		},
        getSelectedOrder : function() {
            if (app == null) {
                router.push('/');
            }
            else {
                this.order = app.selectedOrder;
                this.order.dateOfOrder = new Date(parseInt(this.order.dateOfOrder));
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