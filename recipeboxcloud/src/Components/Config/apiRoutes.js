const API_ROUTES={

    AUTH: {
        LOGIN: 'http://4.155.115.159:9000/auth/login',
        REGISTER: 'http://4.155.115.159:9000/auth/register',
    },

    AZURE_IMAGES:{
        UPLOAD_PROFILE: '/azure/upload',
        UPLOAD_RECIPE: '/azure/upload-recipe-image'
    },

    RECIPES:{
        CREATE: 'http://4.155.115.159:9000/recetas/crear',
        GET_ALL: 'http://4.155.115.159:9000/recetas/get_all',
        GET_ALL_BY_USER: 'http://4.155.115.159:9000/recetas/mis-recetas',
    },

    FAVORITES:{
        GET_FAVORITES: 'http://4.155.115.159:9000/favoritos/mis-favoritas',
        AGREGAR_FAVORITO:  (id_receta) => `http://4.155.115.159:9000/favoritos/add/${id_receta}`,
        QUITAR_FAVORITO: (id_receta) => `http://4.155.115.159:9000/favoritos/remove/${id_receta}`,
        VERIFICAR_FAVORITO: (id_receta) => `http://4.155.115.159:9000/favoritos/check/${id_receta}`,
    }
};

export default API_ROUTES;