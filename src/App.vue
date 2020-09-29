<template>
  <v-app>
    <v-navigation-drawer
    v-model="drawer"
    fixed
    clipped
    app
    >
      <Sidebar/>
    </v-navigation-drawer>
    <v-app-bar
      color="red accent-4"
      dark
      clipped-left
      app
    >
      <v-app-bar-nav-icon v-if="$vuetify.breakpoint.mobile" @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>THHS Simbucks</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
      color="primary">
        My Balance: $79.29
      </v-btn>
    </v-app-bar>
    <v-content>
      <v-container 
      fluid>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Sidebar from './components/Sidebar'
export default {
  name: 'App',
  components: {
    Sidebar
  },
  data: () => ({
    drawer: true,
  }),
  watch: {
    group () {
      this.drawer = false
    },
  },
};
console.log();
</script>
