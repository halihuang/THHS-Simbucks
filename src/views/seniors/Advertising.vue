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
                        <li>TV/Radio Ads can only exist in increments of 15 seconds</li>
                        <li>Ex. You will pay $800 for a 23 second TV ad</li>
                        <li>Newspaper ads cost 25 simbucks for a small ad, and 50 simbucks for a large ad</li>
                        <li>This page exists for campaigns to keep track of their advertising purchases. After buying an Radio/TV advertisement here, please fill out the following Google Form to alert the TV/Radio advertising team about your requests, so they can coordinate accordingly.</li>
                        <li><a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfcfUZKklGg01OrGjM7VoueOhGyNwc3XKwIbFvCMxnDgXwAsQ/viewform">Click here for TV/Radio Google Form</a></li>
                        <li>After buying a Liberal Newspaper Ad, please fill out the following google form to alert the Liberal Newspaper team of your request</li>
                        <li><a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdRuP1nCIugL6Ct7JC8wtK-KI6a8ofp2LPu_3-QJoP96oNk2g/viewform">Click here for Liberal Newspaper Google Form</a></li>
                        <li>After buying a Conservative Newspaper Ad, please fill out the following google form to alert the Conservative Newspaper team of your request</li>
                        <li><a target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdgRcZ80hAPwki3PnsY1YIK-3qNIRV36pjkHDZ6Sx2H0R9rVg/viewform?gxids=7757">Click here for Conservative Newspaper Google Form</a></li>
                        <li>If your advertisement request is canceled due to scheduling issues, we will refund you the simbucks.</li>
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
                        @change="newAd.time = 0"
                        required
                        >
                        </v-select>
                        <v-select
                        v-model="newAd.time"
                        v-if="newAd.type == 'TV' || newAd.type == 'Radio'"
                        :items="times"
                        :rules="[v => !!v || 'Time is required']"
                        label="Time"
                        required
                        >
                        </v-select>
                        <v-select
                        v-model="newAd.time"
                        v-if="newAd.type == 'Liberal Newspaper' || newAd.type == 'Conservative Newspaper'"
                        :items="sizes"
                        :rules="[v => !!v || 'Newspaper ad size is required']"
                        label="Newspaper Ad Size"
                        required
                        >
                        </v-select>
                        <v-select
                        v-model="newAd.date"
                        :items="dates"
                        :rules="[v => !!v || 'Date is required']"
                        label="Date"
                        required
                        >
                        </v-select>
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
                    Date
                </th>
                <th class="text-left">
                    Ad Type
                </th>
                <th class="text-left">
                    Time/Size
                </th>
                <th class="text-left">
                    Simbucks
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
            sizes: [
                {text: "Large Newspaper Ad", value: 2},
                {text: "Small Newspaper Ad", value: 1}
            ],
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
            dates: [
                {text: "October 9th, 2020", value: "October 9, 2020"},
                {text: "October 16th, 2020", value: "October 16, 2020"},
                {text: "October 23rd, 2020", value: "October 23, 2020"},
                {text: "October 30th, 2020", value: "October 30, 2020"},
            ],
            types: [
                {text: "TV", value:"TV"},
                {text: "Radio", value:"Radio"},
                {text: "Liberal Newspaper", value: "Liberal Newspaper"},
                {text: "Conservative Newspaper", value: "Conservative Newspaper"}
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
                    self.$store.dispatch('spendSimbucks', self.newAd.simbucks)
                    self.loadAds()
                    self.dialog= false
                })
            }
        },
        getCost(type, time){
            const tv = 400/15
            const radio = 200/15
            const newspaper = 25
            if(type == "TV"){
                return tv * time
            }
            else if(type == "Radio"){
                return radio * time
            }
            else if(type == "Liberal Newspaper" || type == "Conservative Newspaper"){
                return newspaper * time
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