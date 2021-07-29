<template>
  <v-container fluid pl-0 pr-0>
    <!--======================================================================-->
    <!-- ヘッダー-->
    <!--======================================================================-->
    <v-app-bar dark app>
      <h1 id="UniqApp" class="mr-3">
        <router-link to="/">Uniq app</router-link>
      </h1>
      <!------------------------------ サインアウトボタン ------------------------------->
      <button @click="signOut()" class="mr-3">Sign out</button>
      <!------------------------------ マイページボタン ------------------------------->
      <button
        v-if="
          userData.userType === 'client' ||
          userData.userType === 'transporter' ||
          userData.userType === 'developer' ||
          userData.userType === 'bothUser'
        "
        @click="
          changeSideMenu('mypage');
          pageTransition('/main-menu/mypage-home');
        "
        :disabled="sideMenuType === 'mypage'"
        :class="{ currentMode: sideMenuType === 'mypage' }"
        class="mr-3"
      >
        マイページ
      </button>
      <!------------------------------依頼ページボタン ------------------------------->
      <button
        v-if="
          userData.userType === 'client' ||
          userData.userType === 'developer' ||
          userData.userType === 'bothUser'
        "
        @click="
          changeSideMenu('ask');
          pageTransition('/main-menu/ask-home');
        "
        :disabled="sideMenuType === 'ask'"
        :class="{ currentMode: sideMenuType === 'ask' }"
        class="mr-3"
      >
        依頼ページ
      </button>
      <!------------------------------ 受託ページボタン ------------------------------->
      <button
        v-if="
          userData.userType === 'transporter' ||
          userData.userType === 'developer' ||
          userData.userType === 'bothUser'
        "
        @click="
          changeSideMenu('entrusted');
          pageTransition('/main-menu/entrusted-home');
        "
        :disabled="sideMenuType === 'entrusted'"
        :class="{ currentMode: sideMenuType === 'entrusted' }"
        class="mr-3"
      >
        受託ページ
      </button>
      <!------------------------------ 管理者ページボタン ------------------------------->
      <button
        v-if="
          userData.userType === 'admin' || userData.userType === 'developer'
        "
        @click="
          changeSideMenu('admin');
          pageTransition('/main-menu/admin-page');
        "
        :disabled="sideMenuType === 'admin'"
        :class="{ currentMode: sideMenuType === 'admin' }"
        class="mr-3"
      >
        管理者ページ
      </button>
      <!------------------------------ 開発者ページボタン ------------------------------->
      <button
        v-if="userData.userType === 'developer'"
        @click="
          changeSideMenu('developer');
          pageTransition('/main-menu/developer-page');
        "
        :disabled="sideMenuType === 'developer'"
        :class="{ currentMode: sideMenuType === 'developer' }"
        class="mr-3"
      >
        開発者ページ
      </button>
      <button class="mr-3">【{{ userData.companyName }}】</button>
    </v-app-bar>
    <!--======================================================================-->
    <!--  サイドメニュー-->
    <!--======================================================================-->
    <div class="side-and-main d-flex mt-10">
      <div class="side-menu">
        <v-list nav dense>
          <v-list-item-group>
            <!-- 共通 -->
            <div v-if="sideMenuType === 'mypage'">
              <v-list-item v-for="link in mypagelinks" :key="link.key">
                <v-list-item-title @click="pageTransition(link.link)">
                  {{ link.linkName }}
                </v-list-item-title>
              </v-list-item>
            </div>
            <!-- 依頼 -->
            <div v-if="sideMenuType === 'ask'">
              <v-list-item v-for="link in asklinks" :key="link.key">
                <v-list-item-title @click="pageTransition(link.link)">
                  {{ link.linkName }}
                </v-list-item-title>
              </v-list-item>
            </div>
            <!-- 受託 -->
            <div v-if="sideMenuType === 'entrusted'">
              <v-list-item v-for="link in entrustedlinks" :key="link.key">
                <v-list-item-title @click="pageTransition(link.link)">
                  {{ link.linkName }}
                </v-list-item-title>
              </v-list-item>
            </div>
            <!-- 管理者 -->
            <div v-if="sideMenuType === 'admin'">
              <v-list-item v-for="link in adminlinks" :key="link.key">
                <v-list-item-title @click="pageTransition(link.link)">
                  {{ link.linkName }}
                </v-list-item-title>
              </v-list-item>
            </div>
            <!-- 開発 -->
            <div v-if="sideMenuType === 'developer'">
              <v-list-item v-for="link in developerlinks" :key="link.key">
                <v-list-item-title @click="pageTransition(link.link)">
                  {{ link.linkName }}
                </v-list-item-title>
              </v-list-item>
            </div>
          </v-list-item-group>
        </v-list>
      </div>
      <!--======================================================================-->
      <!-- メイン部分 -->
      <!--======================================================================-->
      <v-main>
        <router-view />
      </v-main>
    </div>
    <!--======================================================================-->
    <!-- フッター -->
    <!--======================================================================-->
    <v-footer color="primary lighten-1" padless app>
      <v-row justify="center" no-gutters>
        <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
          <strong>created by SRC</strong>
        </v-col>
      </v-row>
    </v-footer>
    <!--■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■-->
    <!--法人番号入力ダイアログ-->
    <!--■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■-->
    <v-dialog
      v-model="companyNumberDialog"
      persistent
      max-width="100%"
      max-height="100%"
    >
      <v-card>
        <v-card-title>
          <span class="headline"> 法人番号と保険番号を入力してください。 </span>
        </v-card-title>
        <!-------------------------------ローディング------------------------------->
        <div v-show="loading">
          <div class="fullview">
            <div class="loading-spacer"></div>
            <vue-loading
              type="spiningDubbles"
              color="#aaa"
              :size="{ width: '100px', height: '100px' }"
            >
            </vue-loading>
          </div>
        </div>
        <!-------------------------------法人番号入力------------------------------->
        <v-text-field
          v-model="companyNumber"
          label="法人番号*"
          required
        ></v-text-field>
        <!-------------------------------保険番号入力------------------------------->
        <v-text-field
          v-model="insuranceNumber"
          label="保険番号*"
          required
        ></v-text-field>
        <!-------------------------------ボタン------------------------------->
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="accessApi()"> 登録 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■-->
    <!--荷主情報入力ダイアログ-->
    <!--■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■-->
    <v-dialog
      v-model="clientFormDialog"
      persistent
      max-width="100%"
      max-height="100%"
    >
      <v-card>
        <v-card-title>
          <span class="headline"> 会社名を入力してください。 </span>
        </v-card-title>
        <!-------------------------------会社名入力------------------------------->
        <v-text-field
          v-model="companyName"
          label="会社名*"
          required
        ></v-text-field>
        <!-------------------------------住所入力------------------------------->
        <v-text-field
          v-model="companyAddress"
          label="住所*"
          required
        ></v-text-field>
        <!-------------------------------担当者入力------------------------------->
        <v-text-field
          v-model="companyStaff"
          label="担当者*"
          required
        ></v-text-field>
        <!-------------------------------連絡先入力------------------------------->
        <v-text-field
          v-model="companyTelephone"
          label="連絡先*"
          required
        ></v-text-field>
        <!-------------------------------ボタン------------------------------->
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="clientRegister()">
            登録
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//インポート
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import firebase from "firebase/app";
import axios from "axios";
import { VueLoading } from "vue-loading-template";
let db;

