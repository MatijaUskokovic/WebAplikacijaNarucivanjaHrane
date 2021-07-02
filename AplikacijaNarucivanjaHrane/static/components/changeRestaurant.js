Vue.component("changeRestaurant", {
	data: function () {
		    return {
                restaurantForChange: {location: {adress: {}}},
                loggedUser: {},
                map: {}
		    }
	},
	template: ` 
<div v-if="restaurantForChange">
    <form @submit="updateRestaurant">
        <table border="1">
            <tr>
                <td colspan="2">Naziv</td>
                <td><input type="text" v-model="restaurantForChange.name"></td>
            </tr>
            <tr>
                <td colspan="2">Tip</td>
                <td><select v-model="restaurantForChange.type">
                        <option value="Italijanski">Italijanski</option>
                        <option value="Kineski">Kineski</option>
                        <option value="Rostilj">Roštilj</option>
                        <option value="Meksicki">Meksički</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="2">Lokacija</td>
                <td><div id="map" class="map" @click="refreshLocation"></div></td>
            </tr>
            <tr>
                <td colspan="2">Koordinate (možete odabrati novu na mapi)</td>
                <td>{{restaurantForChange.location.longitude}}, {{restaurantForChange.location.latitude}}</td>
            </tr>
            <tr>
                <td>Grad</td>
                <td><input type="text" placeholder="Grad" v-model="restaurantForChange.location.adress.city"/></td>
                <td><input type="text" placeholder="Poštanski broj" v-model="restaurantForChange.location.adress.postalCode"/></td>
            </tr>
            <tr>
                <td>Adresa</td>
                <td><input type="text" placeholder="Ulica" v-model="restaurantForChange.location.adress.street" /></td>
                <td><input type="text" placeholder="Broj" id="streetNum" v-model="restaurantForChange.location.adress.streetNum"/></td>  
            </tr>

            <!-- ZA SADA SE JOS NE MOGU MENJATI SLIKE
            <tr>
                <td colspan="2">Logo</td>
                <td><input type="file" @change="handleFileUpload" accept="image/*"></td>
            </tr>
            -->

            <tr>
                <td><input type="submit" value="Ažuriraj podatke"></td>
            </tr>
        </table>
    </form>
</div>
`
	, 
	mounted () {
		this.getRestaurantAndLoggedUser();
    },
	methods: {
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
                    router.push('/restaurantPage');
				})
				.catch(function(error){
					alert('Neuspešno ažuriranje podataka');
				})
			}else{
				alert("Molimo vas da obrišete sve zapete.")
			}
		},
        validateRestaurant : function(){
			let reg = /[,]+/;

			if(this.restaurantForChange.location.adress.city.match(reg)){
				return false;
				//css
			}

            if (isNaN(this.restaurantForChange.location.adress.postalCode)){
                alert('Poštanski broj se mora sastojati samo od cifara');
                return false;
            }

            if (this.restaurantForChange.location.adress.street.match(reg)) {
                return false;
            }

            if (this.restaurantForChange.location.adress.streetNum.match(reg)){
                return false;
            }

			if(this.restaurantForChange.name.match(reg)){
				//css
				return false;
			}

			return true;
		},
        getRestaurantAndLoggedUser : function() {
			axios
			.get('rest/selectedRestaurant')
			.then(response => {
                this.restaurantForChange = response.data;
                this.getLoggedUser();
                this.showMap();
			})
            .catch(function(error){
                router.push('/');
            })
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
        }
	}
});