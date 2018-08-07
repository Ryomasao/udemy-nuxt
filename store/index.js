import Vuex from 'vuex';
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null,
    },
    mutations: {
      setPosts(state, posts) {
        state.loadedPosts = posts;
      },
      addPost(state, post) {
        state.loadedPosts.push(post);
      },
      editPost(state, editedPost) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id === editedPost.id
        );
        state.loadedPosts[postIndex] = editedPost;
      },
      setToken(state, token) {
        state.token = token;
      },
      clearToken(state) {
        state.token = null;
      }
    },
    actions: {
      nuxtServerInit(vuexContext, context) {
        return context.app.$axios
        .$get(process.env.baseUrl + '/posts.json')
        .then(data => {
          const postsArray = [];
          for (const key in data) {
            postsArray.push({ ...data[key], id: key })
          }
          vuexContext.commit('setPosts', postsArray)
        })
      },
      addPost(vuexContext, post) {
        const createdPost = {
          ...post,
          updatedDate: new Date()
        }
        return this.$axios.
        $post(process.env.baseUrl + '/posts.json?auth=' + vuexContext.state.token, createdPost)
        .then((data) => {
          vuexContext.commit('addPost', {...createdPost , id: data.name})
        })
        .catch((e)=>{
          console.log(e);
        })
      },
      editPost(vuexContext, editedPost) {
        return this.$axios.$put(process.env.baseUrl + '/posts/' +
        editedPost.id +  
        '.json?auth=' + vuexContext.state.token,  editedPost)
        .then(res => {
          vuexContext.commit('editPost', editedPost)
        })
        .catch((e)=>{
          console.log(e);
        })
      },
      setPosts(vuexContext, posts) {
        vuexContext.commit('setPosts', posts)
      },
      authenticateUser(vuexContext, authData) {
        console.log(process.env.API_KEY);
        console.log(process.env.fbAPIKey);
        let authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + process.env.fbAPIKey;

        if(!authData.isLogin) {
          authUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + process.env.fbAPIKey;
        }

        return this.$axios
        .$post(authUrl, {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true 
        })
        .then(data => {
          vuexContext.commit('setToken', data.idToken);
          localStorage.setItem('token', data.idToken);
          localStorage.setItem('tokenExpiration',
                              new Date().getTime() + Number.parseInt(data.expiresIn) * 1000);

          Cookie.set('jwt', data.idToken);
          Cookie.set('expirationDate', 
                    new Date().getTime() + Number.parseInt(data.expiresIn) * 1000);

          //うーん、SSRを行っているサーバとこのAPIを実行しているexpressのサーバは一緒なのかなんなのか謎だ。
          //templateでseviersideにexpressを指定するとなんとなくわかるかも？
          /*
          return this.$axios.$post('http://192.168.33.34:3000/api/track-data', {
            data: 'Authenticated'
          });
          */
        })
        .catch(e => console.log(e));
      },
      initAuth(vuexContext, req) {
        let token;
        let expirationDate;

        if(req) {
          //server側で実行した場合
          if(!req.headers.cookie)  {
            return;
          }

          const jwtCookie = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='));
            if(!jwtCookie) {
              return ;
            }

          token = jwtCookie.split('=')[1];
          expirationDate = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('expirationDate='))
            .split('=')[1];
        } else {
          //client側で実行した場合
          //こっちもcookieでよかったり。
          token = localStorage.getItem('token');
          expirationDate = localStorage.getItem('tokenExpiration');

        }
        //+expireationDate は Numper.parseInt()と同じ。string to number
        if(new Date().getTime() > +expirationDate || !token) {
          console.log('No token or invalid token');
          vuexContext.dispatch('logout');
          vuexContext.commit('clearToken');
          return ;
        }
        vuexContext.commit('setToken', token);
      },
      logout(vuexContext) {
        vuexContext.commit('clearToken');
        Cookie.remove('jwt');
        Cookie.remove('expirationDate');
        //logoutのアクションってサーバーサイドの実行はなさそうだけれども
        //動画だとこうしてた。お作法的なものなのかな。
        if (process.client) {
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
        }
      }
    },
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    },
  });
};

export default createStore;