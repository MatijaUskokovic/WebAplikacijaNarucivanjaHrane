Vue.component("createStaff", {
	data: function () {
		    return {
			  regUser: {username: '', password: '', name: '', surname: '', gender: '', dateOfBirth: '', role: ''}
		    }
	},
	template: ` 
<div>
        <h2>Napravite profil novog radnika</h2>
        <form @submit='register'>
            <table>
                <tr><td><b>Korisničko ime*</b></td><td><input type="text" v-model="regUser.username"></td></tr>
                <tr><td><b>Lozinka*</b></td><td><input type="password" v-model="regUser.password"></td></tr>
                <tr><td><b>Ime*</b></td><td><input type="text" v-model="regUser.name"></td></tr>
                <tr><td><b>Prezime*</b></td><td><input type="text" v-model="regUser.surname"></td></tr>
                <tr>
                    <td><b>Pol*</b></td>
                    <td><select v-model="regUser.gender">
                            <option value="muski">Muski</option>
                            <option value="zenski">Ženski</option>
                        </select>
                    </td></tr>
                <tr><td><b>Datum rođenja*</b></td><td><vuejs-datepicker v-model="regUser.dateOfBirth" format="dd.MM.yyyy."></vuejs-datepicker></td></tr>
                <tr>
                    <td><b>Tip radnika*</b></td>
                    <td><select v-model="regUser.role">
                            <option value="Dostavljac">Dostavljač</option>
                            <option value="Menadzer">Menadžer</option>
                        </select>
                    </td>
                </tr>
                <tr><td><input type="submit" value="Registruj radnika"></td></tr>
            </table>
        </form>
</div>
`
	, 
	mounted () {
		this.getLoggedUser();
    },
	methods: {
		register : function(event) {
			event.preventDefault();

            if (!this.isValidToRegister()){
				alert('Nisu popunjena sva neophodna polja ili ste koristili pogrešne karaktere(",")');
				return;
			}
			if (this.regUser.username == '-1'){
				alert('Nemoguće odabrati navedeno korisničko ime');
				return;
			}

			this.regUser.dateOfBirth = this.regUser.dateOfBirth.getTime();
            let path = '';
            if (this.regUser.role == 'Dostavljac'){
                path = 'rest/deliverers';
            }
            if (this.regUser.role == 'Menadzer'){
                path = 'rest/managers';
                this.regUser.restaurant.id = -1;
            }
            let user = JSON.stringify(this.regUser);

            // vracanje datuma rodjenja u tip Date
			this.regUser.dateOfBirth = new Date(parseInt(this.regUser.dateOfBirth));

			axios.post(path, user)
			.then(response => {
                if (response.data.username == '-1'){
					alert('Korisničko ime je već zauzeto');
				}
                else {
                    this.regUser = {username: '', password: '', name: '', surname: '', gender: '', dateOfBirth: '', role: ''};
                    alert('Uspešno ste registrovali novog zaposlenog')
                }
			})
			.catch(function(error){
				alert('Neuspešno registrovanje')
			})
		},
        isValidToRegister : function() {
            let reg = /[,]+/;

			if (this.regUser.username == '' || this.regUser.username.match(reg)) {
				return false;
			}
			if (this.regUser.password == '' || this.regUser.password.match(reg)) {
				return false;
			}
			if (this.regUser.name == '' || this.regUser.name.match(reg)) {
				return false;
			}
			if (this.regUser.surname == '' || this.regUser.surname.match(reg)) {
				return false;
			}
			if (this.regUser.gender == '') {
				return false;
			}
			if (this.regUser.dateOfBirth == '') {
				return false;
			}
            if (this.regUser.role == '') {
                return false;
            }

			return true;
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
		}
	},
	components: {
		vuejsDatepicker
	}
});