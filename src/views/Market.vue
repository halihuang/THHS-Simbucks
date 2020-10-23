<template>
    <v-container>
      <h1 class="text-center">Marketplace</h1>
      <v-dialog v-model="dialog" max-width="520px">
        <v-card>
          <div class="text=center pt-5">
            <p class="headline text-center"  v-if="!enoughMoney">You don't have enough simbucks to purchase this item.</p>
            <div v-else>
              <p class="headline text-center"  v-if="!finishedPurchase">Are you sure you want to buy this item?</p>
              <p class="headline text-center single-line"  v-else>You have successfully purchased this item!</p>
            </div>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
              <v-btn color="blue darken-1" text @click="confirmPurchase" v-if="!finishedPurchase" :disabled="!enoughMoney">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <template>
        <v-container fluid>
          <v-data-iterator
            :items="items"
            :items-per-page.sync="itemsPerPage"
            :page="page"
            :search="search"
            :sort-by="sortBy.toLowerCase()"
            :sort-desc="sortDesc"
            hide-default-footer
          >
            <template v-slot:header>
              <v-toolbar
                dark
                color="blue darken-3"
                class="mb-1"
              >
                <v-text-field
                  v-model="search"
                  clearable
                  flat
                  solo-inverted
                  hide-details
                  prepend-inner-icon="mdi-magnify"
                  label="Search"
                ></v-text-field>
                <template v-if="$vuetify.breakpoint.mdAndUp">
                  <v-spacer></v-spacer>
                  <v-select
                    v-model="sortBy"
                    flat
                    solo-inverted
                    hide-details
                    :items="keys"
                    prepend-inner-icon="mdi-magnify"
                    label="Sort by"
                  ></v-select>
                  <v-spacer></v-spacer>
                  <v-btn
                  large
                  depressed
                  color="blue"
                  @click="loadItems; snackbar = true">
                    <v-icon>
                      mdi-reload
                    </v-icon>
                  </v-btn>
                  <v-spacer/>
                  <v-btn-toggle
                    v-model="sortDesc"
                    mandatory
                  >
                    <v-btn
                      large
                      depressed
                      color="blue"
                      :value="false"
                    >
                      <v-icon>mdi-arrow-up</v-icon>
                    </v-btn>
                    <v-btn
                      large
                      depressed
                      color="blue"
                      :value="true"
                    >
                      <v-icon>mdi-arrow-down</v-icon>
                    </v-btn>
                  </v-btn-toggle>
                </template>
              </v-toolbar>
            </template>

            <template v-slot:default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.name"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <v-card v-if="item.stock > 0">
                    <v-card-title class="subheading font-weight-bold">
                      {{ item.name }}
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-list dense>
                      <v-list-item
                        v-for="(key, index) in filteredKeys"
                        :key="index"
                      >
                        <v-list-item-content :class="{ 'blue--text': sortBy === key }">
                          <b>{{ key }}:</b>
                        </v-list-item-content>
                        <v-list-item-content
                          class="align-end"
                          :class="{ 'blue--text': sortBy === key }"
                        >
                          {{ item[key.toLowerCase()] }}
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                    <v-card-text>
                       <div class="font-weight-medium black--text"> Description:</div>{{item.description}}
                    </v-card-text>
                    <v-card-actions class="pb-4" v-if="allowBuy">
                      <v-spacer/>
                      <v-btn @click="buyItem(item)"
                      class="primary mr-4">
                        Buy
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </template>

            <template v-slot:footer>
              <v-row
                class="mt-2"
                align="center"
                justify="center"
              >
                <span class="grey--text">Items per page</span>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      dark
                      text
                      color="primary"
                      class="ml-2"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ itemsPerPage }}
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(number, index) in itemsPerPageArray"
                      :key="index"
                      @click="updateItemsPerPage(number)"
                    >
                      <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-spacer></v-spacer>

                <span
                  class="mr-4
                  grey--text"
                >
                  Page {{ page }} of {{ numberOfPages }}
                </span>
                <v-btn
                  fab
                  dark
                  color="blue darken-3"
                  class="mr-1"
                  @click="formerPage"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  fab
                  dark
                  color="blue darken-3"
                  class="ml-1"
                  @click="nextPage"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-row>
            </template>
          </v-data-iterator>
        </v-container>
      </template>


      <v-snackbar
      v-model="snackbar"
    >
      Refreshing Marketplace
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    </v-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import {voters, market, auth, listAll, getUserMeta} from '../firebase'
import moment from 'moment'

export default {
  data(){
    return {
       itemsPerPageArray: [6, 12, 18],
        search: '',
        filter: {},
        sortDesc: false,
        page: 1,
        itemsPerPage: 6,
        sortBy: 'name',
        keys: [
          'Name', 
          'Seller',
          'Simbucks',
          'Stock'],
        items: [],
        item: {},
        dialog: false,
        finishedPurchase: false,
        enoughMoney: true,
        snackbar: false
    }
  },
  computed: {
      numberOfPages () {
        return Math.ceil(this.items.length / this.itemsPerPage)
      },
      filteredKeys () {
        return this.keys.filter(key => key !== 'Name')
      },
      allowBuy(){
        if(localStorage.getItem("collection") == 'voters'){
          return true
        }
        return false
      }
    },
  methods: {
    emptyObj(obj){
      for(let a in obj){
        return false
      }
      return true
    },
    async loadItems(){
      this.items = await listAll(market)
    },
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    async buyItem(item) {
      await this.$store.dispatch('fetchUserData', getUserMeta())
      if(parseInt(this.$store.state.user.simbucks) < parseInt(item.simbucks)){
        this.enoughMoney = false
      }
      else{
        this.enoughMoney = true
      }
      this.finishedPurchase = false
      this.dialog = true
      this.item = item
    },
    async confirmPurchase(){
      await this.$store.dispatch('fetchUserData', getUserMeta())
      if(parseInt(this.$store.state.user.simbucks) < parseInt(this.item.simbucks)){
        this.enoughMoney = false
      }
      else{
          var purchase = {
          buyer: this.$store.state.user.email,
          date: moment().format("LLL"),
          item: this.item.name,
          seller: this.item.seller,
          id: this.item.id,
          simbucks: this.item.simbucks
        }
        this.enoughMoney = true
        this.finishedPurchase = true
        await this.$store.dispatch('buyItem', purchase)
        this.loadItems()
      }
    }
  },
  async mounted(){
    if(localStorage.getItem('collection') == "voters"){
      var user = auth.currentUser
      var doc = await voters.doc(user.uid).get()
      if(!doc.exists){
        voters.doc(user.uid).set({email: user.email, simbucks: "50"})
      }
    }
    this.loadItems()
  }
}
</script>
