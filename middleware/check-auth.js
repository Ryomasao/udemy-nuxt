export default function(context) {
    console.log('[Middleware] Check Auth');
    //clientで実行した場合、context.reqはundefinedになる
    context.store.dispatch('initAuth', context.req);
}