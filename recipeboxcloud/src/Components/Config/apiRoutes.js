const API_ROUTES={

    AUTH: {
        LOGIN: 'https://4.155.115.159:8443/auth/login',
        REGISTER: 'https://4.155.115.159:8443/auth/register',
    },

    AZURE_IMAGES:{
        UPLOAD_PROFILE: 'https://4.155.115.159:8443/upload/foto',
        UPLOAD_RECIPE: 'https://4.155.115.159:8443/upload/foto'
    },

    RECIPES:{
        CREATE: 'https://4.155.115.159:8443/recetas/crear',
        GET_ALL: 'https://4.155.115.159:8443/recetas/get_all',
        GET_ALL_BY_USER: 'https://4.155.115.159:8443/recetas/mis-recetas',
    },

    FAVORITES:{
        GET_FAVORITES: 'https://4.155.115.159:8443/favoritos/mis-favoritas',
        AGREGAR_FAVORITO:  (id_receta) => `https://4.155.115.159:8443/favoritos/add/${id_receta}`,
        QUITAR_FAVORITO: (id_receta) => `https://4.155.115.159:8443/favoritos/remove/${id_receta}`,
        VERIFICAR_FAVORITO: (id_receta) => `https://4.155.115.159:8443/favoritos/check/${id_receta}`,
    }
};

export default API_ROUTES;