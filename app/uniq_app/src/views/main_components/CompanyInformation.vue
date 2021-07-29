<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <table class="tbl-r02">
          <!-- <tr>
            <th colspan="2" style="background-color: black;">会社情報</th>
          </tr> -->
          <tr>
            <th>会社名</th>
            <td>{{ formData.companyName }}</td>
          </tr>
          <tr>
            <th>住所</th>
            <td>{{ formData.companyAddress }}</td>
          </tr>
          <tr>
            <th>担当者名</th>
            <td>{{ formData.companyStaff }}</td>
          </tr>
          <tr>
            <th>連絡先</th>
            <td>{{ formData.companyTelephone }}</td>
          </tr>
          <!-------------------------------搬送者、両方の場合------------------------------->
          <template
            v-if="
              companyInfo.userType === 'transporer' ||
              companyInfo.userType === 'bothUser'
            "
          >
            <tr>
              <th>法人番号</th>
              <td>{{ formData.CorporateNumber }}</td>
            </tr>
            <tr class="last">
              <th>運送保険番号</th>
              <td>{{ formData.TransportInsuranceNum }}</td>
            </tr>
          </template>
          <tr>
            <th colspan="2" style="background-color: white; border: 0px">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                編集
              </v-btn>
            </th>
          </tr>
        </table>
      </template>
      <!--======================================================================-->
      <!-- 入力フォーム -->
      <!--======================================================================-->
      <v-card>
        <v-card-title>
          <span class="headline"> 会社情報 </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <!-------------------------------荷主の場合------------------------------->
              <template v-if="companyInfo.userType === 'client'">
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.companyName"
                    label="会社名*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.companyAddress"
                    label="住所*"
                    required
                  ></v-text-field>
                </v-col>
              </template>
              <!-------------------------------共通------------------------------->
              <v-col cols="12">
                <v-text-field
                  v-model="formData.companyStaff"
                  label="担当者名*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.companyTelephone"
                  label="連絡先*"
                  type="tel"
                  placeholder="電話番号入力"
                  autocomplete="tel"
                  required
                ></v-text-field>
              </v-col>
              <!-------------------------------搬送者、両方の場合------------------------------->
              <template
                v-if="
                  companyInfo.userType === 'transporter' ||
                  companyInfo.userType === 'bothUser'
                "
              >
                <!--==================================-->
                <!-- 集荷荷下ろし切り替えタブ -->
                <!--==================================-->
                <ul class="tabs">
                  <button id="button1">
                    <li
                      v-on:click="change('1')"
                      v-bind:class="{ active: isActive === '1' }"
                    >
                      集荷対応エリア
                    </li>
                  </button>
                  <button id="button2">
                    <li
                      v-on:click="change('2')"
                      v-bind:class="{ active: isActive === '2' }"
                    >
                      荷下ろし対応エリア
                    </li>
                  </button>
                </ul>
                <!--==================================-->
                <!-- 地域選択(集荷) -->
                <!--==================================-->
                <ul class="contents">
                  <li v-if="isActive === '1'">
                    <v-card flat>
                      <v-card-text>
                        <h5>東北</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="福島県"
                                value="福島県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="青森県"
                                value="青森県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="岩手県"
                                value="岩手県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="宮城県"
                                value="宮城県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="秋田県"
                                value="秋田県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="山形県"
                                value="山形県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>関東</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="茨城県"
                                value="茨城県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="栃木県"
                                value="栃木県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="神奈川県"
                                value="神奈川県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="群馬県"
                                value="群馬県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="埼玉県"
                                value="埼玉県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="千葉県"
                                value="千葉県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="東京都"
                                value="東京都"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>中部</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="愛知県"
                                value="愛知県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="静岡県"
                                value="静岡県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="石川県"
                                value="石川県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="福井県"
                                value="福井県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="山梨県"
                                value="山梨県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="富山県"
                                value="富山県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="長野県"
                                value="長野県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="岐阜県"
                                value="岐阜県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="新潟県"
                                value="新潟県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>近畿</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="大阪府"
                                value="大阪府"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="兵庫県"
                                value="兵庫県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="和歌山県"
                                value="和歌山県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="滋賀県"
                                value="滋賀県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="三重県"
                                value="三重県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="京都府"
                                value="京都府"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="奈良県"
                                value="奈良県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>中国地方</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="広島県"
                                value="広島県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="岡山県"
                                value="岡山県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="山口県"
                                value="山口県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="島根県"
                                value="島根県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="鳥取県"
                                value="鳥取県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>四国</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="徳島県"
                                value="徳島県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="愛媛県"
                                value="愛媛県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="香川県"
                                value="香川県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="高知県"
                                value="高知県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>九州</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="福岡県"
                                value="福岡県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="佐賀県"
                                value="佐賀県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="鹿児島県"
                                value="鹿児島県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="熊本県"
                                value="熊本県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="大分県"
                                value="大分県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedStart"
                                label="長崎県"
                                value="長崎県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="宮崎県"
                                value="宮崎県"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </li>
                  <li v-else-if="isActive === '2'">
                    <v-card flat>
                      <v-card-text>
                        <h5>東北</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="福島県"
                                value="福島県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="青森県"
                                value="青森県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="岩手県"
                                value="岩手県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="宮城県"
                                value="宮城県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="秋田県"
                                value="秋田県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="山形県"
                                value="山形県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>関東</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="茨城県"
                                value="茨城県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="栃木県"
                                value="栃木県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedStart"
                                label="神奈川県"
                                value="神奈川県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="群馬県"
                                value="群馬県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="埼玉県"
                                value="埼玉県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="千葉県"
                                value="千葉県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="東京都"
                                value="東京都"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>中部</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="愛知県"
                                value="愛知県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="静岡県"
                                value="静岡県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="石川県"
                                value="石川県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="福井県"
                                value="福井県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="山梨県"
                                value="山梨県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="富山県"
                                value="富山県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="長野県"
                                value="長野県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="岐阜県"
                                value="岐阜県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="新潟県"
                                value="新潟県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>近畿</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="大阪府"
                                value="大阪府"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="兵庫県"
                                value="兵庫県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="和歌山県"
                                value="和歌山県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="滋賀県"
                                value="滋賀県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="三重県"
                                value="三重県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="京都府"
                                value="京都府"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="奈良県"
                                value="奈良県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>中国地方</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="広島県"
                                value="広島県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="岡山県"
                                value="岡山県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="山口県"
                                value="山口県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="島根県"
                                value="島根県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="鳥取県"
                                value="鳥取県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>四国</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="徳島県"
                                value="徳島県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="愛媛県"
                                value="愛媛県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="香川県"
                                value="香川県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="高知県"
                                value="高知県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4"> </v-col>
                          </v-row>
                        </v-container>
                        <h5>九州</h5>
                        <v-container fluid>
                          <v-row>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="福岡県"
                                value="福岡県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="佐賀県"
                                value="佐賀県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="鹿児島県"
                                value="鹿児島県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="熊本県"
                                value="熊本県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="大分県"
                                value="大分県"
                              ></v-checkbox>
                            </v-col>
                            <v-col cols="8" sm="5" md="4">
                              <v-checkbox
                                v-model="selectedGoal"
                                label="長崎県"
                                value="長崎県"
                              ></v-checkbox>
                              <v-checkbox
                                v-model="selectedGoal"
                                label="宮崎県"
                                value="宮崎県"
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>
                    </v-card>
                  </li>
                </ul>
                <v-row>
                  <h5>所持車種*</h5>
                  <v-col cols="8" sm="5" md="3">
                    <v-checkbox
                      v-model="carType"
                      label="トラック"
                      value="トラック"
                      v-on:click="carTypeChange('1')"
                      v-bind:class="{ active: carTypeisActive === '1' }"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="8" sm="5" md="3">
                    <v-checkbox
                      v-model="carType"
                      label="ユニック(クレーン)"
                      value="ユニック(クレーン)"
                      v-on:click="carTypeChange('2')"
                      v-bind:class="{ active: carTypeisActive === '2' }"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="8" sm="5" md="3">
                    <v-checkbox
                      v-model="carType"
                      label="レッカー"
                      value="レッカー"
                      v-on:click="carTypeChange('3')"
                      v-bind:class="{ active: carTypeisActive === '3' }"
                    ></v-checkbox>
                  </v-col>
                </v-row>

                <div v-for="car of carType" v-bind:key="car.index">
                  <div v-if="car == 'トラック'">
                    <div v-if="carTypeisActive === '1'">
                      <v-row>
                        <h5>トラックの種類*</h5>
                        <v-col cols="8" sm="5" md="">
                          <v-checkbox
                            v-model="truckType"
                            label="バン"
                            value="バン"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="truckType"
                            label="バン/ゲート"
                            value="バン/ゲート"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="8" sm="5" md="">
                          <v-checkbox
                            v-model="truckType"
                            label="ウイング"
                            value="ウイング"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="truckType"
                            label="ウイング/ゲート"
                            value="ウイング/ゲート"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="8" sm="5" md="">
                          <v-checkbox
                            v-model="truckType"
                            label="平"
                            value="平"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="truckType"
                            label="平/ゲート"
                            value="平/ゲート"
                          ></v-checkbox>
                        </v-col>
                      </v-row>

                      <h5>トラックの積載量*</h5>
                      <v-row>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="1t"
                            value="1"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="2t"
                            value="2"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="3t"
                            value="3"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="4t"
                            value="4"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="5t"
                            value="5"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="6t"
                            value="6"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="7t"
                            value="7"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="8t"
                            value="8"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="9t"
                            value="9"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="10t"
                            value="10"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="11t"
                            value="11"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="truckWeight"
                            label="12t"
                            value="12"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                  <div v-else-if="car == 'ユニック(クレーン)'">
                    <div v-if="carTypeisActive === '2'">
                      <v-row>
                        <h5>ユニック(クレーン)の種類*</h5>
                        <v-col cols="8" sm="5" md="">
                          <v-checkbox
                            v-model="uniqType"
                            label="1段ブーム"
                            value="1段ブーム"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="uniqType"
                            label="2段ブーム"
                            value="2段ブーム"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="8" sm="5" md="">
                          <v-checkbox
                            v-model="uniqType"
                            label="3段ブーム"
                            value="3段ブーム"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="uniqType"
                            label="4段ブーム"
                            value="4段ブーム"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="8" sm="5" md="">
                          <v-checkbox
                            v-model="uniqType"
                            label="5段ブーム"
                            value="5段ブーム"
                          ></v-checkbox>
                          <v-checkbox
                            v-model="uniqType"
                            label="6段ブーム"
                            value="6段ブーム"
                          ></v-checkbox>
                        </v-col>
                      </v-row>

                      <h5>ユニックの積載量*</h5>
                      <v-row>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="1t"
                            value="1"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="2t"
                            value="2"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="3t"
                            value="3"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="4t"
                            value="4"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="5t"
                            value="5"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="6t"
                            value="6"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="7t"
                            value="7"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="8t"
                            value="8"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="9t"
                            value="9"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="10t"
                            value="10"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="11t"
                            value="11"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" sm="5" md="2">
                          <v-checkbox
                            v-model="uniqWeight"
                            label="12t"
                            value="12"
                          ></v-checkbox>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                  <div v-else-if="car == 'レッカー'">
                    <div v-if="carTypeisActive === '3'">

                    </div>
                  </div>
                </div>
              </template>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="
              dialog = false;
              setData();
            "
          >
            キャンセル
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="
              dialog = false;
              save();
            "
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import firebase from "firebase/app";
import "firebase/firestore";
let db;
let account;

