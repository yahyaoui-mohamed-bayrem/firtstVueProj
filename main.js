// JavaScript source code

//implementing a global channel for child to parent communication
var eventBus = new Vue()

const newLocal = `
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

			<product-tabs :reviews="reviews">

			</product-tabs>
			
			

        </div>
	`
//var product = 'Socks';
Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: newLocal,
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
		],
		reviews: []
		}
	},
	methods: {
		addToCart: function () {
			this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID)
			//emitting an event by calling it add-to-cart, so somethig has to receave this call 
			//--> we will listen for that call in the product component by @add-to-acrt
		},
		updateProduct: function (index) {
			this.selectedVariant = index
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
	},
	//mounted is a life cycle hook
	mounted() {
		eventBus.$on('review-submitted', productReview => {
			this.reviews.push(productReview)
		})
	}
})

Vue.component('product-review', {
	template: `
	<form class="review-form" @submit.prevent="onSubmit"> <!-- .prevent this will prevent the default behaviour: the page won't refresh -->
		<p v-if="errors.length">
		<b>Please correct the following error(s):</b>
		<ul>
	  		<li v-for="error in errors">{{ error }}</li>
		</ul>
  </p>
	  <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review" ></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating"> <!-- .number is a modifier to makeshure to typeCast this value as a number -->
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
	`,
	data() {
		return {
			name: null,
			review: null,
			rating: null,
			errors: []
		}
	},
	methods: {
		onSubmit() {
			if(this.name && this.review && this.rating) {
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating
				}
				eventBus.$emit('review-submitted', productReview)
				this.name = null
				this.review = null
				this.rating = null
			} else {
				if(!this.name) this.errors.push("Name required.")
				if(!this.review) this.errors.push("Review required.")
				if(!this.rating) this.errors.push("Rating required.")
			}
		}
	}
})

Vue.component('product-tabs', {
	props: {
		reviews: {
			type: Array,
			required: true
		}
	},
	template: `
		<div>
			<span class="tab"
				:class="{ activeTab: selectedTab === tab }"
				v-for="(tab, index) in tabs" 
				:key="index"
				@click="selectedTab = tab">
				{{ tab }}</span>

			<div v-show="selectedTab === 'Reviews'">
        		<p v-if="!reviews.length">There are no reviews yet.</p>
        		<ul>
          			<li v-for="review in reviews">
          				<p>{{ review.name }}</p>
          				<p>Rating: {{ review.rating }}</p>
          				<p>{{ review.review }}</p>
          			</li>
        		</ul>
       		</div>	

			<product-review 
				v-show="selectedTab === 'Make a Review'">
			</product-review>
		</div>
	`,
	data() {
		return {
			tabs: ['Reviews', 'Make a Review'],
			selectedTab: 'Reviews'
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