Vue.component("restaurants", {
	data: function () {
		    return {
		    	allRestaurants : {},
				restaurantsToShow: {},
				name : '',
				type : '',
				adress: '',
				avgGrade: '',
				restaurantStatus: '',
				sortMode: '',
				sortParameter: ''
		    }
	},
	template: ` 
	<div style="margin: 10px;">
		<form @submit='search'>
			<table bgcolor="lightblue">
				<tr>
					<th></th>
					<th></th>
					<th>Pretraga</th>
				</tr>
				<tr>
					<td><input type="text" placeholder="Naziv" v-model="name"></td>
					<td>
						<select v-model="type">
							<option value="">Tip</option>
							<option value="Italijanski">Italijanski</option>
							<option value="Kineski">Kineski</option>
							<option value="Rostilj">Roštilj</option>
							<option value="Meksicki">Meksički</option>
						</select>
					</td>
					<td><input type="text" placeholder="Lokacija(grad ili država)" v-model="adress"></td>
					<td>
						<select v-model="avgGrade">
							<option value="">Prosečna ocena</option>
							<option value="1">0-1</option>
							<option value="2">1-2</option>
							<option value="3">2-3</option>
							<option value="4">3-4</option>
							<option value="5">4-5</option>
						</select>
					</td>
					<td>
						<select v-model="restaurantStatus">
							<option value="">Status</option>
							<option value="Radi">Radi</option>
							<option value="Ne_radi">Ne radi</option>
						</select>
					</td>
					
					<td><input type="submit" value="Pretraži"></td>
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
							<option value="name">Naziv</option>
							<option value="adress">Lokacija</option>
							<option value="avgGrade">Prosečna ocena</option>
						</select>
					</td>
				</tr>
			</table>
		</form>

		<table style="margin: 10px;">
			<tr v-for="r in restaurantsToShow">
				<td style="width: 2500px;">
					<div style="border-style: dotted; max-width: 50%; margin: 10px;">
						<a @click="openRestaurantPage(r)" style="font-size: large; text-decoration: none;
						 color: black;">
							<table>
								<tr>
									<td style="width: 200px;">
										<p> Ovde ide slika </p>
									</td>
										<td>
										<table>
											<tr>
												<td>Ime restorana:</td>
												<td>{{r.name}}</td>
											</tr>
											<tr>
												<td>Adresa:</td>
												<td>{{r.location.adress}}</td>
											</tr>
											<tr>
												<td>Prosecna ocena:</td>
												<td>{{r.avgGrade}}</td>
											</tr>
											<tr>
												<td>Tip:</td>
												<td>{{r.type}}</td>
											</tr>
											<tr>
												<td>Status:</td>
												<td>{{r.status}}</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</a>
					</div>
				</td>
			</tr>
		</table>
	</div>
`
	, 
	mounted () {
		this.getAllRestaurants();
    },
	methods:{
		getAllRestaurants : function() {
			axios
			.get('rest/restaurants')
			.then(res => {
				this.allRestaurants = res.data;
				this.restaurantsToShow = res.data;
			})
		},
		openRestaurantPage : function (restaurant) {
			app.setSelectedRestaurant(restaurant);
			router.push('/restaurantPage');
		},
        search : function(event){
            event.preventDefault();
            let filteredRestaurants = [];
            for (restaurant of this.allRestaurants){
				if (restaurant.name.toLowerCase().includes(this.name.toLowerCase()) &&
					(restaurant.type == this.type || this.type == '') &&
					restaurant.location.adress.toLowerCase().includes(this.adress.toLowerCase()) &&
					(restaurant.status == this.restaurantStatus || this.restaurantStatus == '') &&
					(((this.avgGrade - 1) <= restaurant.avgGrade && this.avgGrade >= restaurant.avgGrade) || this.avgGrade == '')){
						filteredRestaurants.push(restaurant);
					}
            }
            this.restaurantsToShow = filteredRestaurants;
        },
        sort : function(){
            if (this.sortMode == 'rastuce'){
                if (this.sortParameter == 'name'){
                    this.restaurantsToShow.sort((a, b) => compareStrings(a.name, b.name));
                }else if (this.sortParameter == 'adress'){
                    this.restaurantsToShow.sort((a, b) => compareStrings(a.location.adress, b.location.adress));
                }else if (this.sortParameter == 'avgGrade'){
                    this.restaurantsToShow.sort((a, b) => a.avgGrade - b.avgGrade);
                }
            }
            if (this.sortMode == 'opadajuce'){
                if (this.sortParameter == 'name'){
                    this.restaurantsToShow.sort((a, b) => compareStrings(b.name, a.name));
                }else if (this.sortParameter == 'adress'){
                    this.restaurantsToShow.sort((a, b) => compareStrings(b.location.adress, a.location.adress));
                }else if (this.sortParameter == 'avgGrade'){
                    this.restaurantsToShow.sort((a, b) => b.avgGrade - a.avgGrade);
                }
            }
        }
	}
});