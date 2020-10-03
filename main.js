// JavaScript source code
//var product = 'Socks';
var app = new Vue({
	el: '#app',
	data: {
		brand: 'Vue Mastery',
		product: 'Socks',
		/* image: './greenSocks.jpg',*/
		selectedVariant: 0,
		//inStock: true,
		inventory: 100,
		details: ["80% coton", "20% polyester", "Gender-neutral"],
		variants: [
			{
				variantID: 2234,
				variantColor:"green",
				variantImage:"./greenSocks.jpg",
				variantQantity: 0
			},
			{
				variantID: 2235,
				variantColor:"blue",
				variantImage:"./blueSocks.jpg",
				variantQantity: 15
			}
		],
		cart: 0
	},
	methods: {
		addToCart: function () {
			this.cart += 1;
		},
		updateProduct: function (index) {
			this.selectedVariant = index;
		}
	},
	computed: {
		title(){
			return this.brand + ' ' + this.product
		},
		image() {
			return this.variants[this.selectedVariant].variantImage
		},
		inStock() {
			return this.variants[this.selectedVariant].variantQantity
		}
	}
})