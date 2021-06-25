Vue.component("restaurantPage", {
	data: function () {
		    return {
		    	restaurant : {},
				loggedUser : {},
				mode : 'PRETRAGA',
				itemForChange : {},
				newItem : {
					"name": "",
					"price": "",
					"type": "",
					"restaurant": {},
					"quantity": "",
					"description": ""
				}
		    }
	},
	template: `
	<div style="margin: 10px;">
		<div v-if="mode === 'PRETRAGA'">
			<table >
				<tr>
					<td v-if="loggedUser.role === 'Menadzer'"><button @click="changeModeFromRestaurantUpdate()">Uredi restoran</button></td>
					<td v-if="loggedUser.role === 'Menadzer'"><button @click="changeModeFromAddItem()">Dodaj proizvod</button></td>
				</tr>
			</table>

			<!--PRIKAZ ARTIKALA U RESTORANU-->

			<div>
				<div style="max-width: 50%; margin: 10px;">
					<table border="1px">
						<th>Naziv proizvoda</th><th>Cena</th><th>Tip</th><th>Količina</th><th>Opis</th>
						<tr v-for="item in restaurant.items">
							<td>{{item.name}}</td>
							<td>{{item.price}}</td>
							<td>{{item.type}}</td>
							<td>{{item.quantity}}</td>
							<td>{{item.description}}</td>
							<td v-if="loggedUser.role === 'Kupac'"><button @click="addItemInCart(item)">Dodaj u korpu</button></td>
							<td v-if="loggedUser.role === 'Menadzer'"><button @click="changeItem(item)">Izmeni proizvod</button></td>
							<td v-if="loggedUser.role === 'Menadzer'"><button @click="deleteItem(item)">Obriši proizvod</button></td>
						</tr>
					</table>
				</div>
			</div>
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
					<tr><td>Ime restorana</td><td><input type="text" v-model="restaurant.name"></td></tr>
					<tr>
						<td>Tip restorana</td>
						<td><select v-model="restaurant.type">
								<option value="Rostilj">Rostilj</option>
								<option value="Kineski">Kineski</option>
								<option value="Italijanski">Italijanski</option>
								<option value="Meksicki">Meksicki</option>
							</select>
						</td>
					</tr>
					<tr>
					<td>Status restorana</td>
					<td><select v-model="restaurant.status">
							<option value="Radi">Radi</option>
							<option value="Ne_radi">Ne radi</option>
						</select>
					</td>
					</tr>
					<tr><td>Geografska sirina</td><td><input type="number" v-model="restaurant.location.longitude"></td></tr>
					<tr><td>Geografska duzina</td><td><input type="number" v-model="restaurant.location.latitude"></td></tr>
					<tr><td>Adresa</td><td><input type="text" v-model="restaurant.location.adress"></td></tr>
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
					<td>Status restorana</td>
						<td>
							<select v-model="newItem.type">
								<option value="jelo">Jelo</option>
								<option value="pice">Pice</option>
							</select>
						</td>
					</tr>
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
					<td>Status restorana</td>
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
		this.restaurant = app.selectedRestaurant;
		this.loggedUser = app.loggedUser;
    },
	methods:{
		getSelectedRestaurant : function() {
			axios
			.get('rest/restaurants/' + app.selectedRestaurant.id)
			.then(res => {
				app.setSelectedRestaurant(res.data);
			})
		}, 
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
				this.getSelectedRestaurant();
				this.mode = "PRETRAGA";
			}
		},
		updateRestaurant : function(event){
			event.preventDefault();

			var restaurantForChange = JSON.stringify(this.restaurant);
			axios
			.put('rest/restaurants', restaurantForChange)
			.then(response => {
                this.restaurant = response.data;
				alert('Uspešno ažurirani podaci');
			})
			.catch(function(error){
				alert('Neuspešno ažuriranje podataka');
			})

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
		}, 
		updateItem : function(event){
			event.preventDefault();
			
			var item = JSON.stringify(this.itemForChange);

			axios.put('rest/items',item)
			.then(res => {
				this.restaurant = res.data;
				alert("Proizvod je uspesno izmenjen");
			})
			.catch(err => {
				alert("Došlo je do greške prilikom izmene proizvoda"); 
			})
		},
		deleteItem : function(item) {
			axios.delete('rest/items/' + item.id)
			.then(res => {
				this.restaurant = res.data;
			})
			.catch(err => {
			})
		}
	}
});