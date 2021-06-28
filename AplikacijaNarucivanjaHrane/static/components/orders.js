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
    <div v-bind:hidden="loggedUser.role !== 'Dostavljac'">
        <table>
            <tr>
                <td><button @click="setOrdersAwaitingDelivery()">Porudžbine koje čekaju dostavljača</button></td>
                <td><button @click="setOrdersOfDeliverer()">Porudžbine za koje ste zaduženi</button></td>
            </tr>
        </tale>
    </div>

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
            <td v-if="(loggedUser.role === 'Menadzer') && (order.status === 'Obrada')"><button @click="startPreparation(order)">Pokreni pripremu</button></td>
            <td v-if="(loggedUser.role === 'Menadzer') && (order.status === 'U_pripremi')"><button @click="orderForDeliverer(order)">Spremno za dostavljača</button></td>
            <td v-if="(loggedUser.role === 'Kupac') && (order.status === 'Obrada')"><button @click="cancelOrder(order)">Otkaži</button></td>
            <td v-if="(loggedUser.role === 'Dostavljac') && (order.status === 'Ceka_dostavljaca')"><button @click="sendDeliverRequest(order)">Pošalji zahtev</button></td>
            <td v-if="(loggedUser.role === 'Dostavljac') && (order.status === 'U_transportu')"><button @click="deliverOrder(order)">Dostavljena</button></td>
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
                axios
                .get('rest/orders/Ceka_dostavljaca')
                .then(response => {
                    // allorders ce da predstavlja sve porudzbine koje su u statusu "Ceka_dostavljaca", a u samom dostavljacu se nalaze
                    // porudzbine za koje je on zaduzen
                    this.allOrders = response.data;
                    this.ordersToShow = this.allOrders; // prvo ce se prikazivati porudzbine u statusu "Ceka_dostavljaca"
                })
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
        },
        setOrdersAwaitingDelivery : function() {
            this.ordersToShow = this.allOrders;
        },
        setOrdersOfDeliverer : function() {
            this.ordersToShow = this.loggedUser.ordersToDeliver;
        },
        startPreparation : function(order) {
            order.status = 'U_pripremi';
            let jsonOrder = JSON.stringify(order);
            axios
            .put('rest/orders/' + order.id, jsonOrder)
            .then(response => {
                alert("Uspešno izmenjen status porudžbine")
            })
            .catch(function(error) {
                alert("Neuspešna izmena statusa porudžbine")
            })
        },
        orderForDeliverer : function(order) {
            order.status = 'Ceka_dostavljaca';
            let jsonOrder = JSON.stringify(order);
            axios
            .put('rest/orders/' + order.id, jsonOrder)
            .then(response => {
                alert("Uspešno izmenjen status porudžbine")
            })
            .catch(function(error) {
                alert("Neuspešna izmena statusa porudžbine")
            })
        },
        cancelOrder : function(order) {
            this.loggedUser.pointsCollected = Number(this.loggedUser.pointsCollected) - Math.round((order.price/1000) * 133 * 4);
            var user = JSON.stringify(this.loggedUser);
            axios
			.put('rest/customers/' + this.loggedUser.id, user)
			.then(response => {
			})
			.catch(function(error){
				alert('Greška prilikom skidanja bodova')
			})
            order.status = 'Otkazana';
            let jsonOrder = JSON.stringify(order);
            axios
            .put('rest/orders/' + order.id, jsonOrder)
            .then(response => {
                alert("Uspešno otkazana porudžbina")
            })
            .catch(function(error) {
                alert("Neuspešno otkazivanje porudžbine")
            })
        },
        sendDeliverRequest : function(order) {
            let deliverRequest = {
                deliverer : this.loggedUser,
                order : order
            };
            let jsonDR = JSON.stringify(deliverRequest);
            axios
            .post('rest/deliverRequests', jsonDR)
            .then(response => {
                alert("Uspešno poslat zahtev za preuzimanje porudžbine")
            })
            .catch(function(error) {
                alert("Neuspešno slanje zahteva")
            })
        },
        deliverOrder : function(order) {
            order.status = 'Dostavljena';
            let jsonOrder = JSON.stringify(order);
            axios
            .put('rest/orders/' + order.id, jsonOrder)
            .then(response => {
                alert("Uspešno izmenjen status porudžbine u 'Dostavljena'")
            })
            .catch(function(error) {
                alert("Neuspešna izmena statusa porudžbine")
            })
        }
	},
    filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	}
   	}
});