Vue.component("commentsRequests", {
	data: function () {
		    return {
			  loggedUser: {restaurant: {}},
              commentsRequests: {}
		    }
	},
	template: ` 
<div class="mainDivCommentRequests">
    <h2>Zahtevi za postavljanje komentara na Vaš restoran</h2>
    <p v-if="loggedUser.restaurant.id == '-1'">Trenutno niste zaduženi ni za jedan restoran</p>
    <p v-if="commentsRequests.length == 0">Trenutno ne postoji ni jedan zahtev za komentar na vaš restoran</p>
    <div v-if="loggedUser.restaurant.id != '-1' && commentsRequests.length != 0">
        <table class="tableWithCommentRequests">
            <tr bgcolor="whitesmoke">
                <th>Ime kupca</th>
                <th>Korisničko ime kupca</th>
                <th>Ocena</th>
                <th>Komentar</th>
                <th></th>
                <th></th>
            </tr>
            <tr v-for="comment in commentsRequests">
                <td>{{comment.customerOfComment.name}}</td>
                <td>{{comment.customerOfComment.username}}</td>
                <td>{{comment.grade}}</td>
                <td>{{comment.text}}</td>
                <td><button @click="approveRequest(comment)">Odobri komentar</button></td>
                <td><button @click="rejectRequest(comment)">Odbij komentar</button></td>
            </tr>
        </table>
    </div>
</div>
`
	, 
	mounted () {
		this.getLoggedUserAndRequests();
    },
	methods: {
        getLoggedUserAndRequests : function() {
			axios
			.get('rest/getLoggedUser')
			.then(response => {
				this.loggedUser = response.data;
                this.getAppropriateRequests();
			})
            .catch(function(error){
                router.push('/');
            })
		},
        getAppropriateRequests : function() {
            axios
            .get('rest/commentsOfRestaurant/' + this.loggedUser.restaurant.id)
            .then(response => {
                this.commentsRequests = [];
                for (let commentReq of response.data){
                    if (!commentReq.processed){
                        this.commentsRequests.push(commentReq);
                    }
                }
            })
        },
        approveRequest : function(commentRequest) {
            let index = this.commentsRequests.indexOf(commentRequest);
            commentRequest.processed = true;
            commentRequest.approved = true;
            let jsonComment = JSON.stringify(commentRequest);
            axios
            .put('rest/comments/' + commentRequest.id, jsonComment)
            .then(response => {
                if (index > -1) {
                    this.commentsRequests.splice(index, 1);
                }
                alert("Uspešno prihvaćen komentar")
            })
            .catch(function(error) {
                alert("Neuspešno prihvatanje komentara")
            })
        },
        rejectRequest : function(commentRequest) {
            let index = this.commentsRequests.indexOf(commentRequest);
            commentRequest.processed = true;
            commentRequest.approved = false;
            let jsonComment = JSON.stringify(commentRequest);
            axios
            .put('rest/comments/' + commentRequest.id, jsonComment)
            .then(response => {
                if (index > -1) {
                    this.commentsRequests.splice(index, 1);
                }
				alert('Uspešno odbijen komentar')
			})
			.catch(function(error){
				alert('Neuspešno odbijanje komentara')
			})
        }
	}
});