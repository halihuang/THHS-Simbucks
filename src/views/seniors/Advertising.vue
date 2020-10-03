<template>
    <v-container>
        <div class="text-center">
            <h1 >Advertisements</h1>
            <v-btn class="primary" @click="dialog = true">
                Buy an Advertisement
            </v-btn>
        </div>
        <v-dialog
        v-model="dialog"
        width="600px">
            <v-card>
                <v-card-title>
                    Buy an Advertisement
                </v-card-title>
                <v-card-text>
                    <ul class="mb-5">
                        <li>TV show ads cost $400 per 15 seconds</li>
                        <li>Radioshow Ads cost $200 per 15 seconds</li>
                        <li>Ads can only exist in increments of 15 seconds</li>
                        <li> Ex. You will pay $800 for a 23 second TV ad</li>
                    </ul>
                    <v-form
                    v-model="valid">
                        <v-text-field 
                        v-model="newAd.by"
                        disabled
                        label="For"
                        required
                        filed>
                        </v-text-field>
                        <v-select
                        v-model="newAd.type"
                        :items="types"
                        :rules="[v => !!v || 'Type is required']"
                        label="Type of Advertisement"
                        required
                        >
                        </v-select>
                        <v-select
                        v-model="newAd.time"
                        :items="times"
                        :rules="[v => !!v || 'Time is required']"
                        label="Time"
                        required
                        >
                        </v-select>
                        <v-dialog
                            ref="dialog"
                            v-model="modal"
                            :return-value.sync="newAd.date"
                            width="290px"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="newAd.date"
                                label="Advertisement Date"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="newAd.date"
                            scrollable
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="modal = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.dialog.save(newAd.date)"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-form>
                    <p v-if="adCost">
                        Your advertisement will cost <b>{{adCost}} Simbucks</b>
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="buyAd"
                    :disabled="!valid"
                    class="primary">
                        Buy
                    </v-btn>
                    <v-btn @click="clearForm"
                    class="warning">
                    Clear
                    </v-btn>
                    <v-btn @click="dialog = false"
                    class="error">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-simple-table>
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Ad Type
                </th>
                <th class="text-left">
                    Time
                </th>
                <th class="text-left">
                    Simbucks Spent
                </th>
                <th class="text-left">
                    Date
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="(item, i) in ads"
                :key="i"
                >
                <td>{{item.date}}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.simbucks }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
    </v-container> 
</template>

<script>
import {ads, listAll} from '../../firebase'
import moment from 'moment'

export default {
    data(){
        return {
            dialog: false,
            valid: false,
            modal: false,
            ads: [],
            newAd: {type: "", time: "", simbucks: 0, date: "", by: ""},
            times: [
                {text: "15 seconds", value: 15}, 
                {text: "30 seconds", value: 30},
                {text: "45 seconds", value: 45}, 
                {text: "1 minute", value: 60}, 
                {text: "1 minute 15 seconds", value: 75},
                {text: "1 minute 30 seconds", value: 90},
                {text: "1 minute 45 seconds", value: 105},
                {text: "2 minutes", value: 120}
            ],
            types: [
                {text: "TV", value:"TV"},
                {text: "Radio", value:"Radio"},
            ],
        }
    },
    computed: {
        adCost(){
            var newAd = this.newAd
            if(newAd.type && newAd.time){
                return this.getCost(newAd.type, newAd.time)
            }
            return ""
        }
    },
    methods: {
        async loadAds(){
            var all = await listAll(ads)
            console.log(all)
            var myAds = []
            for(let ad of all){
                if(ad.by == this.$store.state.user.name){
                    myAds.push(ad)
                    myAds.sort((a,b) => {
                        a = moment(a.date)
                        b = moment(b.date)
                        if(a.isBefore(b)){
                            return -1
                        }
                        else if(b.isBefore(a)){
                            return 1
                        }
                        return 0
                    })
                }
            }
            this.ads = myAds
        },
        buyAd(){
            var self = this
            this.newAd.simbucks = this.getCost(this.newAd.type, this.newAd.time)
            if(this.newAd.simbucks <= this.$store.state.user.simbucks){
                this.newAd.by = this.$store.state.user.name
                ads.add(this.newAd).then(() => {
                    self.$store.dispatch('buyItem', self.newAd.simbucks)
                    self.loadAds()
                    self.dialog= false
                })
            }
        },
        getCost(type, time){
            const tv = 400/15
            const radio = 200/15
            if(type == "TV"){
                return tv * time
            }
            else if(type == "Radio"){
                return radio * time
            }
        },
        clearForm(){
            this.newAd = {type: "", time: "", simbucks: 0, date: "", by: ""}
        }
    },
    mounted(){
        this.loadAds()
        this.newAd.by = this.$store.state.user.name
    }
}
</script>
//view and buy adversting