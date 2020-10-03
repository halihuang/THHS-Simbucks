<template>
    <v-container v-if="items.length > 0">
    <v-navigation-drawer
    v-model="drawer"
    clipped
    app
    >
    <v-container>
      <v-list
            nav   
        >
              <v-list-item v-if="$vuetify.breakpoint.mobile">
                  <v-list-item-title>THHS Simbucks</v-list-item-title>
                  <v-spacer/>
                  <v-divider/>
              </v-list-item>
              <v-list-item-group
                  v-model="group"
                  active-class="primary--text text--accent-4"
              >
                  <v-list-item v-for="(item,i) in items" v-bind:key="i" v-bind:to="item.route">
                      <v-list-item-icon>
                          <v-icon v-text="item.icon"></v-icon>
                      </v-list-item-icon>
                      <v-list-item-title v-text="item.text">
                      </v-list-item-title>
                  </v-list-item>
              </v-list-item-group>
              <v-list-item-group>
                <v-list-item>
                  <v-btn
                  class="mt-5 text-center error"
                  @click="signout()">
                    Sign out
                  </v-btn>
                </v-list-item>
              </v-list-item-group>
          </v-list>
      </v-container>
    </v-navigation-drawer>
    <v-app-bar
      color="red accent-4"
      dark
      clipped-left
      app
    >
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.mobile" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>THHS Simbucks</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn class="primary" v-if="balance">
        Balance: ${{balance}}
      </v-btn>
    </v-app-bar>
    </v-container>
</template>

<script>
  // import {voters, seniors} from '../firebase.js'

  export default {
    name: 'Nav',
  
    data: function(){
      return {
        group: null,
        drawer: true,
      }
    },
    computed: {
      items() {
        return this.$store.state.nav
      },
      balance() {
        if( this.$store.state.user){
          return this.$store.state.user.simbucks
        }
        return ""
        
      }
    },
    methods: {
      signout: function(){
        this.$store.dispatch('logout')
      }
    }
  }
</script>
