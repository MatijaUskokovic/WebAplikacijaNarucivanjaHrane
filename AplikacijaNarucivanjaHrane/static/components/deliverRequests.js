Vue.component("deliverRequests", {
	data: function () {
		    return {
			  loggedUser: {restaurant: {}},
              deliverRequests: {}
		    }
	},
	template: ` 
<div class="mainDivOrderRequests">
    <h2>Zahtevi za preuzimanje porudžbine</h2>
    <p v-if="loggedUser.restaurant.id == '-1'">Trenutno niste zaduženi ni za jedan restoran</p>
    <p v-if="deliverRequests.length == 0">Trenutno ne postoji ni jedan zahtev za preuzimanje porudžbine</p>
    <div v-if="loggedUser.restaurant.id != '-1' && deliverRequests.length != 0">
        <table class="tableWithOrderRequests">
            <tr bgcolor="whitesmoke">
                <th>Ime dostavljača</th>
                <th>Šifra porudžbine</th>
                <th>Ukupno (din)</th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
            <tr v-for="request in deliverRequests">
                <td>{{request.deliverer.name}}</td>
                <td>{{request.order.id}}</td>
                <td>{{request.order.price}}</td>
                <td><button @click="showOrder(request.order)">Prikaži</button></td>
                <td><button @click="approveRequest(request)">Odobri zahtev</button></td>
                <td><button @click="rejectRequest(request)">Odbij zahtev</button></td>
            </tr>
        </table>
    </div>
</div>
`
	, 
	mounted () {
		this.getLoggedUserAndRequests();
    },
	methods: {
        getLoggedUserAndRequests : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				this.loggedUser = response.data;
                this.getAppropriateRequests();
			})
            .catch(function(error){
                router.push('/');
            })
		},
        getAppropriateRequests : function() {
            axios
            .get('rest/deliverRequests/' + this.loggedUser.restaurant.id)
            .then(response => {
                this.deliverRequests = response.data;
            })
        },
        approveRequest : function(request) {
            let index = this.deliverRequests.indexOf(request);
            request.order.status = 'U_transportu';
            let jsonOrder = JSON.stringify(request.order);
            axios
            .put('rest/orders/' + request.order.id, jsonOrder)
            .then(response => {
                if (index > -1) {
                    this.deliverRequests.splice(index, 1);
                }
                this.changeDeliverer(request);
                this.changeRequest(request);
                alert("Uspešno prihvaćen zahtev")
            })
            .catch(function(error) {
                alert("Neuspešno prihvatanje zahteva")
            })
        },
        changeDeliverer : function(request) {
            request.deliverer.ordersToDeliver.push(request.order);
            let user = JSON.stringify(request.deliverer);
            axios
			.put('rest/deliverers/' + request.deliverer.id, user)
			.then(response => {
			})
			.catch(function(error){
			})
        },
        changeRequest : function(request) {
            request.deleted = true;
            let jsonRequest = JSON.stringify(request);
            axios
            .put('rest/deliverRequests/' + request.id, jsonRequest)
            .then(response => {
			})
			.catch(function(error){
			})
        },
        rejectRequest : function(request) {
            let index = this.deliverRequests.indexOf(request);
            request.deleted = true;
            request.rejected = true;
            let jsonRequest = JSON.stringify(request);
            axios
            .put('rest/deliverRequests/' + request.id, jsonRequest)
            .then(response => {
                if (index > -1) {
                    this.deliverRequests.splice(index, 1);
                }
				alert('Uspešno odbijen zahtev')
			})
			.catch(function(error){
				alert('Neuspešno odbijanje zahteva')
			})
        },
        showOrder : function(order) {
            app.selectedOrder = order;
            router.push('/orderView');
        }
	}
});