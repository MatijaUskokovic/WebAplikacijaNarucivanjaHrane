Vue.component("restaurantPage", {
	data: function () {
		    return {
		    	restaurant : {items: []},
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
				restaurantForChange : {},
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
					<td>Geografska sirina</td>
					<td>{{restaurant.location.latitude}}</td>
				</tr>
				<tr>
					<td>Geografska duzina</td>
					<td>{{restaurant.location.longitude}}</td>
				</tr>
				<tr>
					<td>Adresa</td>
					<td>{{restaurant.location.adress.street}} {{restaurant.location.adress.streetNum}}, {{restaurant.location.adress.city}}, {{restaurant.location.adress.postalCode}}</td>
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

		<!--IZMENA RESTORANA-->

		<div v-if="mode === 'IZMENARESTORANA'">
			<table>
				<tr>
					<td><button @click="changeModeFromRestaurantUpdate()">Prikaz proizvoda</button></td>
				</tr>
			</table>

			<form @submit="updateRestaurant">
				<table>
					<tr><td>Ime restorana</td><td><input type="text" v-model="restaurantForChange.name"></td></tr>
					<tr>
						<td>Tip restorana</td>
						<td><select v-model="restaurantForChange.type">
								<option value="Rostilj">Rostilj</option>
								<option value="Kineski">Kineski</option>
								<option value="Italijanski">Italijanski</option>
								<option value="Meksicki">Meksicki</option>
							</select>
						</td>
					</tr>
					<tr>
					<td>Status restorana</td>
					<td><select v-model="restaurantForChange.status">
							<option value="Radi">Radi</option>
							<option value="Ne_radi">Ne radi</option>
						</select>
					</td>
					</tr>
					<tr><td>Geografska sirina</td><td><input type="number" v-model="restaurantForChange.location.longitude"></td></tr>
					<tr><td>Geografska duzina</td><td><input type="number" v-model="restaurantForChange.location.latitude"></td></tr>
					<tr><td>Adresa</td><td><input type="text" v-model="restaurantForChange.location.adress"></td></tr>
					<tr><td><input type="submit" value="Ažuriraj podatke"></td></tr>
				</table>
			</form>
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
		},
		getSelectedRestaurant : function() {
			axios
			.get('rest/selectedRestaurant')
			.then(res => {
				this.restaurant = res.data;
				this.getCommentsOfRestaurant();
			})
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
		} ,
		changeModeFromRestaurantUpdate : function(){
			if(this.mode === "PRETRAGA"){
				this.mode = "IZMENARESTORANA";
			}else{
				this.mode = "PRETRAGA";
			}
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
		updateRestaurant : function(event){
			event.preventDefault();

			var changedRestaurant = JSON.stringify(this.restaurantForChange);
			//validacija restorana
			if(this.validateRestaurant()){
				axios
				.put('rest/restaurants', changedRestaurant)
				.then(response => {
					this.restaurant = response.data;
					alert('Uspešno ažurirani podaci');
				})
				.catch(function(error){
					alert('Neuspešno ažuriranje podataka');
				})
			}else{
				alert("Molimo vas da obrišete sve zapete.")
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
			this.restaurantForChange = {
				"id": this.restaurant.id,
				"deleted": this.restaurant.deleted,
				"name": this.restaurant.name,
				"type": this.restaurant.type,
				"status": this.restaurant.status,
				"location": this.restaurant.location
			}
			this.changeModeFromRestaurantUpdate();
		},
		addCountAttributeForItems : function() {
			for (item of this.restaurant.items){
				item.count = 1;
			}
		},
		validateRestaurant : function(){
			let reg = /[,]+/;

			let isValid = true;

			if(this.restaurantForChange.location.adress.match(reg)){
				isValid = false;
				return;
				//css
			}
			else{
				//css
				isValid = true;
			}

			if(this.restaurantForChange.name.match(reg)){
				//css
				isValid = false;
				return;
			}
			else{
				//css
				isValid =  true;
			}

			return isValid;
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
				alert(this.newItem.image)
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