export default {
  data: () => ({
    db: "",
    account: "",
    companyInfo: {},
    selectedStart: [],
    selectedGoal: [],
    carType: [],
    truckType: [],
    truckWeight: [],
    uniqType: [],
    uniqWeight: [],
    isActive: "1",
    carTypeisActive: "1",
    formData: {
      companyName: "",
      companyAddress: "",
      CorporateNumber: "",
      companyStaff: "",
      companyTelephone: "",
    },
    dialog: false,
  }),
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //クリエイテッド
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  async created() {
    db = firebase.firestore();
    account = firebase.auth().currentUser;
    const userRef = await db.collection("users").doc(account.uid).get();
    this.companyInfo = userRef.data();
    this.formData.companyName = this.companyInfo.companyName;
    this.formData.companyAddress = this.companyInfo.companyAddress;
    this.formData.companyStaff = this.companyInfo.companyStaff;
    this.formData.companyTelephone = this.companyInfo.companyTelephone;
    // -----------------------------搬送・両方の場合-----------------------------
    if (
      this.companyInfo.userType === "transporter" ||
      this.companyInfo.userType === "bothUser"
    ) {
      this.formData.CorporateNumber = this.companyInfo.CorporateNumber;
      this.formData.TransportInsuranceNum = this.companyInfo.insuranceNumberData.number;
      if (this.companyInfo.serviceAreaStart != null) {
        this.selectedStart = this.companyInfo.serviceAreaStart;
      }
      if (this.companyInfo.serviceAreaGoal != null) {
        this.selectedGoal = this.companyInfo.serviceAreaGoal;
      }
      if (this.companyInfo.hasTrucks != null) {
        this.carType = this.companyInfo.hasTrucks;
      }
      if (this.companyInfo.truckWeight != null) {
        this.truckWeight = this.companyInfo.truckWeight;
      }
    }
  },
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  //メソッド
  //■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
  methods: {
    change: function (num) {
      this.isActive = num;
    },
    carTypeChange: function (num) {
      this.carTypeisActive = num;
    },
    //========================================================================
    //メソッド＿保存
    //========================================================================
    async save() {
      this.carType = this.carType.filter(value => value == "レッカー");
      let inputObject = {};
      if (this.companyInfo.userType === "client") {
        inputObject = {
          companyName: this.formData.companyName,
          companyAddress: this.formData.companyName,
          companyStaff: this.formData.companyStaff,
          companyTelephone: this.formData.companyTelephone,
        };
      } else {
        inputObject = {
          companyStaff: this.formData.companyStaff,
          companyTelephone: this.formData.companyTelephone,
          serviceAreaStart: this.selectedStart,
          serviceAreaGoal: this.selectedGoal,
          hasTrucks: this.truckType,
          truckWeight: this.truckWeight,
          hasUniqs: this.uniqType,
          uniqWeight: this.uniqWeight,
          hasWrecker: this.carType,
        };
      }
      try {
        await db.collection("users").doc(account.uid).update(inputObject);
        db = firebase.firestore();
        account = firebase.auth().currentUser;
        const userRef = await db.collection("users").doc(account.uid).get();
        this.companyData = userRef.data();
        // this.formData.companyName = this.companyData.companyName;
        alert("登録しました");
      } catch (error) {
        alert(error.message);
      }
    },
    async setData() {
      db = firebase.firestore();
      account = firebase.auth().currentUser;
      const userRef = await db.collection("users").doc(account.uid).get();

      this.companyInfo = userRef.data();
      // -----------------------------表示用（編集不可データ） -----------------------------
      this.formData.companyName = this.companyInfo.companyName;
      this.formData.companyAddress = this.companyInfo.companyAddress;
      this.formData.CorporateNumber = this.companyInfo.CorporateNumber;
      this.formData.TransportInsuranceNum = this.companyInfo.TransportInsuranceNum;
      // -----------------------------編集用データ----------------------------
      if (this.companyInfo.userType !== "client") {
        /* 荷主以外の場合 */
        this.formData.companyStaff = this.companyInfo.companyStaff;
        this.formData.companyTelephone = this.companyInfo.companyTelephone;
        if (this.companyInfo.serviceAreaStart != null) {
          this.selectedStart = this.companyInfo.serviceAreaStart;
        }
        if (this.companyInfo.serviceAreaGoal != null) {
          this.selectedGoal = this.companyInfo.serviceAreaGoal;
        }
        if (this.companyData.hasTrucks != null) {
          this.carType = this.companyData.hasTrucks;
        }
        if (this.companyData.truckWeight != null) {
          this.truckWeight = this.companyData.truckWeight;
        }
      }
    },
  },
};
</script>

<style scoped>
p {
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin: 60px auto 40px;
}
table {
  margin: 20px auto;
}
.tbl-r02 th {
  background: #3399ff;
  border: solid 1px #ccc;
  color: #fff;
  padding: 10px;
}
.tbl-r02 td {
  border: solid 1px #ccc;
  padding: 10px;
}

@media screen and (max-width: 640px) {
  .last td:last-child {
    border-bottom: solid 1px #ccc;
    width: 100%;
  }
  .tbl-r02 {
    width: 80%;
  }
  .tbl-r02 th,
  .tbl-r02 td {
    border-bottom: none;
    display: block;
    width: 100%;
  }
}

li {
  list-style: none;
}

.active {
  background-color: #eeeeee;
}
</style>
