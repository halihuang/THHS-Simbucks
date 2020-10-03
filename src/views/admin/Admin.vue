<template>
    <v-container>
        <v-form v-model="valid">
            <v-text-field
            label="Admin Email"
            v-model="email"
            :rules="[v => !!v || 'Email is requred', v => /.+@.+/.test(v) || 'E-mail must be valid']"
            required>
            </v-text-field>
            <v-btn @click="addAdmin"
            :disabled="!valid"
            class="primary">
                Add Admin
            </v-btn>
        </v-form>
        <v-card class="mt-5">
            <v-card-title>
                List of Admins
            </v-card-title>
            <v-list>
                <v-list-item v-for="(admin,i) in admins"
                v-bind:key="i">
                    <v-list-item-content>
                        {{admin.email}}
                    </v-list-item-content>
                    <v-list-item-action class="pr-6">
                        <v-flex>
                            <v-row>
                            <h4>Delete</h4>
                            <v-icon
                                @click="deleteAdmin(admin)"
                            >
                            mdi-delete
                            </v-icon>
                            </v-row>
                        </v-flex>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </v-card>
    </v-container>
</template>

<script>
import {admins, listAll} from '../../firebase'
export default {
    data(){
        return {
            email: "",
            valid: false,
            admins: []
        }
    },
    methods: {
        addAdmin(){
            var self = this;
            admins.doc(this.email).set({email:this.email}).then(() => {
                self.loadAdmins()
            })
        },
        async loadAdmins(){
            this.admins = await listAll(admins)
        },
        deleteAdmin(admin){
            admins.doc(admin.email).delete()
            this.loadAdmins()
        }
    },
    mounted(){
        this.loadAdmins()
    }
}
</script>