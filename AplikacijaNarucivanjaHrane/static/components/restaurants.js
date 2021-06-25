Vue.component("restaurants", {
	data: function () {
		    return {
		    	allRestaurants : null,
				soritranje : ""
		    }
	},
	template: ` 
	<div style="margin: 10px;">
		<table>
			<tr>
				<td>Sortiraj po: </td>
				<td>
					<select v-model="sortiranje">
						<option value="nazivu">Nazivu</option>
						<option value="oceni">Oceni</option>
					</select>
				</td>
				<td><button @click="sort()">Sortiraj</button></td>
			</tr>
		</table>

		<table style="margin: 10px;">
			<tr v-for="r in allRestaurants">
				<td style="width: 2500px;">
					<div style="border-style: dotted; max-width: 50%; margin: 10px;">
						<a @click="openRestaurantPage(r)" href="#" style="font-size: large; text-decoration: none;
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
			})
		},
		openRestaurantPage : function (restaurant) {
			app.setSelectedRestaurant(restaurant);
			router.push('/restaurantPage');
		},
		sort : function () {
		}
	}
});