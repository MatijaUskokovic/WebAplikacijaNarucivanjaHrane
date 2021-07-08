function compareStrings(a, b){
    let x = a.toLowerCase();
    let y = b.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
}

Vue.component("customersOfRestaurant", {
	data: function () {
		    return {
              loggedUser: {restaurant: {}},
			  allUsers: {},
              usersToShow: {},
              name: '',
              surname: '',
              username: '',
              customerType: '',
              sortMode: '',
              sortParameter: ''
		    }
	},
	template: ` 
<div>
    <div class="mainDivForUsers">
        <p v-if="loggedUser.restaurant.id == '-1'">Trenutno niste zaduženi ni za jedan restoran</p>
        <div v-if="loggedUser.restaurant.id != '-1'">
            <h2>Prikaz svih kupaca koji su poručili iz vašeg restorana</h2>

            <div class="filterBar">
                <form @submit='search'>
                    <table>
                        <tr>
                            <td><b>Pretraga: </b></td>
                            <td><input type="text" placeholder="Ime" v-model="name"></td>
                            <td><input type="text" placeholder="Prezime" v-model="surname"></td>
                            <td><input type="text" placeholder="Korisničko ime" v-model="username"></td>
                            <td>
                                <select v-model="customerType">
                                    <option value="">Tip kupca</option>
                                    <option value="bronzani">Bronzani</option>
                                    <option value="srebrni">Srebrni</option>
                                    <option value="zlatni">Zlatni</option>
                                </select>
                            </td>
                            <td><input type="submit" value="Pretraži"></td>
                        </tr>
                    </table>
                </form>

                <form>
                    <table>
                        <tr>
                            <td><b>Sortiranje</b></td>
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
                                    <option value="name">Ime</option>
                                    <option value="surname">Prezime</option>
                                    <option value="username">Korisničko ime</option>
                                    <option value="points">Broj sakupljenih bodova</option>
                                </select>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
            
            <br/>
            <br/>
            <!--PRIKAZ KORISNIKA-->
            <p v-if="allUsers.length == 0 && loggedUser.restaurant.id != '-1'">Ne postoji ni jedan kupac koji je naručio iz Vašeg restorana</p>
            <div class="insideDivWithAllUsers" v-else>
                <table class="tableWithUsers">
                    <tr bgcolor="whitesmoke">
                        <th>Korisničko ime</th>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Pol</th>
                        <th>Datum rođenja</th>
                        <th>Uloga</th>
                        <th>Sakupljeni bodovi kupca</th>
                    </tr>
                    <tr v-for="user in usersToShow">
                        <td>{{user.username}}</td>
                        <td>{{user.name}}</td>
                        <td>{{user.surname}}</td>
                        <td>{{user.gender | genderFormat}}</td>
                        <td>{{user.dateOfBirth | dateFormat('DD.MM.YYYY')}}</td>
                        <td>{{user.role}}</td>
                        <td>{{user.pointsCollected}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
`
	, 
	mounted () {
		this.getLoggedUser();
    },
	methods: {
		getLoggedUser : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
                this.loggedUser = response.data;
                this.getCustomersOfRestaurant();
			})
            .catch(function(error){
                router.push('/');
            })
		},
        getCustomersOfRestaurant : function() {
            axios
            .get('rest/customersOfRestaurant/' +  this.loggedUser.restaurant.id)
            .then(response => {
                this.allUsers = fixDate(response.data);
                this.usersToShow = this.allUsers;
            });
        },
        search : function(event){
            event.preventDefault();
            let filteredUsers = [];
            for (user of this.allUsers){
                if (user.name.toLowerCase().includes(this.name.toLowerCase()) &&
                    user.surname.toLowerCase().includes(this.surname.toLowerCase()) && 
                    user.username.toLowerCase().includes(this.username.toLowerCase()) &&
                    ((user.type != null &&  user.type.typeName == this.customerType) || this.customerType == '')){
                        filteredUsers.push(user);
                    }
            }
            this.usersToShow = filteredUsers;
        },
        sort : function(){
            if (this.sortMode == 'rastuce'){
                if (this.sortParameter == 'name'){
                    this.usersToShow.sort((a, b) => compareStrings(a.name, b.name));
                }else if (this.sortParameter == 'surname'){
                    this.usersToShow.sort((a, b) => compareStrings(a.surname, b.surname));
                }else if (this.sortParameter == 'username'){
                    this.usersToShow.sort((a, b) => compareStrings(a.username, b.username));
                }else if (this.sortParameter == 'points'){
                    this.usersToShow.sort((a, b) => a - b);
                }
            }
            if (this.sortMode == 'opadajuce'){
                if (this.sortParameter == 'name'){
                    this.usersToShow.sort((a, b) => compareStrings(b.name, a.name));
                }else if (this.sortParameter == 'surname'){
                    this.usersToShow.sort((a, b) => compareStrings(b.surname, a.surname));
                }else if (this.sortParameter == 'username'){
                    this.usersToShow.sort((a, b) => compareStrings(b.username, a.username));
                }else if (this.sortParameter == 'points'){
                    this.usersToShow.sort((a, b) => b - a);
                }
            }
        }
	},
	components: {
		//vuejsDatepicker
	},
    filters: {
    	dateFormat: function (value, format) {
    		var parsed = moment(value);
    		return parsed.format(format);
    	},
        genderFormat: function(value) {
            if (value == 'muski') {
                return 'muški';
            }
            else {
                return 'ženski';
            }
        }
   	}
});