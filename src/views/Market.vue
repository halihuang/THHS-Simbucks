<template>
    <v-container>
      <h1 class="text-center">Marketplace</h1>
    </v-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import {voters, auth} from '../firebase'

export default {
  methods: {
    emptyObj(obj){
      for(let a in obj){
        return false
      }
      return true
    }
  },
  mounted(){
    if(localStorage.getItem('collection') == "voters"){
      if(this.emptyObj(this.$store.user)){
        var user = auth.currentUser
        voters.doc(user.uid).set({email: user.email, simbucks: "50"})
      }
    }
  }
}
</script>
