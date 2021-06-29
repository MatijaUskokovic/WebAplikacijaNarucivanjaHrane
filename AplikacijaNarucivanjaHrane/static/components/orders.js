function compareStrings(a, b){
    let x = a.toLowerCase();
    let y = b.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
}

Vue.component("orders", {
	data: function () {
		    return {
			  loggedUser: {},
              allOrders: {},
              ordersToShow: {},
              sortMode: '',
              sortParameter: '',
              restaurantName: '',
              fromThePrice: '',
              toThePrice: '',
              fromTheDate: '',
              toTheDate: '',
              restaurantType: '',
              orderStatus: ''
		    }
	},
	template: ` 
<div>

    <form @submit='search'>
        <table bgcolor="lightblue">
            <tr>
                <th></th>
                <th></th>
                <th>Pretraga</th>
            </tr>
            <tr>
                <td><input v-if="(loggedUser.role != 'Menadzer')" type="text" placeholder="Naziv restorana" v-model="restaurantName"></td>
                <td><input type="number" placeholder="Od cene" v-model="fromThePrice"></td>
                <td><input type="number" placeholder="Do cene" v-model="toThePrice"></td>
                <td><input type="date" placeholder="Od datuma" v-model="fromTheDate"></td>
                <td><input type="date" placeholder="Do datuma" v-model="toTheDate"></td>
                <td><input type="submit" value="Pretraži"></td>
            </tr>
        </table>
    </form>

    <form @submit='filter'>
        <table bgcolor="lightgray">
            <tr>
                <th></th>
                <th></th>
                <th>Filtriranje</th>
            </tr>
            <tr>
                <td><input v-if="(loggedUser.role != 'Menadzer')" type="text" placeholder="Tip restorana" v-model="restaurantType"></td>
                <td>
                    <select v-model="orderStatus">
                        <option value="">Status porudzbine</option>
                        <option value="Obrada">Obrada</option>
                        <option value="U_pripremi">U pripremi</option>
                        <option value="Ceka_dostavljaca">Ceka dostavljaca</option>
                        <option value="U_transportu">U transportu</option>
	                    <option value="Dostavljena">Dostavljena</option>
                        <option value="Otkazana">Otkazana</option>	
                    </select>
                </td>
                <td><input type="submit" value="Filtriraj"></td>
            </tr>
        </table>
    </form>

    <form>
        <table bgcolor="lightgreen">
            <tr>
                <th></th>
                <th></th>
                <th>Sortiranje</th>
            </tr>
            <tr>
                <td>
                    <select v-model="sortMode" @change="sort">
                        <option value="rastuce">Rastuće</option>
                        <option value="opadajuce">Opadajuće</option>
                    </select>
                </td>
                <td>...............</td>
                <td>
                    Kriterijum sortiranja:
                </td>
                <td>
                    <select v-model="sortParameter" @change="sort">
                        <option v-if="(loggedUser.role != 'Menadzer')" value="restaurantName">Ime restorana</option>
                        <option value="price">Cena</option>
                        <option value="date">Datum</option>
                    </select>
                </td>
            </tr>
        </table>
    </form>

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
        },
        sort : function(){
            if (this.sortMode == 'rastuce'){
                if (this.sortParameter == 'restaurantName'){
                    this.ordersToShow.sort((a, b) => compareStrings(a.restaurantOfOrder.name, b.restaurantOfOrder.name));
                }else if (this.sortParameter == 'price'){
                    this.ordersToShow.sort((a, b) => a.price - b.price);
                }else if (this.sortParameter == 'date'){
                    this.ordersToShow.sort((a,b) => new Date(a.dateOfOrder) - new Date(b.dateOfOrder));
                }
            }
            else if (this.sortMode == 'opadajuce'){
                if (this.sortParameter == 'restaurantName'){
                    this.ordersToShow.sort((a, b) => compareStrings(b.restaurantOfOrder.name, a.restaurantOfOrder.name));
                }else if (this.sortParameter == 'price'){
                    this.ordersToShow.sort((a, b) => b.price - a.price);
                }else if (this.sortParameter == 'date'){
                    this.ordersToShow.sort((a,b) => new Date(b.dateOfOrder) - new Date(a.dateOfOrder));
                }
            }
        },
        search : function(event){
            event.preventDefault();
            let filteredOrders = [];
            for (order of this.allOrders){
                if ((order.restaurantOfOrder.name.toLowerCase().includes(this.restaurantName.toLowerCase())) &&
                    (order.price >= this.fromThePrice || this.fromThePrice === '') && 
                    (order.price <= this.toThePrice || this.toThePrice === '') &&
                    (new Date(order.dateOfOrder) >= new Date(this.fromTheDate) || !this.fromTheDate) &&
                    (new Date(order.dateOfOrder) <= new Date(this.toTheDate) || !this.toTheDate)
                ){
                    filteredOrders.push(order);
                }
            }

            this.ordersToShow = filteredOrders;
            
        },
        filter : function(event){
            event.preventDefault();

            let filteredOrders = [];
            for (order of this.allOrders){
                if ((order.restaurantOfOrder.type.toLowerCase() === this.restaurantType.toLowerCase() ||
                        this.restaurantType === '') &&
                    (order.status === this.orderStatus || this.orderStatus === '') 
                ){
                    filteredOrders.push(order);
                }
            }

            this.ordersToShow = filteredOrders;
        }
	},
    filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	}
   	}
});