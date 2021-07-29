<template>
  <div>
    <v-row justify="center">
      <v-btn @click="mapDialog_pickup = true"> 新規依頼 </v-btn>
      <!--======================================================================-->
      <!--  新規依頼ダイアログ -->
      <!--======================================================================-->
      <v-dialog v-model="askDialog" persistent max-width="600px">
        <v-card>
          <v-card-title class="headline"> 新規依頼 </v-card-title>
          <v-card-text
            >依頼する内容を入力してください
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="select"
                    :items="items"
                    item-text="state"
                    label="車種"
                    persistent-hint
                    return-object
                  ></v-select>
                </v-col>
                <div v-if="select.id === 'truck'">
                  <v-col cols="12">
                    <v-select
                      v-model="truckType"
                      :items="truckItems"
                      item-text="truckState"
                      label="トラックの種類"
                      persistent-hint
                      return-object
                    ></v-select>
                  </v-col>
                  <div v-if="truckType.id !== undefined">
                    <v-col cols="12">
                      <v-select
                        v-model="weight"
                        :items="weightItems"
                        item-text="weightState"
                        label="積載量t(トン)*"
                        persistent-hint
                        return-object
                      ></v-select>
                    </v-col>
                  </div>
                </div>
                <div v-if="select.id === 'uniq' || select.id === 'wrecker'">
                  <v-col cols="12" style="width: 270px">
                    <v-text-field
                      v-model="formData.howLongHeight"
                      label="何メートル吊り上げますか？"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" style="width: 270px">
                    <v-text-field
                      v-model="formData.cargoWeight"
                      label="荷物の重さは何キロですか？"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </div>
                <!-- <div
                  style="height: 0px"
                  v-else-if="select.id === 'wrecker'"
                ></div>
                <div
                  style="height: 0px"
                  v-else-if="select.id === 'uniq'"
                ></div> -->
                <!-------------------------------集荷住所 ------------------------------->
                <v-col cols="12">
                  <h3>
                    集荷場所:
                    {{ pickupPrefecturesSelect.pre }}
                    {{ formData.pickupLocation }}
                  </h3>
                </v-col>
                <!-------------------------------集荷日 ------------------------------->

                <v-col cols="12">
                  <v-text-field
                    v-model="formData.pickupDate"
                    label="集荷日*"
                    required
                    placeholder="右のカレンダーから日付をお選びください。"
                  >
                    <template v-slot:append>
                      <date-picker v-model="formData.pickupDate" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.pickupTime"
                    label="集荷時間*"
                    required
                    placeholder="右のボックスより時間をお選びください。"
                  >
                    <template v-slot:append-outer>
                      <vue-timepicker
                        v-model="formData.pickupTime"
                        format="HH:mm"
                        hour-label="時"
                        minute-label="分"
                        second-label="秒"
                        apm-label="区分"
                        am-text="午前"
                        pm-text="午後"
                        minute-interval="5"
                        advanced-keyboard
                        close-on-complete
                        placeholder="時間を入力"
                      ></vue-timepicker>
                    </template>
                  </v-text-field>
                </v-col>
                <!-------------------------------荷下ろし住所 ------------------------------->
                <v-col cols="12">
                  <h3>
                    荷下ろし場所:
                    {{ unloadPrefecturesSelect.pre2 }}
                    {{ formData.unloadLocation }}
                  </h3>
                </v-col>
                <!-------------------------------荷下ろし日 ------------------------------->
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.unloadDate"
                    label="荷下ろし日*"
                    required
                  >
                    <template v-slot:append-outer>
                      <date-picker v-model="formData.unloadDate" />
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.unloadTime"
                    label="荷下ろし時間*"
                    required
                    placeholder="右のボックスより時間をお選びください。"
                  >
                    <template v-slot:append-outer>
                      <vue-timepicker
                        v-model="formData.unloadTime"
                        format="HH:mm"
                        hour-label="時"
                        minute-label="分"
                        second-label="秒"
                        apm-label="区分"
                        am-text="午前"
                        pm-text="午後"
                        minute-interval="5"
                        advanced-keyboard
                        close-on-complete
                        placeholder="時間を入力"
                      ></vue-timepicker>
                    </template>
                  </v-text-field>
                </v-col>
                <!-------------------------------距離 ------------------------------->
                <v-col cols="12">
                  <h3>
                    距離:
                    {{ formData.distance }}
                  </h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <!-------------------------------ボタン ------------------------------->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="askDialog = false">
              キャンセル
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="
                askDialog = false;
                ask();
              "
            >
              依頼する
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!--======================================================================-->
    <!-- 一覧テーブル-->
    <!--======================================================================-->
    <h3>あなたの会社が依頼した案件一覧</h3>
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
    <div v-for="matter in askMatters" v-bind:key="matter.id">
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
              <p>{{ matter.distance }}<br /></p>
            </td>
            <td style="width: 8%" label="車種">
              <p>{{ matter.modelOfCar }}<br /></p>
            </td>
            <td style="width: 8%" label="重量">
              <div v-if="matter.weight != ''">
                <p>{{ matter.weight }}<br /></p>
              </div>
              <div v-else-if="matter.weight == ''">
                <p>{{ "重量なし" }}<br /></p>
              </div>
            </td>

            <td style="width: 10%">
              <v-row
                justify="center"
                style="height: 50px; margin: 0px !important"
              >
                <!--======================================================================-->
                <!--  編集ダイアログ-->
                <!--======================================================================-->
                <v-dialog
                  v-model="editDialog"
                  persistent
                  :retain-focus="false"
                  max-width="600px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      v-bind="attrs"
                      v-on="on"
                      @click="edit(matter.id)"
                    >
                      編集
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">編集画面</span>
                    </v-card-title>
                    <v-card-text
                      >編集する内容を入力してください
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-select
                              v-model="editSelect"
                              :items="editItems"
                              item-text="state"
                              label="車種"
                              persistent-hint
                              return-object
                            ></v-select>
                          </v-col>
                          <div
                            v-if="
                              editSelect === 'トラック' ||
                              editSelect.id === 'truck'
                            "
                          >
                            <v-col cols="12">
                              <v-text-field
                                v-model="editFormData.weight"
                                label="物量t(トン)*"
                                type="number"
                                required
                                placeholder="数字を入力してください"
                              ></v-text-field>
                            </v-col>
                          </div>
                          <div
                            style="height: 0px"
                            v-else-if="
                              editSelect === 'レッカー' ||
                              editSelect.id === 'wrecker'
                            "
                          ></div>
                          <div
                            style="height: 0px"
                            v-else-if="
                              editSelect === 'クレーン' ||
                              editSelect.id === 'uniq'
                            "
                          ></div>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editFormData.pickupDate"
                              label="集荷日*"
                              required
                              placeholder="右のカレンダーから日付をお選びください。"
                            >
                              <template v-slot:append>
                                <date-picker
                                  v-model="editFormData.pickupDate"
                                />
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editFormData.pickupTime"
                              label="集荷時間*"
                              required
                              placeholder="右のボックスより時間をお選びください。"
                            >
                              <template v-slot:append-outer>
                                <vue-timepicker
                                  v-model="editFormData.pickupTime"
                                  format="HH:mm"
                                  hour-label="時"
                                  minute-label="分"
                                  second-label="秒"
                                  apm-label="区分"
                                  am-text="午前"
                                  pm-text="午後"
                                  minute-interval="5"
                                  advanced-keyboard
                                  close-on-complete
                                  placeholder="時間を入力"
                                ></vue-timepicker>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-select
                              v-model="editPickupPrefecturesSelect"
                              :items="editPickupPrefecturesItems"
                              item-text="pre"
                              label="集荷都道府県"
                              persistent-hint
                              return-object
                            ></v-select>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editFormData.pickupLocation"
                              label="集荷住所*"
                              required
                              placeholder="都道府県以降の住所を入力してください"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editFormData.unloadDate"
                              label="荷下ろし日*"
                              required
                            >
                              <template v-slot:append-outer>
                                <date-picker
                                  v-model="editFormData.unloadDate"
                                />
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editFormData.unloadTime"
                              label="荷下ろし時間*"
                              required
                              placeholder="右のボックスより時間をお選びください。"
                            >
                              <template v-slot:append-outer>
                                <vue-timepicker
                                  v-model="editFormData.unloadTime"
                                  format="HH:mm"
                                  hour-label="時"
                                  minute-label="分"
                                  second-label="秒"
                                  apm-label="区分"
                                  am-text="午前"
                                  pm-text="午後"
                                  minute-interval="5"
                                  advanced-keyboard
                                  close-on-complete
                                  placeholder="時間を入力"
                                ></vue-timepicker>
                              </template>
                            </v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-select
                              v-model="editUnloadPrefecturesSelect"
                              :items="editUnloadPrefecturesItems"
                              item-text="pre2"
                              label="荷下ろし都道府県"
                              persistent-hint
                              return-object
                            ></v-select>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              v-model="editFormData.unloadLocation"
                              label="荷下ろし場所*"
                              required
                              placeholder="住所を入力してください"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="editDialog = false"
                      >
                        キャンセル
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="
                          editDialog = false;
                          editSave(matter.id);
                        "
                      >
                        保存
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
              <v-btn
                style="color: white; background: #dc3545"
                @click="logicalDelete(matter.id)"
              >
                削除
              </v-btn>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!--======================================================================-->
    <!-- 集荷 入力 ダイアログ -->
    <!--======================================================================-->
    <v-dialog v-model="mapDialog_pickup" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> 集荷地の住所を入力してください。 </span>
        </v-card-title>
        <v-col cols="12">
          <v-select
            v-model="pickupPrefecturesSelect"
            :items="pickupPrefecturesItems"
            item-text="pre"
            label="都道府県"
            persistent-hint
            return-object
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.pickupLocation"
            label="都道府県以降の住所*"
            required
            placeholder="都道府県以降の住所を入力してください"
          ></v-text-field>
          <v-btn @click="checkMap('pickup')">地図を確認する</v-btn>
        </v-col>
        <div id="map" style="width: 600px; height: 500px"></div>
        <!------------------------------- ボタン ------------------------------->
        <v-btn
          @click="
            mapDialog = false;
            resetForm();
          "
          >キャンセル</v-btn
        >
        <v-btn
          @click="
            mapDialog_pickup = false;
            mapDialog_unload = true;
          "
        >
          配送地設定に進む</v-btn
        >
      </v-card>
    </v-dialog>
    <!--======================================================================-->
    <!-- 配送 入力 ダイアログ -->
    <!--======================================================================-->
    <v-dialog v-model="mapDialog_unload" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline"> 配送地の住所を入力してください。 </span>
        </v-card-title>
        <v-col cols="12">
          <v-select
            v-model="unloadPrefecturesSelect"
            :items="unloadPrefecturesItems"
            item-text="pre2"
            label="都道府県"
            persistent-hint
            return-object
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.unloadLocation"
            label="都道府県以降の住所*"
            required
            placeholder="都道府県以降の住所を入力してください"
          ></v-text-field>
          <v-btn @click="checkMap('unload')">地図を確認する</v-btn>
        </v-col>
        <div id="map2" style="width: 600px; height: 500px"></div>
        <!------------------------------- ボタン ------------------------------->
        <v-btn
          @click="
            mapDialog = false;
            resetForm();
          "
          >キャンセル</v-btn
        >
        <v-btn
          @click="
            mapDialog_unload = false;
            mapDialog_route = true;
          "
        >
          ルートと距離を確認する</v-btn
        >
      </v-card>
    </v-dialog>

    <!--======================================================================-->
    <!-- 距離 ダイアログ -->
    <!--======================================================================-->
    <v-dialog v-model="mapDialog_route" persistent max-width="600px">
      <v-card>
        <v-btn @click="checkRoute()">ルートと距離を表示</v-btn>
        {{ now }}
        <div id="map3" style="width: 600px; height: 500px"></div>
        <!------------------------------- ボタン ------------------------------->
        <v-btn
          @click="
            mapDialog = false;
            resetForm();
          "
          >キャンセル</v-btn
        >
        <v-btn
          @click="
            mapDialog_route = false;
            setDistance();
            askDialog = true;
          "
        >
          ルートと距離を表示</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import DatePicker from "../DatePicker";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
