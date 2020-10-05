// JavaScript source code
//var product = 'Socks';
Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `
	<div class="product"> 
            <div class="product-image">
                <!-- vue's v-bind directive create a bind between data & the attribute we wana be bound to -->
                <img v-bind:src="image" width="300px">
            </div>
            <div class="product-info">
                <h2>{{ title }}</h2>
                <!--
                try v-show -- it adds a display-none in the css of the element -- it doesn't change the dom -- faster
                <p v-if="inStock">In stock</p>
                <p v-else>Out of stock</p>
                -->
                <p v-if="inventory > 10">In stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
                <p v-else>Out of stock</p>
				<p>Shipping: {{ shipping }}</p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <!-- 
                <div v-for="variant in variants" 
                    :key="variant.variantID"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct( variant.variantImage )">
                -->
                <!-- Same thing but with a computed prop image()-->
                <div v-for="(variant, index) in variants" 
                    :key="variant.variantID"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct( index )">
                    <!-- @ is a chorthand for v-on 
                    <p @mouseover="updateProduct( variant.variantImage )">{{ variant.variantColor }}</p>
                    -->
                </div>

                <button v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{ disabledButton: !inStock }">Add to Cart</button>

                
            </div>
        </div>
	`,
	data(){
		return {
			brand: 'Vue Mastery',
		product: 'Socks',
		/* image: './greenSocks.jpg',*/
		selectedVariant: 0,
		//inStock: true,
		//inventory: 100,
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
		]
		}
	},
	methods: {
		addToCart: function () {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID)
			//emitting an event by calling it add-to-cart, so somethig has to receave this call 
			//--> we will listen for that call in the product component by @add-to-acrt
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
		},
		inventory(){
			return this.selectedVariant ? 
						this.variants[this.selectedVariant].variantQantity :
						this.variants[0].variantQantity;
		},
		shipping() {
			if (this.premium) {
				return 'Free'
			} 
			return 2.99
		}
	}
})
var app = new Vue({
	el: '#app',
	data: {
		premium: true,
		cart: []
	},
	methods:{
		updateCart (id){
			this.cart.push(id)
		}
	}	
})