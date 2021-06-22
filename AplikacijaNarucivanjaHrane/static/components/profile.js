Vue.component("profile", {
	data: function () {
		    return {
			  changedUser: {}
		    }
	},
	template: ` 
<div v-if="changedUser">
    <h3>Vaš profil</h3>
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
		this.changedUser = this.getLoggedUser();
    },
	methods: {
		updateInfo : function(event) {
			event.preventDefault();
			var user = JSON.stringify(this.changedUser);
            var path = '';
            if (this.changedUser.role === 'Kupac'){
                path = 'rest/customers/' + this.changedUser.id;
            } else if (this.changedUser.role === 'Dostavljac'){
                path = 'rest/deliverers/' + this.changedUser.id;
            } else if (this.changedUser.role === 'Menadzer'){
                path = 'rest/managers/' + this.changedUser.id;
            }
			axios
			.put(path, user)
			.then(response => {
                // da se azurira logovani korisnik od kojeg se priakzuje ime na pocetnom ekranu
                app.getLoggedUser();
                this.changedUser = response.data;
				alert('Uspešno ažurirani podaci')
			})
			.catch(function(error){
				alert('Neuspešno ažuriranje podataka')
			})
		},
        getLoggedUser : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				this.changedUser = response.data;
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