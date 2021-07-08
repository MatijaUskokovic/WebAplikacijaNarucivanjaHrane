Vue.component("createRestaurant", {
	data: function () {
		    return {
              freeManagers: [],
              newManager: {username: '', password: '', name: '', surname: '', gender: '', dateOfBirth: ''},
              selectedManager: {},
              map: {},
              newRestaurant: {name: '', type: '', location:{adress : {street: '', streetNum: '', city: '', postalCode: ''}}, logo:''},
              latitude: '',
              longitude: ''
		    }
	},
	template: ` 
<div class='parent flex-parent'>
    <div class='child flex-child'>
        <h3>Napravite novi restoran</h3>
        <form @submit='create'>
            <table class="collapsedTable" border="2">
                <tr>
                    <td colspan="2"><b>Naziv*</b></td>
                    <td><input type="text" v-model="newRestaurant.name"></td>
                </tr>
                <tr>
                    <td colspan="2"><b>Tip*</b></td>
                    <td><select v-model="newRestaurant.type">
                            <option value="Italijanski">Italijanski</option>
                            <option value="Kineski">Kineski</option>
                            <option value="Rostilj">Roštilj</option>
                            <option value="Meksicki">Meksički</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><b>Lokacija*</b></td>
                    <td><div id="map" class="map" @click="refreshLocation"></div></td>
                </tr>
                <tr>
                    <td colspan="2"><b>Koordinate* (odaberite na mapi)</b></td>
                    <td>{{longitude}}, {{latitude}}</td>
                </tr>
                <tr>
                    <td><b>Grad*</b></td>
                    <td><input type="text" placeholder="Grad" v-model="newRestaurant.location.adress.city"/></td>
                    <td><input type="text" placeholder="Poštanski broj" v-model="newRestaurant.location.adress.postalCode"/></td>
                </tr>
                <tr>
                    <td><b>Adresa*</b></td>
                    <td><input type="text" placeholder="Ulica" v-model="newRestaurant.location.adress.street" /></td>
                    <td><input type="text" placeholder="Broj" id="streetNum" v-model="newRestaurant.location.adress.streetNum"/></td>  
                </tr>
                <tr>
                    <td colspan="2"><b>Logo*</b></td>
                    <td><input type="file" @change="handleFileUpload" accept="image/*"></td>
                </tr>
                <tr>
                    <td><input type="submit" value="Kreiraj restoran"></td>
                </tr>
            </table>
        </form>
    </div>

    <div class='child flex-child' v-bind:hidden="freeManagers.length == 0">
        <h3>Slobodni menadžeri - izaberite jednog od ponuđenih</h3>
        <table class="freeManagersTable" border="5">
            <tr bgcolor="whitesmoke">
                <th>Korisničko ime</th>
                <th>Ime</th>
                <th>Prezime</th>
                <th>Pol</th>
                <th>Datum rođenja</th>
            </tr>
            <tr v-for="user in freeManagers" v-on:click="selectManager(user)" v-bind:class="{selected : selectedManager.id===user.id}">
                <td>{{user.username}}</td>
                <td>{{user.name}}</td>
                <td>{{user.surname}}</td>
                <td>{{user.gender}}</td>
                <td>{{user.dateOfBirth | dateFormat('DD.MM.YYYY')}}</td>
            </tr>
        </table>
    </div>

    <div class='child flex-child' v-bind:hidden="freeManagers.length != 0">
        <h3>Nema slobodnih menadžera u sistemu, kreirajte novog:</h3>
        <form @submit='register'>
            <table>
                <tr><td>Korisničko ime</td><td><input type="text" v-model="newManager.username"></td></tr>
                <tr><td>Lozinka</td><td><input type="password" v-model="newManager.password"></td></tr>
                <tr><td>Ime</td><td><input type="text" v-model="newManager.name"></td></tr>
                <tr><td>Prezime</td><td><input type="text" v-model="newManager.surname"></td></tr>
                <tr>
                    <td>Pol</td>
                    <td><select v-model="newManager.gender">
                            <option value="muski">Muski</option>
                            <option value="zenski">Ženski</option>
                        </select>
                    </td></tr>
                <tr><td>Datum rođenja</td><td><vuejs-datepicker v-model="newManager.dateOfBirth" format="dd.MM.yyyy."></vuejs-datepicker></td></tr>
                <!-- ZA TIP RADNIKA RUCNO DODELITI MENADZER -->
                <tr><td><input type="submit" value="Registruj menadžera"></td></tr>
            </table>
        </form>
    </div>
</div>

`
	, 
	mounted () {
		this.getLoggedUser();
        this.getFreeManagers();
        this.map = new ol.Map({
            target: 'map',
            layers: [
              new ol.layer.Tile({
                source: new ol.source.OSM()
              })
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([20.36, 44.55]),
              zoom: 6.5
            })
        });
        this.map.on('click', function (evt) {
            var coord = ol.proj.toLonLat(evt.coordinate);   // OVDE SE TACNO NALAZE KOORDINATE
            app.location.longitude = coord[0];
            app.location.latitude = coord[1];
        });
    },
	methods: {
        selectManager : function(manager) {
            this.selectedManager = manager;
        },
		register : function(event) {
			event.preventDefault();

            if (!this.isValidToRegister()){
				alert('Nisu popunjena sva neophodna polja ili ste koristili pogrešne karaktere(",")');
				return;
			}
			if (this.newManager.username == '-1'){
				alert('Nemoguće odabrati navedeno korisničko ime');
				return;
			}

			this.newManager.dateOfBirth = this.newManager.dateOfBirth.getTime();
            this.newManager.type = 'Menadzer';
			let user = JSON.stringify(this.newManager);
            // vracanje datuma rodjenja u tip Date
			this.newManager.dateOfBirth = new Date(parseInt(this.newManager.dateOfBirth));
			axios
            .post('rest/managers', user)
			.then(response => {
                if (response.data.username == '-1'){
					alert('Korisničko ime je već zauzeto');
				}
                else {
                    this.newManager = {username: '', password: '', name: '', surname: '', gender: '', dateOfBirth: ''};
                    let newFreeManager = response.data;
                    newFreeManager.dateOfBirth = new Date(parseInt(newFreeManager.dateOfBirth));
                    this.freeManagers.push(newFreeManager);
                }
			})
			.catch(function(error){
				alert('Neuspešno registrovanje')
			})
		},
        isValidToRegister : function() {
            let reg = /[,]+/;

			if (this.newManager.username == '' || this.newManager.username.match(reg)) {
				return false;
			}
			if (this.newManager.password == '' || this.newManager.password.match(reg)) {
				return false;
			}
			if (this.newManager.name == '' || this.newManager.name.match(reg)) {
				return false;
			}
			if (this.newManager.surname == '' || this.newManager.surname.match(reg)) {
				return false;
			}
			if (this.newManager.gender == '') {
				return false;
			}
			if (this.newManager.dateOfBirth == '') {
				return false;
			}

			return true;
		},
        create : function(event) {
            event.preventDefault();
            if (this.selectedManager.id == null){
                alert('Niste odabrali menadžera za restoran');
                return;
            }
            if (this.longitude == '') {
                alert('Niste odabrali lokaciju restorana na mapi');
                return;
            }

            if (!this.isValidToCreateRestaurant()){
				alert('Nisu popunjena sva neophodna polja ili ste koristili pogrešne karaktere(",")');
				return;
			}

            if (isNaN(this.newRestaurant.location.adress.postalCode)){
                alert('Poštanski broj se mora sasatojati samo od cifara');
                return;
            }

            if (this.newRestaurant.logo == '') {
                alert('Morate odabrati logo restorana');
                return;
            }

            this.newRestaurant.status = 'Radi';
            this.newRestaurant.location.longitude = this.longitude;
            this.newRestaurant.location.latitude = this.latitude;
            this.newRestaurant.avgGrade = 0.0;
            let restaurant = JSON.stringify(this.newRestaurant);
            axios
            .post("rest/restaurants", restaurant)
            .then(response => {
				this.newRestaurant = {location:{}};
                this.setManagerToRestaurant(response.data);
			})
			.catch(function(error){
				alert('Neuspešno kreiranje')
			})
        },
        isValidToCreateRestaurant : function() {
            let reg = /[,]+/;

			if (this.newRestaurant.name == '' || this.newRestaurant.name.match(reg)) {
				return false;
			}
			if (this.newRestaurant.type == '') {
				return false;
			}
			if (this.newRestaurant.location.adress.street == '' || this.newRestaurant.location.adress.street.match(reg)) {
				return false;
			}
			if (this.newRestaurant.location.adress.streetNum == '' || this.newRestaurant.location.adress.streetNum.match(reg)) {
				return false;
			}
			if (this.newRestaurant.location.adress.city == '' || this.newRestaurant.location.adress.city.match(reg)) {
				return false;
			}
			if (this.newRestaurant.location.adress.postalCode == '') {
				return false;
			}

			return true;
        },
        setManagerToRestaurant : function(restaurant){
            this.selectedManager.restaurant = restaurant;
            this.selectedManager.dateOfBirth = this.selectedManager.dateOfBirth.getTime();
            let manager = JSON.stringify(this.selectedManager);
            axios
			.put("rest/managers/" + this.selectedManager.id, manager)
			.then(response => {
				alert('Uspešno kreiran restoran i postavljen selektovani menadžer')
                router.push('/');
			})
			.catch(function(error){
				alert('Neuspešno postavljanje menadžera')
			})
        },
        getFreeManagers : function() {
            axios
            .get('rest/managers')
            .then(response => {
                for (let manager of fixDate(response.data)){
                    if (manager.restaurant.id == '-1'){
                        this.freeManagers.push(manager);
                    }
                }
            })
        },
        getLoggedUser : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				let user = response.data;
                if (user != null){
                    if (user.role != 'Administrator'){
                        router.push('/');
                    }
                }
			})
            .catch(function(error){
                router.push('/');
            })
		},
        handleFileUpload : function(event){
			var file = event.target.files[0];
			var reader = new FileReader();

			reader.readAsDataURL(file);

			reader.onload = () => {
				//alert('RESULT: ' + reader.result)
				this.newRestaurant.logo = reader.result
				//alert(this.newRestaurant.logo)
			}
			reader.onerror = function (error) {
				console.log('Error: ', error)
			}
        },
        refreshLocation : function() {
            this.longitude = app.location.longitude;
            this.latitude = app.location.latitude;
        }
	},
	components: {
		vuejsDatepicker
	},
    filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	}
   	}
});