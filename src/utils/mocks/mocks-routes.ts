const ROUTES = {
    USER: {
        INSCRIPTION: '/signup',
        CONNEXION: '/login',
        DECONNEXION: '/logout',
        GET_USER: '/profile',
        UPDATE_USER: '/profile',
        DELETE_USER: '/profile',
        REFRESH_TOKEN: '/refresh/:userID',
    },
    
    ARTICLE: {
        CREATE: '',
        UPDATE: '',
        DELETE: '',
        GET: '',
        GET_ALL: '',
    },
    
    UPLOAD: {
        UPLOAD: '/upload',
    }
}

export default  ROUTES;