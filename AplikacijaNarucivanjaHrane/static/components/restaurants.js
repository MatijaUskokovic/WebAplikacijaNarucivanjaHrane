Vue.component("restaurants", {
	data: function () {
		    return {
		    	allRestaurants : {},
		    	ispis : "ovde dolaze restorani"
		    }
	},
	template: ` 
<div>
<h3>{{ispis}}</h3>
</div>		  
`
	, 
	mounted () {
	
    },
	methods:{
	
	}
});