Vue.component("profile", {
	data: function () {
		    return {
			  changedUser: {}
		    }
	},
	template: ` 
<div v-if="changedUser">
    <h2>Vaš profil</h2>
    <p>Ažurirajte lične podatke</p>
    <form @submit='updateInfo'>
        <table>
            <tr><td>Korisničko ime</td><td><input type="text" v-model="changedUser.username"></td></tr>
            <tr><td>Lozinka</td><td><input type="password" v-model="changedUser.password"></td></tr>
            <tr><td>Ime</td><td><input type="text" v-model="changedUser.name"></td></tr>
            <tr><td>Prezime</td><td><input type="text" v-model="changedUser.surname"></td></tr>
            <tr>
                <td>Pol</td>
                <td><select v-model="changedUser.gender">
                        <option value="muski">Muski</option>
                        <option value="zenski">Ženski</option>
                    </select>
                </td></tr>
            <tr><td>Datum rođenja</td><td><vuejs-datepicker v-model="changedUser.dateOfBirth" format="dd.MM.yyyy."></vuejs-datepicker></td></tr>
            <tr v-bind:hidden="changedUser.role!=='Kupac'"><td>Broj osvojenih bodova:</td><td>{{changedUser.pointsCollected}}</td></tr>
            <tr><td><input type="submit" value="Ažuriraj podatke"></td></tr>
        </table>
    </form>
</div>
`
	, 
	mounted () {
		this.getLoggedUser();
    },
	methods: {
		updateInfo : function(event) {
			event.preventDefault();

            if (!this.isValidToUpdateInfo()){
				alert('Nisu popunjena sva neophodna polja ili ste koristili nedozvoljene karaktere(",")');
				return;
			}
			if (this.changedUser.username == '-1'){
				alert('Nemoguće odabrati navedeno korisničko ime');
				return;
			}

            this.changedUser.dateOfBirth = this.changedUser.dateOfBirth.getTime();
			var user = JSON.stringify(this.changedUser);
            this.changedUser.dateOfBirth = new Date(parseInt(this.changedUser.dateOfBirth));
            var path = '';
            if (this.changedUser.role === 'Kupac'){
                path = 'rest/customers/' + this.changedUser.id;
            } else if (this.changedUser.role === 'Dostavljac'){
                path = 'rest/deliverers/' + this.changedUser.id;
            } else if (this.changedUser.role === 'Menadzer'){
                path = 'rest/managers/' + this.changedUser.id;
            } else {
                path = 'rest/administrators/' + this.changedUser.id;
            }
			axios
			.put(path, user)
			.then(response => {
                if (response.data.username == '-1'){
					alert('Korisničko ime je već zauzeto');
				}
                else {
                    // da se azurira logovani korisnik od kojeg se priakzuje ime na pocetnom ekranu
                    app.getLoggedUser();
                    this.changedUser = response.data;
                    this.changedUser.dateOfBirth = new Date(parseInt(this.changedUser.dateOfBirth));
                    alert('Uspešno ažurirani podaci')
                }
			})
			.catch(function(error){
				alert('Neuspešno ažuriranje podataka')
			})
		},
        isValidToUpdateInfo : function() {
			let reg = /[,]+/;

			if (this.changedUser.username == '' || this.changedUser.username.match(reg)) {
				return false;
			}
			if (this.changedUser.password == '' || this.changedUser.password.match(reg)) {
				return false;
			}
			if (this.changedUser.name == '' || this.changedUser.name.match(reg)) {
				return false;
			}
			if (this.changedUser.surname == '' || this.changedUser.surname.match(reg)) {
				return false;
			}
			if (this.changedUser.gender == '') {
				return false;
			}
			if (this.changedUser.dateOfBirth == '') {
				return false;
			}

			return true;
		},
        getLoggedUser : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				this.changedUser = response.data;
                this.changedUser.dateOfBirth = new Date(parseInt(this.changedUser.dateOfBirth));
			})
            .catch(function(error){
                router.push('/');
            })
		}
	},
	components: {
		vuejsDatepicker
	}
});