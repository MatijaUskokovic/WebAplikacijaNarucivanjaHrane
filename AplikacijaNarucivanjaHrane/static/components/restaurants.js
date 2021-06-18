Vue.component("restaurants", {
	data: function () {
		    return {
		      polje: ". Primer polja"
		    }
	},
	template: ` 
<div>
	<p>Ovde će biti prikaz restorana {{polje}}.</p>
</div>		  
`
	, 
	mounted () {
		
    }
});