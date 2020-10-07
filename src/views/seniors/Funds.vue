<template>
    <v-container>
        <div class="text-center">
            <h1>Fund History</h1>
        </div>
        <v-alert class="mx-auto mt-12 text-center"
        v-if="history.length == 0"
        max-width="200px"
        type="info"
        >Loading</v-alert>
        <v-simple-table v-if="history.length > 0">
            <template v-slot:default>
            <thead>
                <tr>
                <th class="text-left">
                    Date
                </th>
                <th class="text-left">
                    Item
                </th>
                <th class="text-left">
                    Buyer
                </th>
                <th class="text-left">
                    Simbucks
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="(item, i) in history"
                :key="i"
                >
                <td>{{item.date}}</td>
                <td>{{ item.item }}</td>
                <td>{{ item.buyer }}</td>
                <td>{{ item.simbucks }}</td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
    </v-container>
</template>

<script>
import {transactions} from '../../firebase'
import moment from 'moment'

export default {

    data(){
        return {
            history: [],
        }
    },
    methods: {
        async loadHistory(){
            var history = []
            var collection = await transactions.where("seller", '==', this.$store.state.user.name).get()
            for(let doc of collection.docs){
                history.push(doc.data())
            }
            history.sort((a,b) => {
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
            this.history = history
        }
    },
    mounted(){
        setTimeout(() => {this.loadHistory()}, 2000)
    }
}
</script>
