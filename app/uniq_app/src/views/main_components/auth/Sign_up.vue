<template>
  <v-container fill-height>
    <v-row justify="center" align-content="center">
      <v-col cols="6" id="forms">
        <h1>サインアップ</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>

          <v-text-field
            v-model="password"
            :counter="8"
            :rules="passwordRules"
            label=" パスワード"
            required
          ></v-text-field>
          <!------------------------------- ラジオ荷主------------------------------->
          <input
            type="radio"
            class="mt-5"
            id="client"
            value="client"
            v-model="userType"
          />
          <label for="client">荷主会社として登録</label>
          <br />
          <!-------------------------------ラジオ搬送 ------------------------------->
          <input
            type="radio"
            id="transporter"
            value="transporter"
            v-model="userType"
          />
          <label for="transporter">搬送会社会社として登録</label>
          <!-------------------------------ラジオ両方 ------------------------------->
          <br /><input
            type="radio"
            class="mb-5"
            id="bothUser"
            value="bothUser"
            v-model="userType"
          />
          <label for="bothUser">荷主・搬送会社として登録</label>
          <br />

          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="signUp()"
          >
            サインアップ
          </v-btn>
          <router-link to="/signin">ログインする</router-link>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
export default {
  data: () => ({
    name: "",
    email: "",
    password: "",
    valid: true,
    userType: "client",
    // ----------------------------- バリデーションルール-----------------------------
    emailRules: [
      (v) => !!v || "emailは必須です",
      (v) => /.+@.+\..+/.test(v) || "email形式が不正です",
    ],
    passwordRules: [
      (v) => !!v || "パスワードは必須です",
      (v) => (v && v.length >= 6) || "パスワードは6文字以上で入力してください",
    ],
  }),
  methods: {
    /* バリテート */
    validate() {
      this.$refs.form.validate();
    },
    /* フォームリセット */
    reset() {
      this.$refs.form.reset();
    },
    /* バリデートリセット */
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    /* サインアップ */
    async signUp() {
      this.validate();
      try {
        await firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password);
        this.createUser();
      } catch (error) {
        alert(error.message);
      }
    },
    /* ユーザー作成 */
    async createUser() {
      let db = firebase.firestore();
      try {
        await db.collection("users").doc(firebase.auth().currentUser.uid).set({
          uid: firebase.auth().currentUser.uid,
          email: firebase.auth().currentUser.email,
          userType: this.userType,
          createdAt: new Date(),
        });
        alert("アカウントを作成しました。");
        this.$router.push("/main-menu/home");
      } catch (error) {
        alert(error.message);
      }
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
