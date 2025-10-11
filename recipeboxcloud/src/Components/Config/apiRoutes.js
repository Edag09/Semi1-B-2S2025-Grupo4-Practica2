const API_ROUTES={

    AUTH: {
        LOGIN: 'http://localhost:8080/auth/login',
        REGISTER: 'http://localhost:8080/auth/register',
    },

    AZURE_IMAGES:{
        UPLOAD_PROFILE: '/azure/upload',
        UPLOAD_RECIPE: '/azure/upload-recipe-image'
    },

    RECIPES:{
        CREATE: 'http://localhost:8080/recetas/crear',
        GET_ALL: 'http://localhost:8080/recetas/get_all',
        GET_ALL_BY_USER: 'http://localhost:8080/recetas/mis-recetas',
    },

    FAVORITES:{
        GET_FAVORITES: 'http://localhost:8080/favoritos/mis-favoritas',
        AGREGAR_FAVORITO:  (id_receta) => `http://localhost:8080/favoritos/add/${id_receta}`,
        QUITAR_FAVORITO: (id_receta) => `http://localhost:8080/favoritos/remove/${id_receta}`,
        VERIFICAR_FAVORITO: (id_receta) => `http://localhost:8080/favoritos/check/${id_receta}`,
    }
};

export default API_ROUTES;