<style scoped>
    
    .background-img {
        background: linear-gradient(
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.10)
        ), url("../img/login.jpg");
        background-repeat: no-repeat;
        background-position: center;
        height: 100%;
        width:100%;
        top:0;
        left:0;
        position: absolute;
       
    }
</style>


<template>
    <v-app  class="background-img">
        <v-container
        fluid
        fill-height>
            <v-card
            min-width="300px"
            class="mx-auto text-center pa-3">
                <v-card-title>
                    THHS Simbucks Login
                </v-card-title>
                <v-card-text>
                    <h2 class="mb-2">
                        Sign in with your Townsend Harris Email
                    </h2>
                    <v-col>
                        <v-btn @click="login('voters')">
                            I am a Voter
                        </v-btn>
                        <p class="mt-3">If you're a freshman, sophomore or junior, you're a voter in this election simulation.</p>
                    </v-col>
                    <v-col>
                        <v-btn @click="login('seniors')">
                            I am an Interest Group/Canidate
                        </v-btn>
                        <p class="mt-3">If you're a senior and you're participating as an interest group or canidate, login with this option</p>
                    </v-col>
                    <v-col>
                        <a @click="login('admins')">
                            I am an Admin
                        </a>
                    </v-col>
                    <v-alert type="error" v-if="permission">
                        {{permission}}
                    </v-alert>
                </v-card-text>
            </v-card>
        </v-container>
    </v-app>
</template>


<script>
import * as firebase from 'firebase/app'

export default {
    methods: {
        login: function(collection){
            const provider = new firebase.auth.GoogleAuthProvider()
            localStorage.setItem('collection', collection)
            firebase.auth().signInWithPopup(provider)
        },
    },
    computed: {
        permission(){
            return this.$store.state.permission
        }
    }
}
</script>