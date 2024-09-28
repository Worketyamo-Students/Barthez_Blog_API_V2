const ROUTES = {
    USER: {
        // After the root user/
        INSCRIPTION: '/signup',
        CONNEXION: '/login',
        DECONNEXION: '/logout',
        GET_USER: '/profile/:userID',
        UPDATE_USER: '/profile/:userID',
        DELETE_USER: '/profile/:userID',
        REFRESH_TOKEN: '/refresh/:userID',
    },
    
    BLOG: {
        // After the root item/
        CREATE_ONE_BLOG: '/',
        CREATE_MANY_BLOG: '/',
        GET_ONE_BLOG: '/:blogID',
        GET_MANY_BLOG: '/',
        UPDATE_BLOG: '/:blogID',
        DELETE_ONE_BLOG: '/:blogID',
        DELETE_MANY_BLOG: '/',
        LIKE_BLOG: '/:blogID'
    },
    
    UPLOAD: {
        UPLOAD: '/upload',
    }
}

export default  ROUTES;