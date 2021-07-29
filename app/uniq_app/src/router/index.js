import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase";

// -----------------------------ベースコンポーネント-----------------------------
import BaseLayout from '../views/BaseLayout.vue'
import DefaultPage from '../views/main_components/DefaultPage.vue'
import Dashboard from '../views/main_components/Dashboard'


// -----------------------------依頼-----------------------------
import NewRequest from '../views/main_components/ask/NewRequest'
import AskTransportStatus from '../views/main_components/ask/AskTransportStatus'
// -----------------------------受託-----------------------------
import MattersList from '../views/main_components/entrusted/MattersList'
import EntrustedTransportStatus from '../views/main_components/entrusted/EntrustedTransportStatus'
// -----------------------------マイページ-----------------------------
import MypageTransportStatus from '../views/main_components/mypage/MyPageTransportStatus'

import History from '../views/main_components/History'
import CompanyInformation from '../views/main_components/CompanyInformation'
// -----------------------------管理者-----------------------------
import AdminPage from '../views/main_components/admin/AdminPage'
import AdminInsurance from '../views/main_components/admin/AdminInsurance'
// -----------------------------開発者-----------------------------
import DeveloperUser from '../views/main_components/DeveloperUser'
import DeveloperMatter from '../views/main_components/DeveloperMatter'
import DeveloperPage from '../views/main_components/DeveloperPage'
// -----------------------------認証-----------------------------
import Sign_up from '../views/main_components/auth/Sign_up.vue'
import Sign_in from '../views/main_components/auth/Sign_in.vue'

Vue.use(VueRouter)

const routes = [{
    //--------------------存在しないページ------------------------
    path: '*',
    redirect: 'signin'
  },
  //--------------------ベース------------------------
  {
    path: '/main-menu',
    name: 'BaseLayout',
    component: BaseLayout,
    meta: {
      requiresAuth: true
    },
    children: [{
        //--------------------管理ページのホーム-------------------------
        path: 'mypage-home',
        component: DefaultPage
      },
      //--------------------マイページダッシュボード------------------------
      {
        path: 'mypage-dashboard',
        name: 'mypage-dashboard',
        component: Dashboard
      },
      //--------------------管理ページ新規依頼------------------------
      // {
      //   path: 'mypage-new-request',
      //   name: 'mypage-new-request',
      //   component: NewRequest
      // },
      //--------------------管理ページ配送状況------------------------
      {
        path: 'mypage-transport-status',
        name: 'mypage-transport-status',
        component: MypageTransportStatus
      },
      //--------------------マイページ履歴------------------------
      {
        path: 'mypage-history',
        name: 'mypage-history',
        component: History
      },
      //--------------------マイページ会社情報------------------------
      {
        path: 'mypage-company-information',
        name: 'mypage-company-information',
        component: CompanyInformation
      },
      //========================================================================
      //依頼ページ
      //========================================================================
      //--------------------依頼ページのホーム------------------------
      {
        path: 'ask-home',
        component: DefaultPage
      },
      //--------------------依頼ページダッシュボード------------------------
      {
        path: 'ask-dashboard',
        name: 'ask-dashboard',
        component: Dashboard
      },
      //--------------------依頼ページ新規依頼------------------------
      {
        path: 'ask-new-request',
        name: 'ask-new-request',
        component: NewRequest
      },
      //--------------------依頼ページ配送状況------------------------
      {
        path: 'ask-transport-status',
        name: 'ask-transport-status',
        component: AskTransportStatus
      },
      //--------------------依頼ページ履歴------------------------
      {
        path: 'ask-history',
        name: 'ask-history',
        component: History
      },
      //--------------------依頼ページ会社情報------------------------
      {
        path: 'ask-company-information',
        name: 'ask-company-information',
        component: CompanyInformation
      },
      //========================================================================
      // 受託ページ
      //========================================================================
      //--------------------受託ページのホーム------------------------
      {
        path: 'entrusted-home',
        component: DefaultPage
      },
      //--------------------受託ページダッシュボード------------------------
      {
        path: 'entrusted-dashboard',
        name: 'entrusted-dashboard',
        component: Dashboard
      },
      //--------------------受託ページ新規依頼------------------------
      // {
      //   path: 'entrusted-new-request',
      //   name: 'entrusted-new-request',
      //   component: NewRequest
      // },
      //--------------------受託ページ配送状況------------------------
      {
        path: 'entrusted-transport-status',
        name: 'entrusted-transport-status',
        component: EntrustedTransportStatus
      },
      //--------------------受託ページ履歴------------------------
      {
        path: 'entrusted-history',
        name: 'entrusted-history',
        component: History
      },
      //--------------------受託ページ会社情報------------------------
      {
        path: 'entrusted-company-information',
        name: 'entrusted-company-information',
        component: CompanyInformation
      },
      //--------------------受託ページ案件一覧------------------------
      {
        path: 'entrusted-matters-list',
        name: 'entrusted-matters-list',
        component: MattersList
      },
      //========================================================================
      //管理者ページ
      //========================================================================
      // -----------------------------管理者ページ-----------------------------
      {
        path: 'admin-page',
        name: 'admin-page',
        component: AdminPage
      },
      // -----------------------------管理者 保険番号-----------------------------
      {
        path: 'admin-insurance',
        name: 'admin-insurance',
        component: AdminInsurance
      },
      //========================================================================
      //開発者ページ
      //========================================================================
      // -----------------------------開発者ページ-----------------------------
      {
        path: 'developer-page',
        name: 'developer-page',
        component: DeveloperPage
      },
      // -----------------------------開発者ユーザー-----------------------------
      {
        path: 'developer-user',
        name: 'developer-user',
        component: DeveloperUser
      },
      // -----------------------------開発者案件-----------------------------
      {
        path: 'developer-matter',
        name: 'developer-matter',
        component: DeveloperMatter
      },

    ]
  },
  //========================================================================
  //認証
  //========================================================================
  //--------------------サインアップ------------------------
  {
    path: '/signup',
    name: 'Sign_up',
    component: Sign_up,
  },
  //--------------------サインイン------------------------
  {
    path: '/signin',
    name: 'Sign_in',
    component: Sign_in
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {
        next({
          path: '/signin',
          query: {
            redirect: to.fullPath
          }
        })
      }
    })
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router
