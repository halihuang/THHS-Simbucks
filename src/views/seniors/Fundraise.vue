<template>
    <v-container>
        <div class="text-center">
            <h1 >Fundraise</h1>
            <v-btn class="primary" @click="dialog = true">
                Place an Item on the Marketplace
            </v-btn>
        </div>
        <v-dialog
        v-model="dialog"
        width="600px">
            <v-card>
                <v-card-title>
                Place an Item on the Marketplace
                </v-card-title>
                <v-card-text>
                    <v-form
                    v-model="valid">
                        <v-text-field 
                        v-model="marketItem.name"
                        label="Item Name"
                        required
                        filed>
                        </v-text-field>
                        <v-text-field
                        v-model="marketItem.simbucks"
                        :rules="[v => !!v || 'Cost is required', v=> !isNaN(v) || 'Must be a number']"
                        label="Simbuck Cost of Item"
                        required
                        >
                        </v-text-field>
                        <v-text-field
                        v-model="marketItem.stock"
                        :rules="[v => !!v || 'Cost is required', v=> !isNaN(v) || 'Must be a number']"
                        label="Item Stock"
                        required>
                        </v-text-field>
                        <v-textarea
                        v-model="marketItem.description"
                        :rules="[v => !!v || 'Description is required']"
                        label="Item Description"
                        filled
                        required
                        >
                        </v-textarea>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="addMarketItem"
                    :disabled="!valid"
                    class="primary">
                        Add
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
                    Name
                </th>
                <th class="text-left">
                    Simbucks
                </th>
                <th class="text-left">
                    Stock
                </th>
                <th class="text-left">
                    Description
                </th>
                <th class="text-left">
                    Actions
                </th>
                </tr>
            </thead>
            <tbody>
                <tr
                v-for="(item, i) in items"
                :key="i"
                >
                <td>{{item.name}}</td>
                <td>{{ item.simbucks }}</td>
                <td>{{ item.stock }}</td>
                <td>{{ item.description }}</td>
                <td><v-icon
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon></td>
                </tr>
            </tbody>
            </template>
        </v-simple-table>
    </v-container> 
</template>


<script>
import {market} from '../../firebase'

export default {
    data(){
        return {
            marketItem: {
                name: "",
                description: "",
                stock: "",
                simbucks: "",
                seller: "",
                id: ""
            },
            items: [],
            dialog: false,
            valid: false
        }
    },
    methods: {
        addMarketItem(){
            var self = this
            this.marketItem.id = this.create_UUID()
            this.marketItem.seller = this.$store.state.user.name
            market.doc(this.marketItem.id).set(this.marketItem).then(() => {
                self.loadGroupItems()
                self.dialog = false
            })
        },
        async loadGroupItems(){
            var items = await market.get()
            var groupItems = []
            for(let doc of items.docs){
                if(doc.data().seller == this.$store.state.user.name){
                    groupItems.push(doc.data())
                }
            }
            this.items = groupItems
        },
        async deleteItem(item){
            var self = this
            market.doc(item.id).delete().then(() => {
                self.loadGroupItems()
            })
        },
        clearForm(){
            this.marketItem = {
                name: "",
                description: "",
                stock: "",
                simbucks: "",
                seller: ""
            }
        },
        create_UUID(){
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }
    },
    mounted(){
        this.loadGroupItems()
    }
}
</script>