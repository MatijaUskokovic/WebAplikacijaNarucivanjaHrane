Vue.component("restaurantPage", {
	data: function () {
		    return {
		    	restaurant : {items: [], location: {adress: {}}},
				map: {},
				loggedUser : {},
				mode : 'PRETRAGA',
				itemForChange : {},
				newItem : {
					"name": "",
					"price": "",
					"type": "",
					"restaurant": {},
					"quantity": "",
					"description": "",
					"image": ''
				},
				restaurantComments: []
		    }
	},
	template: `
	
	<div style="margin: 10px;">
		<div v-if="mode === 'PRETRAGA'">
			<table>
				<tr>
					<td v-if="loggedUser.role === 'Menadzer' && loggedUser.restaurant.id === restaurant.id"><button @click="changeRestaurant()">Uredi restoran</button></td>
					<td v-if="loggedUser.role === 'Menadzer' && loggedUser.restaurant.id === restaurant.id"><button @click="changeModeFromAddItem()">Dodaj proizvod</button></td>
				</tr>
			</table>
	
			<!--PRIKAZ INFORMACIJA O RESTORANU-->
			<table>
				<tr>
					<td colspan="2"><img :src="restaurant.logo" width="200" height="120"></td>
				</tr>
				<tr>
					<td>Ime restorana</td>
					<td>{{restaurant.name}}</td>
				</tr>
				<tr>
					<td>Tip restorana</td>
					<td>{{restaurant.type}}</td>
				</tr>
				<tr>
					<td>Status restorana</td>
					<td>{{restaurant.status}}</td>
				</tr>
				<tr>
					<td>Adresa</td>
					<td>{{restaurant.location.adress.street}} {{restaurant.location.adress.streetNum}}, {{restaurant.location.adress.city}}, {{restaurant.location.adress.postalCode}}</td>
				</tr>
				<tr>
					<td>Lokacija</td>
					<td><div id="map" class="map"></div></td>
				</tr>
			</table>

			<!--PRIKAZ ARTIKALA U RESTORANU-->

			<div>
				<h3>Artikli restorana</h3>
				<div>
					<table border="1px">
						<th>Slika</th><th>Naziv proizvoda</th><th>Cena</th><th>Tip</th><th>Količina</th><th>Opis</th>
						<tr v-for="item in restaurant.items">
							<td><img :src="item.image" width="100" height="100"></td>
							<td>{{item.name}}</td>
							<td>{{item.price}}</td>
							<td>{{item.type}}</td>
							<td>{{item.quantity}}</td>
							<td>{{item.description}}</td>
							<td v-if="loggedUser.role === 'Kupac'"><input type="number" min="1"v-model="item.count" v-bind:disabled="restaurant.status != 'Radi'"></td>
							<td v-if="loggedUser.role === 'Kupac'"><button @click="addItemInCart(item)" v-bind:disabled="restaurant.status != 'Radi'">Dodaj u korpu</button></td>
							<td v-if="loggedUser.role === 'Menadzer' && loggedUser.restaurant.id === restaurant.id"><button @click="changeItem(item)">Izmeni proizvod</button></td>
							<td v-if="loggedUser.role === 'Menadzer' && loggedUser.restaurant.id === restaurant.id"><button @click="deleteItem(item)">Obriši proizvod</button></td>
						</tr>
					</table>
				</div>
			</div>

			<!--PRIKAZ KOMENTARA RESTORANA-->
			<h3>Komentari restorana</h3>
			<table border="1" v-if="restaurantComments.length != 0">
				<tr>
					<th>Ime korisnika</th>
					<th>Korisničko ime</th>
					<th>Ocena</th>
					<th>Komentar</th>
					<th v-if="(loggedUser.role == 'Menadzer' && loggedUser.restaurant.id == restaurant.id) || loggedUser.role == 'Administrator'">Odobren</th>
				</tr>
				<tr v-for="comment in restaurantComments">
					<td>{{comment.customerOfComment.name}}</td>
					<td>{{comment.customerOfComment.username}}</td>
					<td>{{comment.grade}}</td>
					<td>{{comment.text}}</td>
					<td v-if="(loggedUser.role == 'Menadzer' && loggedUser.restaurant.id == restaurant.id) || loggedUser.role == 'Administrator'">{{comment.approved | approvedFilter}}</td>
        		</tr>
			</table>
			<p v-if="restaurantComments.length == 0"><b>Trenutno ne postoji ni jedan komentar</b></p>
		</div>

		<!--DODAVANJE PROIZVODA-->

		<div v-if="mode === 'DODAVANJEPROIZVODA'">
			<table>
				<tr>
					<td><button @click="changeModeFromAddItem()">Prikaz proizvoda</button></td>
				</tr>
			</table>

			<form @submit="addItem">
				<table>
					<tr><td>Ime proizvoda</td><td><input type="text" v-model="newItem.name"></td></tr>
					<tr><td>Cena proizvoda</td><td><input type="number" v-model="newItem.price"></td></tr>
					<tr><td>Količina proizvoda</td><td><input type="number" v-model="newItem.quantity"></td></tr>
					<tr><td>Opis proizvoda</td><td><input type="text" v-model="newItem.description"></td></tr>
					<tr>
					<td>Tip proizvoda</td>
						<td>
							<select v-model="newItem.type">
								<option value="jelo">Jelo</option>
								<option value="pice">Pice</option>
							</select>
						</td>
					</tr>
					
					<tr><td>Slika</td><td><input type="file" @change="handleFileUpload" accept="image/*"></td></tr>
					
					<tr><td><input type="submit" value="Kreiraj proizvod"></td></tr>
				</table>
			</form>
		</div>

		<!--IZMENA PROIZVODA-->

		<div v-if="mode === 'IZMENAPROIZVODA'">
			<table>
				<tr>
					<td><button @click="changeModeFromAddItem()">Prikaz proizvoda</button></td>
				</tr>
			</table>

			<form @submit="updateItem">
				<table>
					<tr><td>Ime proizvoda</td><td><input type="text" v-model="itemForChange.name"></td></tr>
					<tr><td>Cena proizvoda</td><td><input type="number" v-model="itemForChange.price"></td></tr>
					<tr><td>Količina proizvoda</td><td><input type="number" v-model="itemForChange.quantity"></td></tr>
					<tr><td>Opis proizvoda</td><td><input type="text" v-model="itemForChange.description"></td></tr>
					<tr>
					<td>Tip proizvoda</td>
						<td>
							<select v-model="itemForChange.type">
								<option value="jelo">Jelo</option>
								<option value="pice">Pice</option>
							</select>
						</td>
					</tr>
					<tr><td><input type="submit" value="Izmeni proizvod"></td></tr>
				</table>
			</form>
		</div>
	</div>
`
	, 
	mounted () {
		this.getSelectedRestaurant();
		this.addCountAttributeForItems();	// dodavanje polja za broj artikala u listi artikala restorana
		this.getLoggedUser();
    },
	methods:{
		getLoggedUser : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				this.loggedUser = response.data;
			})
			.catch()
		},
		getSelectedRestaurant : function() {
			if (app == null){
				router.push('/');
			}
			else {
				axios
				.get('rest/restaurants/' + app.selectedRestaurant.id)
				.then (response => {
					this.restaurant = response.data;
					this.showMap();
					this.getCommentsOfRestaurant();
				})
			}

		},
		showMap : function() {
				const features = [];
				features.push(new ol.Feature({
					geometry: new ol.geom.Point(ol.proj.fromLonLat([this.restaurant.location.longitude, this.restaurant.location.latitude]))
				  }))
				const vectorSource = new ol.source.Vector({
					features
				  });
				const vectorLayer = new ol.layer.Vector({
					source: vectorSource,
					style: new ol.style.Style({
					  image: new ol.style.Circle({
						radius: 4,
						fill: new ol.style.Fill({color: 'red'})
					  })
					})
				  });

				this.map = new ol.Map({
					target: 'map',
					layers: [
					  new ol.layer.Tile({
						source: new ol.source.OSM()
					  }),
					  vectorLayer
					],
					view: new ol.View({
					  center: ol.proj.fromLonLat([this.restaurant.location.longitude, this.restaurant.location.latitude]),
					  zoom: 15
					})
				});
		},
		getCommentsOfRestaurant : function() {
			axios
			.get('rest/commentsOfRestaurant/' + this.restaurant.id)
			.then(res => {
				this.restaurantComments = [];
				if (this.loggedUser.role == 'Administrator' || (this.loggedUser.role == 'Menadzer' && this.loggedUser.restaurant.id == this.restaurant.id)){
					for (let comment of res.data){
						if (comment.processed) {
							this.restaurantComments.push(comment);
						}
					}
				} else {
					for (let comment of res.data){
						if (comment.processed && comment.approved){
							this.restaurantComments.push(comment);
						}
					}
				}
			})
		},
		changeModeFromItemUpdate : function(){
			if(this.mode === "PRETRAGA"){
				this.mode = "IZMENAPROIZVODA";
			}else{
				this.mode = "PRETRAGA";
			}
		},
		changeModeFromAddItem : function(){
			if(this.mode === "PRETRAGA"){
				this.mode = "DODAVANJEPROIZVODA";
			}else{
				//DOBAVLJANJE NAJNOVIJIH PODATAKA ZA SELEKTOVANI RESTORAN
				//this.getSelectedRestaurant();
				this.mode = "PRETRAGA";
			}
		},
		changeItem : function(item){
			this.itemForChange = 
			{
				"id": item.id,
				"deleted": item.deleted,
				"name": item.name,
				"price": item.price,
				"type": item.type,
				"restaurant": item.restaurant,
				"quantity": item.quantity,
				"description": item.description
			}
			this.changeModeFromItemUpdate();
		},
		addItem : function(event){
			event.preventDefault();

			this.newItem.restaurant = this.restaurant;

			var addedItem = JSON.stringify(this.newItem);
			// validacija itema
			if(this.validateItem(this.newItem)){
				axios.post('rest/items',addedItem)
				.then(res => {
					this.restaurant = res.data;

					this.newItem.name = "";
					this.newItem.price = 0;
					this.newItem.type = "";
					this.newItem.quantity = 0;
					this.newItem.description = "";

					alert("Proizvod uspešno kreiran");
				})
				.catch(err => {
					alert("Greska prilikom kreiranja proizvoda");
				})
			}else{
				alert("Molimo vas da obrišete sve zapete.");
			}
		},
		updateItem : function(event){
			event.preventDefault();
			
			var item = JSON.stringify(this.itemForChange);
			//validacija itema
			if(this.validateItem(this.itemForChange)){
				axios.put('rest/items',item)
				.then(res => {
					this.restaurant = res.data;
					alert("Proizvod je uspesno izmenjen");
				})
				.catch(err => {
					alert("Došlo je do greške prilikom izmene proizvoda"); 
				})
			}else{
				alert("Molimo vas da obrišete sve zapete.")
			}
		},
		deleteItem : function(item) {
			axios.delete('rest/items/' + item.id)
			.then(res => {
				this.restaurant = res.data;
			})
			.catch(err => {
			})
		},
		changeRestaurant : function(){
			router.push('/changeRestaurant')
		},
		addCountAttributeForItems : function() {
			for (item of this.restaurant.items){
				item.count = 1;
			}
		},
		
		validateItem : function (item){
			let reg = /[,]+/;
			let isValid = true;
			// dodati u klasi item da prazan konstruktor postavlja kolicinu i opis
			if(item.name.match(reg)){
				isValid = false;
				return;
			}else{
				isValid = true;
			}

			if(item.description.match(reg)){
				isValid = false;
				return;
			}else{
				isValid = true;
			}

			return isValid;
		},
		// DODAVANJE PROIZVODA U KORPU
		addItemInCart : function(item){
			// provera da li je novi proizvod iz restorana iz kog su ostali proizvodi
			let firstScItem = this.loggedUser.shoppingCart.items[0];
			if (firstScItem != null && (firstScItem.item.restaurant.id != item.restaurant.id)) {
				if (confirm("Dodajete proizvod iz drugog restorana, ako nastavite poništiće Vam se korpa. Nastaviti?")) {
					this.loggedUser.shoppingCart.items = [];
				} else {
					return;
				}
			}
			
			let count = item.count;
			delete item.count;

			if (isNaN(count) || count == ''){
				alert('Pogrešno uneta količina proizvoda');
				return;
			}
			let contain = false;
			for (scitem of this.loggedUser.shoppingCart.items){
				if (scitem.item.name == item.name){
					scitem.count = Number(scitem.count) + Number(count);
					contain = true;
				}
			}
			if (!contain){
				this.loggedUser.shoppingCart.items.push({item: item, count: count});
			}
			this.loggedUser.shoppingCart.customerId = this.loggedUser.id;
			axios
			.post('rest/shoppingCarts', this.loggedUser.shoppingCart)
			.then(response => {
				alert('Uspešno dodat artikal')
				item.count = count;
			})
			.catch(function(error){
				alert('Neuspešno dodat artikal')
			})
		}, 
		handleFileUpload : function(event){
			var file = event.target.files[0];
			var reader = new FileReader();

			reader.readAsDataURL(file);

			reader.onload = () => {
				//alert('RESULT: ' + reader.result)
				this.newItem.image = reader.result
				//alert(this.newItem.image)
			}
			reader.onerror = function (error) {
				console.log('Error: ', error)
			}
		}
	},
    filters: {
    	approvedFilter: function (value) {
    		if (value){
				return 'da';
			}
    		return 'ne';
    	}
   	}
});