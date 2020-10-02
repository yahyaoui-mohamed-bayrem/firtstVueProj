// JavaScript source code
//var product = 'Socks';
var app = new Vue({
	el: '#app',
	data: {
		product: 'Socks',
		image: './greenSocks.jpg',
		inStock: true,
		inventory: 100,
		details: ["80% coton", "20% polyester", "Gender-neutral"],
		variants: [
			{
				variantID: 2234,
				variantColor:"green",
				variantImage:"./greenSocks.jpg"
			},
			{
				variantID: 2235,
				variantColor:"blue",
				variantImage:"./blueSocks.jpg"
			}
		],
		cart: 0
	},
	methods: {
		addToCart: function () {
			this.cart += 1;
		},
		updateProduct: function (variantImage) {
			this.image = variantImage;
		}
	}
})