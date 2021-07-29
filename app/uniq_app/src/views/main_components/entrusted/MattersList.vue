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
      <div v-if="matter.status == 'ask'">
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
                          {{ entrustedMatter.unloadDate }}<br />
                          {{ entrustedMatter.unloadTime }}
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
                        <td style="width: 8%">
                          {{ entrustedMatter.truckType }}
                        </td>
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
    keyIdArray: [],
    dialog: false,
  }),

  //========================================================================
  //案件初期表示用createdメソッド
  //========================================================================
  created() {
    this.getFilterMtatter(); //条件が一致した案件のみを取得
  },

  //========================================================================
  //以下各種メソッド
  //========================================================================
  methods: {
    //========================================================================
    //realTimeChange()更新情報をリアルタイムで反映させるメソッド
    //========================================================================
    realTimeChange() {
      this.lastMtList = [];
      this.companyInfo = {};
      this.keyIdArray = [];
      this.mattersList = [];
      this.crearMattersList = [];
      this.entrustedMattersList = [];
      this.entrustedMatter = [];
      this.usersColectionData = [];
      this.matterColectionData = "";
      this.newCmatterlist = [];
      this.getFilterMtatter();
    },

    //===================================================================================
    //getFilterMtatter()全ての案件とログイン中の会社情報の対応エリア、車両タイプ、重量が一致する案件をフィルタリング
    //====================================================================================
    async getFilterMtatter() {
      const db = firebase.firestore();
      account = firebase.auth().currentUser;
      const userRef = await db.collection("users").doc(account.uid).get();
      this.companyInfo = userRef.data();
      // if (!this.isCompanyInfoSet()) {
      //   return;
      // }
      // それぞれの案件のコレクションIDを各案件フィールドの中にも代入
      const matterColectionData = await db.collection("matters").get();
      matterColectionData.forEach((postDoc) => {
        this.keyIdArray[postDoc.id] = postDoc.data();
      });
      this.mattersList = Object.keys(this.keyIdArray)
        .map((key) => ({ id: key, ...this.keyIdArray[key] }))
        .reduce((a, c) => a.concat([c]), []);

      //対応可能車両の種類と案件の車両の種類が一致するか条件分岐
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
            this.crearMattersList.push(oneMatter); //一致した案件は一旦crearMattersListに代入
          }
        });
      });

      //集荷場所とログイン会社の集荷対応エリアが一致しているか
      this.companyInfo["serviceAreaStart"].forEach((serviceAreaStart) => {
        this.crearMattersList.forEach((creaMatter) => {
          if (creaMatter["pickupPrefecture"] == serviceAreaStart) {
            this.newCmatterlist.push(creaMatter); //集荷場所とログイン会社の集荷対応エリアが一致した案件をnewCmatterに代入
          }
        });
      });

      //荷下ろし場所とログイン会社の荷下ろし対応エリアが一致しているか
      this.companyInfo["serviceAreaGoal"].forEach((serviceAreaGoal) => {
        this.newCmatterlist.forEach((newCreaMatter) => {
          if (newCreaMatter["unloadPrefecture"] == serviceAreaGoal) {
            this.lastMtList.push(newCreaMatter); //最後にログイン会社の荷下ろし対応エリア、車種、重量全てに一致した案件をlastMtListに代入
          }
        });
      });
    },

    //========================================================================
    //entrusted(id)受託するボタンを押してモーダルを表示する時のメソッド
    //========================================================================
    async entrusted(id) {
      db = firebase.firestore();
      const matteRef = await db.collection("matters").doc(id).get();
      this.entrustedMatter = matteRef.data();
      this.entrustedMatter["id"] = matteRef.id;
    },

    //========================================================================
    //decide(decideId)受託決定ボタン押打時メソッド
    //========================================================================
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
          this.realTimeChange();
          alert("受託を完了しました");
          this.sendMail();
        } catch (console) {
          alert(console.message);
        }
      }
    },
    //========================================================================
    //メソッド＿会社情報をセッティングしているか？
    //========================================================================
    isCompanyInfoSet() {
      if (this.companyInfo.serviceAreaStart === undefined) {
        alert(
          "会社情報が設定されていないため、案件一覧が見れません。会社情報を設定してください。"
        );
        this.$router.push("mypage-company-information");
        return false;
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
