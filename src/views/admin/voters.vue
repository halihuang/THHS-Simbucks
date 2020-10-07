<template>
    <v-container>
         
        <v-data-table
        :headers="headers"
        :items="voters"
        :search="search"
        >
            <template v-slot:top>
            <v-toolbar
                flat
            >
                <v-toolbar-title>Voters</v-toolbar-title>
            </v-toolbar>
            <v-text-field class="mb-6"
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            </template>
            <template v-slot:item.actions="{ item }">
            <v-icon
                small
                class="mr-2"
                @click="editVoter(item)"
            >
                mdi-pencil
            </v-icon>
            </template>
        </v-data-table>
        <v-dialog
        v-model="dialog"
        width="500"
        >
            <v-card>
                <v-card-title>Edit Voter</v-card-title>
                <v-card-text>
                    <v-form
                    v-model="valid">
                        <v-text-field
                        v-model="edited.simbucks"
                        label="Set Money"
                        :rules="[v => !!v || 'A value is required', v=> !isNaN(v) || 'Must be a number']"
                        required>
                        </v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="editVoterData()"
                    :disabled="!valid"
                    class="primary">
                        Edit
                    </v-btn>
                    <v-btn @click="dialog = false"
                    class="error">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {voters, listAll, getDocument} from '../../firebase'
export default {
      data(){
          return {
              headers: [{text: "Email", value: "email"}, {text:"Simbucks", value:"simbucks"},  { text: "Actions", value: "actions"}],
              dialog: false,
              valid: false,
              voters: [],
              search: "",
              edited: {simbucks:"", email:""}
          }
      },
      methods: {
          async loadVoters(){
              this.voters = await listAll(voters)
          },
          async editVoter(voter){
            this.dialog = true
            var doc = await getDocument(voters, "email", voter.email)
            this.edited = {simbucks:doc.data().simbucks, email: voter.email}
          },
          async editVoterData(){
            var doc = await getDocument(voters, "email", this.edited.email)
            await doc.ref.set(this.edited)
            this.loadVoters()
            this.dialog = false
          }

      },
      mounted(){
          this.loadVoters()
      }
}
</script>
