<template>
  <v-container fill-height>
    <v-row justify="center" align-content="center">
      <v-col cols="6" id="forms">
        <h1>サインイン</h1>
        <v-form>
          <v-text-field v-model="email" label="E-mail"></v-text-field>
          <v-text-field v-model="password" label="password"></v-text-field>
          <v-btn color="success" class="mr-4" @click="signIn()">
            サインイン
          </v-btn>
          <router-link to="/signup">アカウントを作成する</router-link>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase/app";

export default {
  data: () => ({
    email: "",
    password: "",
  }),
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            alert("Success!");
            this.$router.push("/main-menu/mypage-home");
          },
          (err) => {
            alert(err.message);
          }
        );
    },
  },
};
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.signin {
  margin-top: 20px;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
}
input {
  margin: 10px 0;
  padding: 10px;
}

#forms {
  border: solid 1px;
  border-radius: 10px;
}
</style>
