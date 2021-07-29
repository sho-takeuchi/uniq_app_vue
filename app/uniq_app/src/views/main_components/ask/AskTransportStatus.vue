<template>
<div>
  <h2>依頼した取引中の案件一覧</h2>
    <table>
      <tr>
        <th style="max-width: 300px">会社名</th>
        <th style="width: 9%">集荷日時</th>
        <th style="width: 9%">荷下ろし日時</th>
        <th style="width: 18%">集荷場所</th>
        <th style="width: 18%">荷下ろし場所</th>
        <th style="width: 9%">距離(キロ)</th>
        <th style="width: 8%">車種</th>
        <th style="width: 8%">重量(トン)</th>
        <th style="width: 10%">状況</th>
      </tr>
    </table>
    <div v-for="matter in askMatters" v-bind:key="matter.id">
      <table class="table01">
        <tr>
          <th style="max-width: 300px; word-break: break-all" label="会社名">
            <p>{{ matter.askCompanyName }}<br /></p>
          </th>
          <td style="width: 9%" label="集荷日時">
            <p>{{ matter.pickupDate }}<br />{{ matter.pickupTime }}</p>
          </td>
          <td style="width: 9%" label="荷下ろし日時">
            <p>{{ matter.unloadDate }}<br />{{ matter.unloadTime }}</p>
          </td>
          <td style="width: 18%" label="集荷場所">
            <p>{{ matter.pickupPrefecture }}{{ matter.pickupLocation }}</p>
          </td>
          <td style="width: 18%" label="荷下ろし場所">
            <p>{{ matter.unloadPrefecture }}{{ matter.unloadLocation }}</p>
          </td>
          <td style="width: 9%" label="距離">
            <p>{{ matter.distance }}kg<br /></p>
          </td>
          <td style="width: 8%" label="車種">
            <p>{{ matter.truckType }}<br /></p>
          </td>
          <td style="width: 8%" label="重量">
            <div v-if="matter.weight != ''">
              <p>{{ matter.weight }}t<br /></p>
            </div>
            <div v-else-if="matter.weight == ''">
              <p>{{ "重量なし" }}<br /></p>
            </div>
          </td>
          <td style="width: 10%">配送中</td>
        </tr>
      </table>
    </div>

</div>

</template>


<script>
import firebase from "firebase/app";
import "firebase/firestore";
// let db;
let account;

export default {
  data: () => ({
    mattersList: [],
    companyInfo: {},
    askMatters: [],

  }),

  async created() {
    const db = firebase.firestore();
    account = firebase.auth().currentUser;
    const userRef = await db.collection("users").doc(account.uid).get();
    this.companyInfo = userRef.data();

    db.collection("matters")
      .where("status", "==", "entrusted")
      .onSnapshot((querySnapshot) => {
        let matters = [];
        querySnapshot.forEach((doc) => {
          matters.push(doc.data());
        });

        this.askMatters = matters.filter(
          (value) => value.askCompanyID == account.uid
        ); //ログインしてる会社のIDを元に依頼中の案件を抽出
      });

  },

  methods: {

  }

};
</script>


<style scoped>
table {
  width: 100%;
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
