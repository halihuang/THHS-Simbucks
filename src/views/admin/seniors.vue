<template>
    <v-container>
        <div class="text-center">
            <v-dialog
            v-model="dialog"
            width="500"
            >
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="primary accent-4"
                dark
                v-bind="attrs"
                v-on="on"
                @click="dialogTitle='Add'"
                >
                Add New Candidate/Interest Group
                </v-btn>
            </template>

            <v-card>
                <v-card-title class="headline grey lighten-2">
                {{dialogTitle}} Candidate/Interest Group
                </v-card-title>

                <v-card-text>
                    <v-form v-model="valid">
                        <v-text-field
                        v-model="candidate.name"
                        label="Name"
                        :rules="[v => !!v || 'Name is required']"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="candidate.simbucks"
                        label="Starting Simbucks"
                        :rules="[v => !!v || 'Starting Simbucks is required', v=> !isNaN(v) || 'Must be a number']"
                        required
                        ></v-text-field>

                        <v-select
                        v-model="candidate.type"
                        :items="types"
                        :rules="[v => !!v || 'Item is required']"
                        label="Type"
                        required
                        ></v-select>

                        <v-text-field v-for="(email,i) in candidate.emails"
                        filled
                        v-bind:key="i"
                        v-model="candidate.emails[i]"
                        :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'E-mail must be valid']"
                        label="Email Allowed Access"
                        required
                        ></v-text-field>
                        <v-btn @click="candidate.emails.push('')">
                            Add Email
                        </v-btn>
                    </v-form>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="error"
                    @click="dialog = false"
                >
                Cancel
                </v-btn>
                <v-btn
                    color="primary"
                    :disabled="!valid"
                    @click="addCandidateGroup"
                >
                    Confirm
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </div>
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
         

            <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteCandidateConfirm">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
            mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteCandidate(item)"
        >
            mdi-delete
        </v-icon>
        </template>
        </v-data-table>
    </v-container>
</template>

<script>
import {seniors, listAll} from '../../firebase'
export default {
    data: function(){
        return{
            dialog: false,
            dialogTitle: "Add",
            dialogDelete: false,
            types: ['Candidate', 'Interest Group'],
            candidate: { 
                name: "",
                simbucks: "",
                type: "",
                emails: [""]
            },
            valid: false,
            candidates: [],
            headers: [
                { text: "Name", value: "name"},
                { text: "Type", value: "type"},
                { text: "Simbucks", value: "simbucks"},
                { text: "Actions", value: "actions"}

            ],
            search: '',
            deleteItem: {}
        }
    },
    methods: {
        addCandidateGroup(){
            var self = this;
            seniors.doc(this.candidate.name).set(this.candidate).then(() => {
                self.dialog = false;
                self.loadCandidates()
            }).catch((err)=>{
                console.log('err adding new candidate', err)
                self.dialog = false;
            })
        },
        async loadCandidates(){
            this.candidates = await listAll(seniors)
        },
        deleteCandidate(item){
            this.dialogDelete = true
            this.deleteItem = item
        },
        deleteCandidateConfirm(){
            seniors.doc(this.deleteItem.name).delete()
            this.loadCandidates()
        },
        editItem(item){
            this.candidate = Object.assign({},item)
            this.dialogTitle = "Edit"
            this.dialog = true
        }
    },
    mounted(){
        this.loadCandidates();
    }
}
</script>



// trump 2000
// biden 3000
// aoc 300
// john cummings 100
// max rose 450
// mally 100
// donvaan 400
// nicole 100
// joe ann 100

// Black Lives Matter - Chelsea Cameron - 25
// National Immigration Forum - Ranali Ranasinghe - 300
// Human Rights Campaign - Shelly Gulkarov - 
// Planned Parenthood - Jaida Boodram - 
// National Alliance to End Homelessness - Michael Kim - 
// Environmental Defense Fund - Min Hyeok Shin - 

// Republican National Committee - Ali Boivab and Jodie Gao - 500
// Democratic National Committee - Emmanuella Borukh - 500
// National Right to Life - Amanda Dhuli - 
// NRA - National Rifle Association - Roshan Patel -
// NARAL - PRO Choice America - Anika Rahman 
// American Medical Association - Amar Maksumic - 