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
            })

            .then(() => {
              return this.featuredPizzas();
            })
        },
        featuredPizzas() {
          return axios
            .get('https://pizza-api.projectcodex.net/api/pizzas/featured?username=XolaniSibisi')
            .then((result) => {
              this.featuredpizzas = result.data.pizzas
              // console.log(this.featuredpizzas)
            })
           
        },
        postfeaturedPizzas() {
          return axios
            .post('https://pizza-api.projectcodex.net/api/pizzas/featured',
            
            {
              "username" : 'XolaniSibisi',
              "pizza_id" : pizza_id,
            }).then(() => {
              this.featuredPizzas()
            })
        },
  
        createCart() {
          return axios
            .get(`https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`)
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
        change: 0,
        viewCart: false,
  
        add(pizza) {
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id,
          }
  
          axios
            .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', params)
            .then(() => {
              this.message = "Pizza added to the cart"
              this.showCart();
              setTimeout(() => {
                this.message = 'PLACE YOUR PIZZA ORDER';
              }, 3000);
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
            pizza_id: pizza.id,
          }
  
          axios
            .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', params)
            .then(() => {
              this.message = "Pizza removed from the cart"
              this.showCart();
              setTimeout(() => {
                this.message = 'PLACE YOUR PIZZA ORDER';
              }, 3000);
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

              if(this.username === ''){
                alert('Please enter your name to place an order')
              }
              else if (!this.paymentAmount) {
                this.paymentMessage = 'No amount entered, please enter enough money.'
                setTimeout(() => {
                  this.paymentMessage = '';
                }, 4000);
              }
              else if (this.paymentAmount >= this.cart.total && this.username !== "") {
                this.paymentMessage = 'Payment received!'
                this.change = this.paymentAmount - this.cart.total;
                this.message= this.username  +" paid for the pizza(s)!"
                setTimeout(() => {
                  this.cart.total = 0
                  window.location.reload()
                }, 7000);
  
              } else if (this.paymentAmount < this.cart.total) {
                this.paymentMessage = 'Insufficient Amount Entered.'
                setTimeout(() => {
                  this.paymentMessage = '';
                }, 4000);
              }
  
            })
            .catch(err => alert(err));
  
        }
  
      }
    });
  })