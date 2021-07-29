<template>
  <v-container>
    <div>
      <h4>保険番号確認依頼一覧</h4>
      <table>
        <tr>
          <th>会社名</th>
          <th>保険番号</th>
          <th>法人番号</th>
          <th>依頼日</th>
          <th></th>
        </tr>
        <tr
          v-for="askApprovedUser in askApprovedUsersList"
          :key="askApprovedUser.uid"
        >
          <td>{{ askApprovedUser.companyName }}</td>
          <td>{{ askApprovedUser.insuranceNumberData.number }}</td>
          <td>{{ askApprovedUser.CorporateNumber }}</td>
          <td>{{ askApprovedUser.createdAt.toDate().toLocaleDateString() }}</td>
          <td>
            <v-btn
              color="primary"
              text
              @click="
                approve(
                  askApprovedUser.uid,
                  askApprovedUser.companyName,
                  askApprovedUser.insuranceNumberData.number
                )
              "
            >
              承認
            </v-btn>
          </td>
        </tr>
      </table>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
let db;
// let account;

export default {
  data: () => ({
    askApprovedUsersList: [] /* 承認依頼リスト */,
  }),
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //クリエイテッド
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  async created() {
    db = firebase.firestore();
    db.collection("users")
      .where("insuranceNumberData.isChecked", "==", false)
      .onSnapshot((askApprovedUsersRef) => {
        this.askApprovedUsersList = [];
        askApprovedUsersRef.forEach((askApprovedUser) => {
          this.askApprovedUsersList.push(askApprovedUser.data());
        });
      });
  },
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //メソッド
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  methods: {
    async approve(uid, name, number) {
      if (
        window.confirm(`会社:${name}
保険番号:${number}

承認しますか？`)
      ) {
        db.collection("users")
          .doc(uid)
          .set({ insuranceNumberData: { isChecked: true } }, { merge: true });
        alert("承認しました。");
        this.sendMail(uid);
      }
    },
    async sendMail(uid) {
      const functions = firebase.functions();
      const userRef = await db.collection("users").doc(uid).get();
      const userData = userRef.data();
      console.log(userData);
      const mailer = functions.httpsCallable("sendMail");
      mailer({
        to: userData.email,
        subject: "保険番号が承認されました。",
        text: "ログイン可能となりました",
      });
    },
  },
};
</script>

<style scoped>
/* ================================*/
/* テーブル */
/* ================================*/
table {
  width: 700px;
  border-collapse: separate;
  border-spacing: 0;
}

table th:first-child {
  border-radius: 5px 0 0 0;
}

table th:last-child {
  border-radius: 0 5px 0 0;
  border-right: 1px solid #3c6690;
}

table th {
  text-align: center;
  color: white;
  background: linear-gradient(#829ebc, #225588);
  border-left: 1px solid #3c6690;
  border-top: 1px solid #3c6690;
  border-bottom: 1px solid #3c6690;
  box-shadow: 0px 1px 1px rgba(255, 255, 255, 0.3) inset;
  /* width: 25%; */
  padding: 10px 0;
}

table td {
  text-align: center;
  border-left: 1px solid #a8b7c5;
  border-bottom: 1px solid #a8b7c5;
  border-top: none;
  box-shadow: 0px -3px 5px 1px #eee inset;
  /* width: 25%; */
  padding: 10px 0;
}

table td:last-child {
  border-right: 1px solid #a8b7c5;
}

table tr:last-child td:first-child {
  border-radius: 0 0 0 5px;
}

table tr:last-child td:last-child {
  border-radius: 0 0 5px 0;
}
</style>