export default {
  name: "AdminMenu",
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //コンポーネント
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  components: {
    VueLoading,
  },
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //データ
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  data() {
    return {
      name: firebase.auth().currentUser.email,
      userData: {} /* userコレクションデータ */,
      // -----------------------------搬送フォーム-----------------------------
      companyNumber: "" /* 法人番号番号 */,
      insuranceNumber: "" /* 保険番号 */,
      // -----------------------------荷主フォーム-----------------------------
      companyName: "",
      companyAddress: "",
      companyStaff: "",
      companyTelephone: "",
      // -----------------------------サイドメニュー-----------------------------
      sideMenuType: "mypage" /* サイドメニュータイプ */,
      // -----------------------------ダイアログ-----------------------------
      companyNumberDialog: false /* 法人番号入力ダイアログ */,
      clientFormDialog: false /* 荷主入力ダイアログ */,
      // -----------------------------ローディング-----------------------------
      loading: false,
      // -----------------------------マイページ-----------------------------
      mypagelinks: [
        { linkName: "mypage", link: "/main-menu/mypage-home" },
        { linkName: "ダッシュボード", link: "/main-menu/mypage-dashboard" },
        // { linkName: "新規依頼", link: "/main-menu/mypage-new-request" },
        { linkName: "配送状況", link: "/main-menu/mypage-transport-status" },
        { linkName: "履歴", link: "/main-menu/mypage-history" },
        { linkName: "会社情報", link: "/main-menu/mypage-company-information" },
      ],
      // -----------------------------依頼-----------------------------
      asklinks: [
        { linkName: "ask", link: "/main-menu/ask-home" },
        { linkName: "ダッシュボード", link: "/main-menu/ask-dashboard" },
        { linkName: "新規依頼", link: "/main-menu/ask-new-request" },
        { linkName: "配送状況", link: "/main-menu/ask-transport-status" },
        { linkName: "履歴", link: "/main-menu/ask-history" },
        // { linkName: "会社情報", link: "/main-menu/ask-company-information" },
      ],
      // -----------------------------受託-----------------------------
      entrustedlinks: [
        { linkName: "entrusted", link: "/main-menu/entrusted-home" },
        { linkName: "ダッシュボード", link: "/main-menu/entrusted-dashboard" },
        // { linkName: "新規依頼", link: "/main-menu/entrusted-new-request" },
        { linkName: "配送状況", link: "/main-menu/entrusted-transport-status" },
        { linkName: "履歴", link: "/main-menu/entrusted-history" },
        // { linkName: "会社情報", link: "/main-menu/entrusted-company-information" },
        { linkName: "案件一覧", link: "/main-menu/entrusted-matters-list" },
      ],
      // -----------------------------管理-----------------------------
      adminlinks: [
        {
          linkName: "保険番号確認依頼一覧",
          link: "/main-menu/admin-insurance",
        },
      ],
      // -----------------------------開発-----------------------------
      developerlinks: [
        { linkName: "ユーザー管理", link: "/main-menu/developer-user" },
        { linkName: "案件管理", link: "/main-menu/developer-matter" },
      ],
    };
  },
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //クリエイテッド
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  async created() {
    this.makeDomain();
    db = firebase.firestore();
    await this.getUserData(); /* ユーザーデータ取得 */
    // -----------------------------搬送者or両方の場合-----------------------------
    if (
      this.userData.userType === "transporter" ||
      this.userData.userType === "bothUser"
    ) {
      this.companyNumberDialog = this.userData.CorporateNumber
        ? false
        : true; /* 法人番号チェック */
      if (this.companyNumberDialog) {
        return;
      }
      if (
        !this.userData.insuranceNumberData.isChecked &&
        this.userData.CorporateNumber
      ) {
        alert(
          `保険番号の確認中です。【${this.userData.insuranceNumberData.number}】
確認完了のメール到着まで今しばらくお待ちください。
誤って入力された場合は、お手数ですが下記アドレスまでご連絡ください。`
        );
        this.signOut();
      }
      // -----------------------------荷主の場合-----------------------------
    } else if (this.userData.userType === "client") {
      this.clientFormDialog = this.userData.companyName
        ? false
        : true; /* 会社名チェック */
    }
  },
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //メソッド
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  methods: {
    //========================================================================
    //メソッド＿ユーザーデータ取得
    //========================================================================
    async getUserData() {
      const account = firebase.auth().currentUser;
      const userRef = await db.collection("users").doc(account.uid).get();
      this.userData = userRef.data();
    },
    //========================================================================
    //メソッド＿サインアウト
    //========================================================================
    signOut: function () {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/signin");
        });
    },
    //========================================================================
    //メソッド＿ページ遷移
    //========================================================================
    pageTransition(targetLink) {
      this.$router.push(targetLink);
    },
    //========================================================================
    //メソッド＿サイドメニュー切り替え
    //========================================================================
    changeSideMenu(menuType) {
      switch (menuType) {
        case "mypage":
          // ルーティングを遷移する関数
          this.sideMenuType = "mypage";
          break;
        case "ask":
          this.sideMenuType = "ask";
          break;
        case "entrusted":
          this.sideMenuType = "entrusted";
          break;
        case "admin":
          this.sideMenuType = "admin";
          break;
        case "developer":
          this.sideMenuType = "developer";
      }
    },
    //========================================================================
    //メソッド＿法人api取得してユーザー保存
    //========================================================================
    async accessApi() {
      // -----------------------------法人apiからデータ取得-----------------------------
      this.loading = true;
      const postData = new URLSearchParams();
      postData.append("flag", this.dom);
      postData.append("companyNumber", this.companyNumber);
      // "4290001056827"
      const url =
        "https://us-central1-unic-app-7f6c2.cloudfunctions.net/api_requests";
      const companyRefFromApi = await axios.post(url, postData).catch(() => {
        alert("入力された情報から法人データが取得できませんでした。");
        this.signOut();
      });
      const companyDataFromApi = companyRefFromApi.data;
      // -----------------------------apiデータ保存-----------------------------
      const account = firebase.auth().currentUser;
      const userFs = await db.collection("users").doc(account.uid);
      const mergedAddress =
        companyDataFromApi.prefectureName +
        companyDataFromApi.cityName +
        companyDataFromApi.streetNumber;
      await userFs.set(
        {
          CorporateNumber: companyDataFromApi.corporateNumber,
          companyName: companyDataFromApi.name,
          companyAddress: mergedAddress,
          insuranceNumberData: {
            number: this.insuranceNumber,
            isChecked: false,
          },
        },
        { merge: true }
      );

      alert(
        "法人情報の確認が取れました。保険番号の確認が取れ次第、メールにてご連絡いたしますので、今しばらくお待ちください。"
      );
      await this.sendMail(account.uid);
      this.signOut();
    },
    async sendMail(uid) {
      console.log("メール送信");
      console.log(uid);
      const functions = firebase.functions();
      const userRef = await db.collection("users").doc(uid).get();
      const userData = userRef.data();
      const mailer = functions.httpsCallable("sendMail");
      await mailer({
        to: "uniqappinfomation@gmail.com",
        subject: "保険番号の確認依頼が到着しました。",
        text: `${userData.companyName}:${userData.email}`,
      });
    },
    //========================================================================
    //メソッド＿荷主情報登録
    //========================================================================
    async clientRegister() {
      const account = firebase.auth().currentUser;
      const userFs = await db.collection("users").doc(account.uid);
      userFs.set(
        {
          companyName: this.companyName,
          companyAddress: this.companyAddress,
          companyStaff: this.companyStaff,
          companyTelephone: this.companyTelephone,
        },
        { merge: true }
      );
      alert("会社情報を入力しました。");
      this.clientFormDialog = false;
    },
    //========================================================================
    //メソッド＿ドメイン切り替え
    //========================================================================
    makeDomain() {
      var dom = document.domain;
      if (dom == "localhost") {
        this.dom = "http://" + dom + ":8080";
        /* 自分のローカル環境に合わせる */
      } else {
        this.dom = "https://" + dom;
      }
    },
  },
};
</script>

<style scoped>
.side-and-main {
  height: 100%;
}
.side-menu {
  border: solid 1px;
  width: 200px;
  height: 100%;
}
.container {
  height: 100%;
}
/*選択中のヘッダーリンク*/
.currentMode {
  color: red;
}
/*ローディング*/
.fullview {
  width: 100%;
  height: 100%;
  background: none;
  position: fixed;
  top: 0;
  left: 0;
}
.loading-spacer {
  height: 30%;
}
</style>