let db;
let account;
let pickupPosition;
let unloadPosition;
let preDistance;

export default {
  // name: "NewRequest",
  components: {
    DatePicker,
    "vue-timepicker": VueTimepicker,
  },
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //データ
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  data: () => ({
    picker: new Date().toISOString().substr(0, 10),
    companyInfo: "",
    select: "",
    mapDialog_pickup: false,
    mapDialog_unload: false,
    mapDialog_route: false,
    mailList: [] /* メール送信リスト */,
    items: [
      { state: "トラック", id: "truck" },
      { state: "ユニック(クレーン)", id: "uniq" },
      { state: "レッカー", id: "wrecker" },
    ],
    editSelect: "",
    editItems: [
      { state: "トラック", id: "truck" },
      { state: "ユニック(クレーン)", id: "uniq" },
      { state: "レッカー", id: "wrecker" },
    ],
    truckType: "",
    truckItems: [
      { truckState: "バン", id: "van" },
      { truckState: "バン/ゲート", id: "van/gate" },
      { truckState: "ウイング", id: "wing" },
      { truckState: "ウイング/ゲート", id: "wing/gate" },
      { truckState: "平", id: "flat" },
      { truckState: "平/ゲート", id: "flat/gate" },
    ],
    weight: "",
    weightItems: [
      { weightState: "2", id: "2t" },
      { weightState: "3", id: "3t" },
      { weightState: "4", id: "4t" },
      { weightState: "7", id: "7t" },
      { weightState: "8", id: "8t" },
      { weightState: "10", id: "10t" },
      { weightState: "10t以上", id: "Over10t" },
    ],

    pickupPrefecturesSelect: "",
    pickupPrefecturesItems: [
      { pre: "青森県", id: "aomori" },
      { pre: "岩手県", id: "Iwate" },
      { pre: "宮城県", id: "Miyagi" },
      { pre: "秋田県", id: "Akita" },
      { pre: "山形県", id: "Yamagata" },
      { pre: "福島県", id: "Fukushima" },
      { pre: "茨城県", id: "Ibaraki" },
      { pre: "栃木県", id: "Tochigi" },
      { pre: "群馬県", id: "Gunma" },
      { pre: "埼玉県", id: "Saitama" },
      { pre: "千葉県", id: "Chiba" },
      { pre: "東京都", id: "Tokyo" },
      { pre: "神奈川県", id: "Kanagawa" },
      { pre: "新潟県", id: "Niigata" },
      { pre: "富山県", id: "Toyama" },
      { pre: "石川県", id: "Ishikawa" },
      { pre: "福井県", id: "Fukui" },
      { pre: "山梨県", id: "Yamanashi" },
      { pre: "長野県", id: "Nagano" },
      { pre: "岐阜県", id: "Gifu" },
      { pre: "静岡県", id: "Shizuoka" },
      { pre: "愛知県", id: "Aichi" },
      { pre: "三重県", id: "Mie" },
      { pre: "滋賀県", id: "Shiga" },
      { pre: "京都府", id: "Kyoto" },
      { pre: "大阪府", id: "Osaka" },
      { pre: "兵庫県", id: "Hyogo" },
      { pre: "奈良県", id: "Nara" },
      { pre: "和歌山県", id: "Wakayama" },
      { pre: "鳥取県", id: "Tottori" },
      { pre: "島根県", id: "Shimane" },
      { pre: "岡山県", id: "Okayama" },
      { pre: "広島県", id: "Hiroshima" },
      { pre: "山口県", id: "Yamaguchi" },
      { pre: "徳島県", id: "Tokushima" },
      { pre: "香川県", id: "Kagawa" },
      { pre: "愛媛県", id: "Ehime" },
      { pre: "高知県", id: "Kochi" },
      { pre: "福岡県", id: "Fukuoka" },
      { pre: "佐賀県", id: "Saga" },
      { pre: "長崎県", id: "Nagasaki" },
      { pre: "熊本県", id: "Kumamoto" },
      { pre: "大分県", id: "Oita" },
      { pre: "宮崎県", id: "Miyazaki" },
      { pre: "鹿児島県", id: "Kagoshima" },
      { pre: "沖縄県", id: "Okinawa" },
    ],
    unloadPrefecturesSelect: "",
    unloadPrefecturesItems: [
      { pre2: "青森県", id: "aomori" },
      { pre2: "岩手県", id: "Iwate" },
      { pre2: "宮城県", id: "Miyagi" },
      { pre2: "秋田県", id: "Akita" },
      { pre2: "山形県", id: "Yamagata" },
      { pre2: "福島県", id: "Fukushima" },
      { pre2: "茨城県", id: "Ibaraki" },
      { pre2: "栃木県", id: "Tochigi" },
      { pre2: "群馬県", id: "Gunma" },
      { pre2: "埼玉県", id: "Saitama" },
      { pre2: "千葉県", id: "Chiba" },
      { pre2: "東京都", id: "Tokyo" },
      { pre2: "神奈川県", id: "Kanagawa" },
      { pre2: "新潟県", id: "Niigata" },
      { pre2: "富山県", id: "Toyama" },
      { pre2: "石川県", id: "Ishikawa" },
      { pre2: "福井県", id: "Fukui" },
      { pre2: "山梨県", id: "Yamanashi" },
      { pre2: "長野県", id: "Nagano" },
      { pre2: "岐阜県", id: "Gifu" },
      { pre2: "静岡県", id: "Shizuoka" },
      { pre2: "愛知県", id: "Aichi" },
      { pre2: "三重県", id: "Mie" },
      { pre2: "滋賀県", id: "Shiga" },
      { pre2: "京都府", id: "Kyoto" },
      { pre2: "大阪府", id: "Osaka" },
      { pre2: "兵庫県", id: "Hyogo" },
      { pre2: "奈良県", id: "Nara" },
      { pre2: "和歌山県", id: "Wakayama" },
      { pre2: "鳥取県", id: "Tottori" },
      { pre2: "島根県", id: "Shimane" },
      { pre2: "岡山県", id: "Okayama" },
      { pre2: "広島県", id: "Hiroshima" },
      { pre2: "山口県", id: "Yamaguchi" },
      { pre2: "徳島県", id: "Tokushima" },
      { pre2: "香川県", id: "Kagawa" },
      { pre2: "愛媛県", id: "Ehime" },
      { pre2: "高知県", id: "Kochi" },
      { pre2: "福岡県", id: "Fukuoka" },
      { pre2: "佐賀県", id: "Saga" },
      { pre2: "長崎県", id: "Nagasaki" },
      { pre2: "熊本県", id: "Kumamoto" },
      { pre2: "大分県", id: "Oita" },
      { pre2: "宮崎県", id: "Miyazaki" },
      { pre2: "鹿児島県", id: "Kagoshima" },
      { pre2: "沖縄県", id: "Okinawa" },
    ],
    editPickupPrefecturesSelect: "",
    editPickupPrefecturesItems: [
      { pre: "青森県", id: "aomori" },
      { pre: "岩手県", id: "Iwate" },
      { pre: "宮城県", id: "Miyagi" },
      { pre: "秋田県", id: "Akita" },
      { pre: "山形県", id: "Yamagata" },
      { pre: "福島県", id: "Fukushima" },
      { pre: "茨城県", id: "Ibaraki" },
      { pre: "栃木県", id: "Tochigi" },
      { pre: "群馬県", id: "Gunma" },
      { pre: "埼玉県", id: "Saitama" },
      { pre: "千葉県", id: "Chiba" },
      { pre: "東京都", id: "Tokyo" },
      { pre: "神奈川県", id: "Kanagawa" },
      { pre: "新潟県", id: "Niigata" },
      { pre: "富山県", id: "Toyama" },
      { pre: "石川県", id: "Ishikawa" },
      { pre: "福井県", id: "Fukui" },
      { pre: "山梨県", id: "Yamanashi" },
      { pre: "長野県", id: "Nagano" },
      { pre: "岐阜県", id: "Gifu" },
      { pre: "静岡県", id: "Shizuoka" },
      { pre: "愛知県", id: "Aichi" },
      { pre: "三重県", id: "Mie" },
      { pre: "滋賀県", id: "Shiga" },
      { pre: "京都府", id: "Kyoto" },
      { pre: "大阪府", id: "Osaka" },
      { pre: "兵庫県", id: "Hyogo" },
      { pre: "奈良県", id: "Nara" },
      { pre: "和歌山県", id: "Wakayama" },
      { pre: "鳥取県", id: "Tottori" },
      { pre: "島根県", id: "Shimane" },
      { pre: "岡山県", id: "Okayama" },
      { pre: "広島県", id: "Hiroshima" },
      { pre: "山口県", id: "Yamaguchi" },
      { pre: "徳島県", id: "Tokushima" },
      { pre: "香川県", id: "Kagawa" },
      { pre: "愛媛県", id: "Ehime" },
      { pre: "高知県", id: "Kochi" },
      { pre: "福岡県", id: "Fukuoka" },
      { pre: "佐賀県", id: "Saga" },
      { pre: "長崎県", id: "Nagasaki" },
      { pre: "熊本県", id: "Kumamoto" },
      { pre: "大分県", id: "Oita" },
      { pre: "宮崎県", id: "Miyazaki" },
      { pre: "鹿児島県", id: "Kagoshima" },
      { pre: "沖縄県", id: "Okinawa" },
    ],
    editUnloadPrefecturesSelect: "",
    editUnloadPrefecturesItems: [
      { pre2: "青森県", id: "aomori" },
      { pre2: "岩手県", id: "Iwate" },
      { pre2: "宮城県", id: "Miyagi" },
      { pre2: "秋田県", id: "Akita" },
      { pre2: "山形県", id: "Yamagata" },
      { pre2: "福島県", id: "Fukushima" },
      { pre2: "茨城県", id: "Ibaraki" },
      { pre2: "栃木県", id: "Tochigi" },
      { pre2: "群馬県", id: "Gunma" },
      { pre2: "埼玉県", id: "Saitama" },
      { pre2: "千葉県", id: "Chiba" },
      { pre2: "東京都", id: "Tokyo" },
      { pre2: "神奈川県", id: "Kanagawa" },
      { pre2: "新潟県", id: "Niigata" },
      { pre2: "富山県", id: "Toyama" },
      { pre2: "石川県", id: "Ishikawa" },
      { pre2: "福井県", id: "Fukui" },
      { pre2: "山梨県", id: "Yamanashi" },
      { pre2: "長野県", id: "Nagano" },
      { pre2: "岐阜県", id: "Gifu" },
      { pre2: "静岡県", id: "Shizuoka" },
      { pre2: "愛知県", id: "Aichi" },
      { pre2: "三重県", id: "Mie" },
      { pre2: "滋賀県", id: "Shiga" },
      { pre2: "京都府", id: "Kyoto" },
      { pre2: "大阪府", id: "Osaka" },
      { pre2: "兵庫県", id: "Hyogo" },
      { pre2: "奈良県", id: "Nara" },
      { pre2: "和歌山県", id: "Wakayama" },
      { pre2: "鳥取県", id: "Tottori" },
      { pre2: "島根県", id: "Shimane" },
      { pre2: "岡山県", id: "Okayama" },
      { pre2: "広島県", id: "Hiroshima" },
      { pre2: "山口県", id: "Yamaguchi" },
      { pre2: "徳島県", id: "Tokushima" },
      { pre2: "香川県", id: "Kagawa" },
      { pre2: "愛媛県", id: "Ehime" },
      { pre2: "高知県", id: "Kochi" },
      { pre2: "福岡県", id: "Fukuoka" },
      { pre2: "佐賀県", id: "Saga" },
      { pre2: "長崎県", id: "Nagasaki" },
      { pre2: "熊本県", id: "Kumamoto" },
      { pre2: "大分県", id: "Oita" },
      { pre2: "宮崎県", id: "Miyazaki" },
      { pre2: "鹿児島県", id: "Kagoshima" },
      { pre2: "沖縄県", id: "Okinawa" },
    ],
    formData: {
      askCompanyID: "",
      askCompanyName: "",
      pickupDate: "",
      pickupTime: "",
      pickupLocation: "",
      unloadDate: "",
      unloadTime: "",
      unloadLocation: "",
      howLongHeight: "",
      cargoWeight: "",
      distance: "",
    },
    editFormData: {
      askCompanyID: "",
      askCompanyName: "",
      weight: "",
      pickupDate: "",
      pickupTime: "",
      pickupLocation: "",
      unloadDate: "",
      unloadTime: "",
      unloadLocation: "",
    },
    toMails: [
      // "uniqappinfomation@gmail.com",
      // "pgymlsho19128@gmail.com",
      // "mdmkgift@gmail.com",
    ],
    keyIdArray: [],
    askMatters: [],
    editDialog: false,
    askDialog: false,
    matters: [],
  }),
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //マウンテッド
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  mounted() {
    let script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDLklKnRc5oCoIlklBzWDPkfAe9RAa7Ia0&libraries=places";
    script.async = true;
    document.head.appendChild(script);

    // ----------------------------- マップ描写-----------------------------
    window.renderMap = (totalAddress, type) => {
      let target;
      var geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ address: totalAddress }, function (results, status) {
        if (status === "OK" && results[0]) {
          if (type === "pickup") {
            target = document.getElementById("map"); //マップを表示する要素を指定
            pickupPosition = [
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng(),
            ];
          } else if (type === "unload") {
            target = document.getElementById("map2"); //マップを表示する要素を指定
            unloadPosition = [
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng(),
            ];
          }

          var map = new window.google.maps.Map(target, {
            center: results[0].geometry.location,
            zoom: 18,
          });

          new window.google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
          });
        } else {
          //住所が存在しない場合の処理
          alert("住所が正しくないか存在しません。");
          target.style.display = "none";
        }
      });
    };
    // -----------------------------ルート描写 -----------------------------
    window.renderRoute = () => {
      var pickupPoints = new window.google.maps.LatLng(
        pickupPosition[0],
        pickupPosition[1]
      );
      var unloadPoints = new window.google.maps.LatLng(
        unloadPosition[0],
        unloadPosition[1]
      );
      var map = new window.google.maps.Map(document.getElementById("map3"), {
        zoom: 17,
        center: pickupPoints,
      });

      var directionsService = new window.google.maps.DirectionsService();
      var directionsRenderer = new window.google.maps.DirectionsRenderer();

      var request = {
        origin: pickupPoints, //スタート地点
        destination: unloadPoints, //ゴール地点
        travelMode: window.google.maps.DirectionsTravelMode.DRIVING, //移動手段車
        avoidHighways: true, //高速道路除外
        avoidTolls: true, //有料区間除外
      };

      directionsService.route(request, function (result, status) {
        preDistance = result.routes[0].legs[0].distance.text;
        alert(`距離は${preDistance}です。
googlemapから距離を算出しています。
経路については下道となります。`);

        if (status == window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setOptions({
            preserveViewport: false, //ズーム率を変更してルート全体を表示しない
          });
          // ルート検索の結果を地図上に描画
          directionsRenderer.setDirections(result);
          directionsRenderer.setMap(map);
        }
      });
    };
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    // 【memo】 https://www.google-mapi.com/samples/route-guidance/
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  },
  created() {
    this.getFilterMtatter();
  },
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //メソッド
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  methods: {
    async getFilterMtatter() {
      db = firebase.firestore();
      account = firebase.auth().currentUser;
      //========================================================================
      //依頼中＆ログインしてる会社のIDと一致する依頼案件を取得
      //========================================================================
      db.collection("matters")
        .where("status", "==", "ask")
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // this.keyIdArray = [];
            this.keyIdArray[doc.id] = doc.data();
            let matters = [];
            matters = Object.keys(this.keyIdArray)
              .map((key) => ({ id: key, ...this.keyIdArray[key] }))
              .reduce((a, c) => a.concat([c]), []);

            this.askMatters = matters.filter(
              (value) => value.askCompanyID == account.uid
            ); //ログインしてる会社のIDと一致する依頼案件を抽出
          });
        });
    },
    //========================================================================
    //メソッド＿集荷地図確認
    //========================================================================
    checkMap(type) {
      if (type === "pickup") {
        let totalAddress =
          this.pickupPrefecturesSelect.pre + this.formData.pickupLocation;
        window.renderMap(totalAddress, type);
      } else if (type === "unload") {
        let totalAddress =
          this.unloadPrefecturesSelect.pre2 + this.formData.unloadLocation;
        window.renderMap(totalAddress, type);
      }
    },
    // -----------------------------ルートチェッック-----------------------------
    checkRoute() {
      window.renderRoute();
    },
    // -----------------------------距離格納-----------------------------
    setDistance() {
      this.formData.distance = preDistance;
    },
    //========================================================================
    //メソッド＿依頼
    //========================================================================
    async ask() {
      try {
        db = firebase.firestore();
        account = firebase.auth().currentUser;
        const userRef = await db.collection("users").doc(account.uid).get();
        this.companyInfo = userRef.data();
        this.formData.askCompanyName = this.companyInfo.companyName;
        // if (
        //   this.select.state == "レッカー" ||
        //   this.select.state == "クレーン"
        // ) {
        //   //トラック以外は重量なしにする
        //   this.formData.weight = "";
        // }

        if (this.select.state == "トラック") {
          this.select = this.truckType.truckState;
          this.weight = this.weight.weightState;
        } else {
          this.select = this.select.state;
          this.weight = "";
        }
        console.log(this.weight);
        console.log(this.weight.weightState);

        await db.collection("matters").doc().set({
          status: "ask",
          askCompanyID: account.uid,
          askCompanyName: this.formData.askCompanyName,
          weight: this.weight,
          howLongHeight: this.formData.howLongHeight,
          cargoWeight: this.formData.cargoWeight,
          modelOfCar: this.select,
          pickupDate: this.formData.pickupDate,
          pickupTime: this.formData.pickupTime,
          pickupPrefecture: this.pickupPrefecturesSelect.pre,
          pickupLocation: this.formData.pickupLocation,
          unloadDate: this.formData.unloadDate,
          unloadTime: this.formData.unloadTime,
          unloadPrefecture: this.unloadPrefecturesSelect.pre2,
          unloadLocation: this.formData.unloadLocation,
          distance: this.formData.distance,
        });
        this.resetForm();
        alert("登録しました");
        await this.makeToMailList();
        // this.sendMail();
      } catch (console) {
        alert(console.message);
      }
    },
    //========================================================================
    //メソッド＿送信リスト
    //========================================================================
    async makeToMailList() {
      const allUsers = await db
        .collection("users")
        .where("userType", "in", ["transporter", "bothUser"])
        .get();
      allUsers.forEach((user) => {
        this.toMails.push(user.data().email);
        // if(user.){
        // // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // // 【todo】https://keizokuma.com/js-array-all-exists/
        // // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // }};
      });
    },
    //========================================================================
    //メソッド＿メール送信
    //========================================================================
    async sendMail() {
      const functions = firebase.functions();
      const mailer = functions.httpsCallable("sendMail");
      mailer({
        to: this.toMails,
        subject: `御社にマッチする新規依頼がありました!`,
        text: `車種:${this.select.state}
物量:${this.formData.weight}t

集荷日:${this.formData.pickupDate}
集荷時間:${this.formData.pickupTime}
集荷県:${this.pickupPrefecturesSelect.pre}
集荷住所:${this.formData.pickupLocation}

荷下ろし日:${this.formData.unloadDate}
荷下ろし時間:${this.formData.unloadTime}
荷下ろし県:${this.unloadPrefecturesSelect.pre2}
荷下ろし住所:${this.formData.unloadLocation}
      `,
      });
      this.resetForm();
    },
    //========================================================================
    //メソッド＿フォームリセット
    //========================================================================
    resetForm() {
      this.pickupPrefecturesSelect = "";
      this.editUnloadPrefecturesSelect = "";
      this.formData = {
        askCompanyID: "",
        askCompanyName: "",
        weight: "",
        pickupDate: "",
        pickupTime: "",
        pickupLocation: "",
        unloadDate: "",
        unloadTime: "",
        unloadLocation: "",
      };
      this.mapDialogType = "new_unload";
    },
    //========================================================================
    //メソッド＿編集
    //========================================================================
    async edit(matterId) {
      db = firebase.firestore();
      const matterRef = await db.collection("matters").doc(matterId).get();
      let matterInfo = {};
      matterInfo = matterRef.data();
      this.editFormData.askCompanyID = matterInfo.askCompanyID;
      this.editFormData.askCompanyName = matterInfo.askCompanyName;
      this.editSelect = matterInfo.modelOfCar;
      this.editFormData.weight = matterInfo.weight;
      this.editFormData.pickupDate = matterInfo.pickupDate;
      this.editFormData.pickupTime = matterInfo.pickupTime;
      this.editPickupPrefecturesSelect = matterInfo.pickupPrefecture;
      this.editFormData.pickupLocation = matterInfo.pickupLocation;
      this.editFormData.unloadDate = matterInfo.unloadDate;
      this.editFormData.unloadTime = matterInfo.unloadTime;
      this.editUnloadPrefecturesSelect = matterInfo.unloadPrefecture;
      this.editFormData.unloadLocation = matterInfo.unloadLocation;
    },
    async editSave(matterId) {
      if (this.editPickupPrefecturesSelect.pre !== undefined) {
        //集荷場所を変更した場合の処理
        this.editPickupPrefecturesSelect = this.editPickupPrefecturesSelect.pre;
      }
      if (this.editUnloadPrefecturesSelect.pre2 !== undefined) {
        //荷下ろし場所を変更した場合の処理
        this.editUnloadPrefecturesSelect = this.editUnloadPrefecturesSelect.pre2;
      }
      if (this.editSelect.state !== undefined) {
        //車種を変更した場合の処理
        this.editSelect = this.editSelect.state;
      }
      if (this.editSelect == "レッカー" || this.editSelect == "クレーン") {
        //トラック以外は重量なしにする
        this.editFormData.weight = "";
      }

      try {
        db = firebase.firestore();
        await db.collection("matters").doc(matterId).update({
          weight: this.editFormData.weight,
          modelOfCar: this.editSelect,
          pickupDate: this.editFormData.pickupDate,
          pickupTime: this.editFormData.pickupTime,
          pickupPrefecture: this.editPickupPrefecturesSelect,
          pickupLocation: this.editFormData.pickupLocation,
          unloadDate: this.editFormData.unloadDate,
          unloadTime: this.editFormData.unloadTime,
          unloadPrefecture: this.editUnloadPrefecturesSelect,
          unloadLocation: this.editFormData.unloadLocation,
        });
        alert("登録しました");
      } catch (console) {
        alert(console.message);
      }
    },

    async logicalDelete(matterId) {
      try {
        db = firebase.firestore();
        await db.collection("matters").doc(matterId).delete();
        this.askMatters = [];
        this.getFilterMtatter();
        alert("削除しました");
      } catch (console) {
        alert(console.message);
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
