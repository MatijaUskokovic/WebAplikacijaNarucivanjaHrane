Vue.component("changeRestaurant", {
	data: function () {
		    return {
                restaurantForChange: {location: {adress: {}}},
                loggedUser: {},
                map: {},
                newImageForRestaurant: ''
		    }
	},
	template: ` 
<div class="column-container">

    <div class="column1">
    </div>
    <div class="columnSpace">
	</div>

    <div class="column2" v-if="restaurantForChange">
        <button @click="switchToRestaurantPage()">Prikaz restorana</button>
        <form @submit="updateRestaurant">
            <table border="1">
                <tr>
                    <td colspan="2"><b>Naziv</b></td>
                    <td><input type="text" v-model="restaurantForChange.name"></td>
                </tr>
                <tr>
                    <td colspan="2"><b>Tip</b></td>
                    <td><select v-model="restaurantForChange.type">
                            <option value="Italijanski">Italijanski</option>
                            <option value="Kineski">Kineski</option>
                            <option value="Rostilj">Roštilj</option>
                            <option value="Meksicki">Meksički</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><b>Status</b></td>
                    <td><select v-model="restaurantForChange.status">
                            <option value="Radi">Radi</option>
                            <option value="Ne_radi">Ne radi</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><b>Lokacija</b></td>
                    <td><div id="map" class="map" @click="refreshLocation"></div></td>
                </tr>
                <tr>
                    <td colspan="2"><b>Koordinate (možete odabrati novu na mapi)</b></td>
                    <td>{{restaurantForChange.location.longitude}}, {{restaurantForChange.location.latitude}}</td>
                </tr>
                <tr>
                    <td><b>Grad</b></td>
                    <td><input type="text" placeholder="Grad" v-model="restaurantForChange.location.adress.city"/></td>
                    <td><input type="text" placeholder="Poštanski broj" v-model="restaurantForChange.location.adress.postalCode"/></td>
                </tr>
                <tr>
                    <td><b>Adresa</b></td>
                    <td><input type="text" placeholder="Ulica" v-model="restaurantForChange.location.adress.street" /></td>
                    <td><input type="text" placeholder="Broj" id="streetNum" v-model="restaurantForChange.location.adress.streetNum"/></td>  
                </tr>

                <tr>
                    <td colspan="2"><b>Logo</b></td>
                    <td><input type="file" @change="handleFileUpload" accept="image/*"></td>
                </tr>

                <tr>
                    <td colspan="3"><input type="submit" value="Ažuriraj podatke"></td>
                </tr>
            </table>
        </form>
    </div>

    <div class="column3">
    </div>
</div>
`
	, 
	mounted () {
		this.getRestaurantAndLoggedUser();
    },
	methods: {
		updateRestaurant : function(event){
			event.preventDefault();

            if (!this.isValidToCreateRestaurant()){
				alert('Nisu popunjena sva neophodna polja ili ste koristili pogrešne karaktere(",")');
				return;
			}

            if (isNaN(this.restaurantForChange.location.adress.postalCode)){
                alert('Poštanski broj se mora sasatojati samo od cifara');
                return;
            }

            if(this.newImageForRestaurant != ''){
                this.restaurantForChange.logo = this.newImageForRestaurant;
                this.newImageForRestaurant = '';
            }

			var changedRestaurant = JSON.stringify(this.restaurantForChange);
			axios
			.put('rest/restaurants', changedRestaurant)
			.then(response => {
				this.restaurant = response.data;
				alert('Uspešno ažurirani podaci');
                router.push('/restaurantPage');
			})
			.catch(function(error){
				alert('Neuspešno ažuriranje podataka');
			})
		},
        isValidToCreateRestaurant : function() {
            let reg = /[,]+/;

			if (this.restaurantForChange.name == '' || this.restaurantForChange.name.match(reg)) {
				return false;
			}
			if (this.restaurantForChange.type == '') {
				return false;
			}
			if (this.restaurantForChange.location.adress.street == '' || this.restaurantForChange.location.adress.street.match(reg)) {
				return false;
			}
			if (this.restaurantForChange.location.adress.streetNum == '' || this.restaurantForChange.location.adress.streetNum.match(reg)) {
				return false;
			}
			if (this.restaurantForChange.location.adress.city == '' || this.restaurantForChange.location.adress.city.match(reg)) {
				return false;
			}
			if (this.restaurantForChange.location.adress.postalCode == '') {
				return false;
			}

			return true;
        },
        getRestaurantAndLoggedUser : function() {
            if (app == null){
				router.push('/');
			}
            else {
                axios
                .get('rest/restaurants/' + app.selectedRestaurant.id)
                .then(response => {
                    this.restaurantForChange = response.data;
                    this.getLoggedUser();
                    this.showMap();
                })
                .catch(function(error){
                    router.push('/');
                })
            }
		},
        getLoggedUser : function() {
            axios
			.get('rest/getLoggedUser')
			.then(response => {
				this.loggedUser = response.data;
                if (this.loggedUser.role != 'Menadzer' || this.loggedUser.restaurant.id != this.restaurantForChange.id){
                    router.push('/');
                }
			})
            .catch(function(error){
                router.push('/');
            })
        },
        showMap : function() {
            const features = [];
				features.push(new ol.Feature({
					geometry: new ol.geom.Point(ol.proj.fromLonLat([this.restaurantForChange.location.longitude, this.restaurantForChange.location.latitude]))
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
					  center: ol.proj.fromLonLat([this.restaurantForChange.location.longitude, this.restaurantForChange.location.latitude]),
					  zoom: 15
					})
				});
            this.map.on('click', function (evt) {
                var coord = ol.proj.toLonLat(evt.coordinate);   // OVDE SE TACNO NALAZE KOORDINATE
                app.location.longitude = coord[0];
                app.location.latitude = coord[1];
            });
        },
        refreshLocation : function() {
            this.restaurantForChange.location.longitude = app.location.longitude;
            this.restaurantForChange.location.latitude = app.location.latitude;
        },
        switchToRestaurantPage: function() {
            router.push('/restaurantPage');
        },
        handleFileUpload : function(event){
            var file = event.target.files[0];
			var reader = new FileReader();

			reader.readAsDataURL(file);

			reader.onload = () => {
				this.newImageForRestaurant = reader.result
			}
			reader.onerror = function (error) {
				console.log('Error: ', error)
			}
        }
	}
});