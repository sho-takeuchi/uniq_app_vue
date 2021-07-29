<template>
  <div>
    <h2>案件一覧</h2>
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
        <th style="width: 10%">ボタン</th>
      </tr>
    </table>
    <div v-for="matter in lastMtList" v-bind:key="matter.id">
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
          <td style="width: 10%">
            <v-dialog v-model="dialog" width="1000">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="red lighten-2"
                  dark
                  v-bind="attrs"
                  v-on="on"
                  @click="entrusted(matter.id)"
                >
                  受託する
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="headline grey lighten-2">
                  受託確認画面
                </v-card-title>
                <v-card-text>
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
                    </tr>
                  </table>
                  <table>
                    <tr>
                      <td style="max-width: 300px">
                        {{ entrustedMatter.askCompanyName }}
                      </td>
                      <td style="width: 9%">
                        {{ entrustedMatter.pickupDate }}<br />{{
                          entrustedMatter.pickupTime
                        }}
                      </td>
                      <td style="width: 9%">
                        {{ entrustedMatter.unloadDate }}<br />{{
                          entrustedMatter.unloadTime
                        }}
                      </td>
                      <td style="width: 18%">
                        {{ entrustedMatter.pickupPrefecture
                        }}{{ entrustedMatter.pickupLocation }}
                      </td>
                      <td style="width: 18%">
                        {{ entrustedMatter.unloadPrefecture
                        }}{{ entrustedMatter.unloadLocation }}
                      </td>
                      <td style="width: 9%">
                        {{ entrustedMatter.distance }}kg
                      </td>
                      <td style="width: 8%">{{ entrustedMatter.truckType }}</td>
                      <td style="width: 8%">{{ entrustedMatter.weight }}t</td>
                    </tr>
                  </table>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="
                      dialog = false;
                      decide(entrustedMatter.id);
                    "
                  >
                    受託決定
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>


<script>
import firebase from "firebase/app";
import "firebase/firestore";
let db;
let account;

export default {
  data: () => ({
    matterColectionData: "",
    usersColectionData: [],
    mattersList: [],
    crearMattersList: [],
    entrustedMattersList: [],
    entrustedMatter: [],
    companyInfo: {},
    newCmatterlist: [],
    lastMtList: [],
    dialog: false,
  }),

  async created() {
    db = firebase.firestore();
    account = firebase.auth().currentUser;
    const userRef = await db.collection("users").doc(account.uid).get();
    this.companyInfo = userRef.data();
    const matterColectionData = await db.collection("matters").get();
    let matterId = matterColectionData.docs.map((postDoc) => postDoc.id);

    matterColectionData.forEach((matter) => {
      this.mattersList.push(matter.data());
    });
    for (let i = 0; i < matterId.length; i++) {
      this.mattersList[i]["id"] = matterId[i];
    }

    this.companyInfo["hasTrucks"].forEach((truck) => {
      this.mattersList.forEach((oneMatter) => {
        if (truck == "トラック" && oneMatter["truckType"] == "トラック") {
          this.companyInfo["truckWeight"].forEach((tWeight) => {
            if (tWeight == oneMatter["weight"]) {
              this.crearMattersList.push(oneMatter);
            }
          });
        } else if (
          truck == "レッカー" &&
          oneMatter["truckType"] == "レッカー"
        ) {
          this.crearMattersList.push(oneMatter);
        } else if (
          truck == "クレーン" &&
          oneMatter["truckType"] == "クレーン"
        ) {
          this.crearMattersList.push(oneMatter);
        }
      });
    });

    this.companyInfo["serviceArea"].forEach((serviceArea) => {
      this.crearMattersList.forEach((creaMatter) => {
        if (creaMatter["pickupPrefecture"] == serviceArea) {
          this.newCmatterlist.push(creaMatter); //集荷場所とログイン会社の対応エリアが一致した案件をnewCmatterに代入
        }
      });
    });

    this.companyInfo["serviceArea"].forEach((serviceArea) => {
      this.newCmatterlist.forEach((newCreaMatter) => {
        if (newCreaMatter["unloadPrefecture"] == serviceArea) {
          this.lastMtList.push(newCreaMatter); //最後にログイン会社の対応エリア、車種、重量全てに一致した案件をlastMtListに代入
        }
      });
    });
  },

  methods: {
    async entrusted(id) {
      db = firebase.firestore();
      account = firebase.auth().currentUser;
      const userRef = await db.collection("users").doc(account.uid).get();
      this.companyInfo = userRef.data();
      const matterColectionData = await db.collection("matters").get();
      let matterId = matterColectionData.docs.map((postDoc) => postDoc.id);

      matterColectionData.forEach((matter) => {
        this.entrustedMattersList.push(matter.data());
      });
      for (let i = 0; i < matterId.length; i++) {
        this.entrustedMattersList[i]["id"] = matterId[i];
      }
      this.entrustedMattersList.forEach((enMt) => {
        if (enMt["id"] == id) {
          this.entrustedMatter = enMt;
        }
      });
    },

    async decide(decideId) {
      if (decideId == this.entrustedMatter.id) {
        try {
          db = firebase.firestore();
          account = firebase.auth().currentUser;
          await db.collection("matters").doc(decideId).update({
            id: decideId,
            entrustedCompanyId: account.uid,
            status: "entrusted",
          });
          alert("受託を完了しました");
          this.sendMail();
        } catch (console) {
          alert(console.message);
        }
      }
    },
  },
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
