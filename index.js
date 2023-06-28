document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
      return {
  
        init() {
          axios
            .get('https://pizza-api.projectcodex.net/api/pizzas')
            .then((result) => {
              this.pizzas = result.data.pizzas
            })
            .then(() => {
              return this.createCart();
            })
            .then((result) => {
              this.cartId = result.data.cart_code;
            });
        },
        featuredPizzas() {
          return axios
            .get('https://pizza-api.projectcodex.net/api/pizzas/featured')
        },
        postfeaturedPizzas() {
          return axios
            .post('https://pizza-api.projectcodex.net/api/pizzas/featured')
        },
  
        createCart() {
          return axios
            .get('https://pizza-api.projectcodex.net/api/pizza-cart/create?username='+ this.username)
        },
  
        showCart() {
          const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
  
          axios
            .get(url)
            .then((result) => {
              this.cart = result.data;
            });
        },
  
        pizzaImage(pizza) {
          return `./images/${pizza.size}.png`
        },
  
        message: 'PLACE YOUR PIZZA ORDER.',
        username:'',
        pizzas: [],
        featuredpizzas: [],
        cartId: '',
        cart: { total: 0 },
        paymentMessage: '',
        payNow: false,
        paymentAmount: 0,
  
        add(pizza) {
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id
          }
  
          axios
            .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', params)
            .then(() => {
              this.message = "Pizza added to the cart"
              this.showCart();
            })
            .then(() => {
  
              return this.featuredPizzas();
  
            })
            .then(() => {
              return this.postfeaturedPizzas();
            })
            .catch(err => alert(err));
  
        },
        remove(pizza) {
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id
          }
  
          axios
            .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', params)
            .then(() => {
              this.message = "Pizza removed from the cart"
              this.showCart();
            })
            .catch(err => alert(err));
  
        },
        pay(pizza) {
          const params = {
            cart_code: this.cartId,
          }
  
          axios
            .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', params)
            .then(() => {
              if (!this.paymentAmount) {
                this.paymentMessage = 'No amount entered, please enter enough money.'
              }
              else if (this.paymentAmount >= this.cart.total) {
                this.paymentMessage = 'Payment Sucessfully!'
                this.message= this.username  +" , paid for the pizza(s)!"
                setTimeout(() => {
                  this.cart.total = 0
                  window.location.reload()
                }, 9000);
  
              } else if (this.paymentAmount < this.cart.total) {
                this.paymentMessage = 'Insufficient Amount Entered.'
              }
  
            })
            .catch(err => alert(err));
  
        }
  
      }
    });
  })