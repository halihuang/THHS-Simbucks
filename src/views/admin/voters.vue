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
                            v-model="edited"
                            label="Set Money"
                            :rules="[v => !!v || 'A value is required', v=> !isNaN(v) || 'Must be a number']"
                            required>
                            </v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions></v-card-actions>
                </v-card>
            </v-dialog>
        </v-data-table>
    </v-container>
</template>

<script>
import {voters, listAll} from '../../firebase'
export default {
      data(){
          return {
              headers: [{text: "Email", value: "email"}, {text:"Simbucks", value:"simbucks"},  { text: "Actions", value: "actions"}],
              dialog: true,
              valid: false,
              voters: [],
              search: "",
              edited: ""
          }
      },
      methods: {
          async loadVoters(){
              this.voters = await listAll(voters)
              console.log(this.voters)
          },
          editVoter(voter){
            var self = this
            self.dialog = true
              voters.where('email', '==', voter.email).get().then((data) => {
                  data.forEach((doc) => {
                      self.edited = doc.data().simbucks
                  })
              })
          }

      },
      mounted(){
          this.loadVoters()
      }
}
</script>
