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
        GET_ALL: '/recipes',
        GET_BY_ID: (id) => `/recipes/${id}`,
    }
}

export default API_ROUTES;