<template>
     <v-container>
        <h1 class="
        text-center">Transfer Funds</h1>
        <v-data-table
        :headers="headers"
        :items="candidates"
        :search="search"
        sort-by="type"
        >
        <template v-slot:top>
        <v-toolbar
            flat
        >
            <v-toolbar-title>Candidates and Interest Groups</v-toolbar-title>
         

            <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">Transfer Funds</v-card-title>
                <v-card-text>
                     <v-form
                        v-model="valid">
                            <v-text-field
                            v-model="donation.simbucks"
                            label="Transfer Amount"
                            :rules="[v => !!v || 'A value is required', v=> !isNaN(v) || 'Must be a number', v=> v > 0 || 'Must be greater than 0']"
                            required>
                            </v-text-field>
                                                    
                                                    <p>

                            <p class="success--text">{{message}}</p>
                            <p class="error--text">{{cantDonate}}</p>

                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                    <v-btn color="blue darken-1" text @click="confirmDonation" :disabled="!valid">Donate</v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-toolbar>
        <v-text-field class="mb-6"
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
        </template>
        <template v-slot:item.actions="{ item }" >
            <v-row>
                <v-btn class="text" @click="donate(item)">
                Transfer
                <v-icon class="ml-3">
                    mdi-cash-refund
                </v-icon>
                </v-btn>
            </v-row>
        </template>
        </v-data-table>
    </v-container>
</template>

<script>
import moment from 'moment'
import {listAll, seniors} from '../../firebase'

export default {
    data(){
        return {
            donation: {
                item: ""
            },
            dialog: false,
            valid: false,
            headers: [
                { text: "Name", value: "name"},
                { text: "Type", value: "type"},
                { text: "Actions", value: "actions"}
            ],
            search: '',
            candidates: [],
            message: "",
            cantDonate: ""
        }
    },
    methods: {
        donate(item){
            this.donation.item = "Donation"
            this.donation.buyer = this.$store.state.user.name
            this.donation.seller = item.name
            this.donation.date = moment().format('LLL')
            this.message = ""
            this.cantDonate = ""
            this.dialog = true
        },
        confirmDonation(){
            if(this.$store.state.user.simbucks >= this.donation.simbucks){
                this.$store.dispatch('buyItem', this.donation)
                this.message = "Your transfer was successful!"
            }
            else{
                this.cantDonate =  "You do not have enough simbucks to transfer this amount"
            }
        },
        async loadCandidates(){
            this.candidates = await listAll(seniors)
            for(const [i, candidate] of this.candidates.entries()){ 
                if(candidate.name == this.$store.state.user.name){
                    console.log(this.candidates.splice(i, 1))
                    break
                }
            }
        },
    },
    mounted(){
        this.loadCandidates()
    }
}
</script>