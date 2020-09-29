<template>
    <v-container>
      <v-list
            nav
            dense
            
        >
            <v-list-item v-if="$vuetify.breakpoint.mobile">
                <v-list-item-title>THHS Simbucks</v-list-item-title>
                <v-spacer/>
                <v-divider/>
            </v-list-item>
            <v-list-item-group
                v-model="group"
                active-class="primary--text text--accent-4"
            >
                <v-list-item v-for="(item,i) in items" v-bind:key="i">
                    <v-list-item-icon>
                        <v-icon v-text="item.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-title v-text="item.text">
                    </v-list-item-title>
                </v-list-item>

            </v-list-item-group>
        </v-list>
    </v-container>
</template>

<script>
  export default {
    name: 'Sidebar',

    data: () => ({
        group: null,
        items: [
            { text: 'Marketplace', icon: 'mdi-storefront' },
            { text: 'Purchase History', icon: 'mdi-history' },
            { text: 'My Account', icon: 'mdi-account' },
            { text: 'About', icon:'mdi-information'}
        ]
    }),
  }
</script>
