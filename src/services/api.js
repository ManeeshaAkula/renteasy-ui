import axios from 'axios';
// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: false,
    timeout: 10000
});

// api.interceptors.request.use(
//     config => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     error => {
//         console.error('Request interceptor error:', error);
//         return Promise.reject(error);
//     }
// );

// api.interceptors.response.use(
//     response => response,
//     error => {
//         console.error('API response error:', error.message);
//         if (error.response && error.response.status === 401) {
//             localStorage.removeItem('token');
//             window.location.href = '/';
//         }
//         if (error.response && error.response.status === 500) {
//             console.error('Server error details:', error.response.data);
//         }

//         return Promise.reject(error);
//     }
// );

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const setAuthToken = (token) => {
    if (token) {
        console.log('Setting auth token:', token.substring(0, 20) + '...');
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        console.log('Clearing auth token');
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
    }
};

const token = localStorage.getItem('authToken');

if (token) {
    setAuthToken(token);
}

// export const login = async (credentials) => {
//     try {
//         const authRequest = {
//             username: credentials.username,
//             password: credentials.password,
//             role: credentials.role_id
//         };
//         console.log('Sending authentication request:', authRequest);
//         let response;
//         response = await api.post('/user/login', authRequest);
//         console.log(".........response in api", response)
//         if (response?.data && response.data?.data?.token) {
//             const token = response.data.data.token || response.data.data.jwt;
//             if (response.data?.data?.userId) {
//                 localStorage.setItem('userId', response.data.data.userId);
//             }

//             const authResponse = {
//                 token: token,
//                 userId: response.data.data.userId || 'unknown',
//             };
//             console.log('Returning auth response:', authResponse);
//             return authResponse;
//         } else {
//             return response;
//         }
//     } catch (error) {
//         if (error.response && error.response.status === 401) {
//             console.error('Authentication failed with 401:', error.response.data);
//             return {
//                 error: error.response.data.error || 'Incorrect username or password',
//                 message: error.response.data.error || 'Authentication failed. Please check your credentials.'
//             };
//         }
//         console.error('Login error:', error);
//         throw error;
//     }
// };

export const login = async (credentials) => {
    try {
        const authRequest = {
            username: credentials.username,
            password: credentials.password,
            role: credentials.role_id
        };

        const response = await api.post('/user/login', authRequest);
        console.log("........ response in login api", response)
        const token =
            response?.data?.data?.token ||
            response?.data?.data?.jwt ||
            response?.data?.token ||
            response?.data?.jwt;
        console.log("........ token in login api", token)
        if (!token) return response;

        setAuthToken(token);

        const user = response?.data?.data?.user || response?.data?.user || null;
        const userId = user?.id || response?.data?.data?.userId || response?.data?.userId || "";

        if (userId) localStorage.setItem("userId", String(userId));

        return {
            token,
            userId: userId || "unknown",
            user
        };
    } catch (error) {
        console.log("...... error in login api", error)
        if (error.response && error.response.status === 401) {
            return {
                error: error.response.data.error || "Incorrect username or password",
                message: error.response.data.error || "Authentication failed. Please check your credentials."
            };
        }
        throw error;
    }
};


export const register = async (userData) => {
    try {
        // Use direct API call for consistency
        const response = await api.post('/user/create', userData);
        console.log("........ signupresponse in api", response)
        // Handle successful response
        if (response.data && response.data.token) {
            // Store userId if it's returned in the response
            if (response.data.userId) {
                localStorage.setItem('userId', response.data.userId);
            }
        }
        return response.data;
    } catch (error) {
        console.error('Signup error:', error);
        return error;
    }
};

// Logout function
export const logout = () => {
    localStorage.removeItem("role"); // if you store role
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setAuthToken(null);
    // Redirect to login page
    window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

// Get current user type
export const getUserType = () => {
    return localStorage.getItem('role') || 'LENDER';
};

// Get current user ID (if you store it)
export const getUserId = () => {
    return localStorage.getItem('userId');
};

export const getRoleIdByCode = async (code) => {
    try {
        console.log("........code in api", code)
        const response = await api.get(`/reference-data/getByCode/${code}`, code);
        console.log("........ response in api role", response)
        return response.data;
    } catch (error) {
        console.log("...... error in role", error)
        console.error('Error while fetching user details:', error);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        console.log("........code in api", id)
        const response = await api.get(`/user/${id}`, id);
        console.log("........ response in api user", response)
        return response.data;
    } catch (error) {
        console.log("...... error in user getbyid", error)
        console.error('Error while fetching user details:', error);
        throw error;
    }
};

// export const createProduct = async (productData) => {
//     try {
//         console.log("........code in api", productData)
//         const response = await api.post(`/product/create`, productData);
//         console.log("........ response in api role", response)
//         return response.data;
//     } catch (error) {
//         console.log("...... error in role", error)
//         console.error('Error while adding product details:', error);
//         throw error;
//     }
// };

export const createProduct = async (productData) => {
    try {
        console.log("........code in api", productData);

        // ✅ Detect if we're sending FormData (with image)
        if (productData instanceof FormData) {
            const response = await axios.post(
                'http://localhost:3001/product/create',
                productData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            console.log("........ response (multipart) in api", response);
            return response.data;
        } else {
            // JSON fallback (no image)
            const response = await axios.post(
                'http://localhost:3001/product/create',
                productData,
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            console.log("........ response (json) in api", response);
            return response.data;
        }
    } catch (error) {
        console.error("...... error in createProduct", error);
        throw error;
    }
};

export const updateUserById = async (userId, payload) => {
    try {
        console.log("........ update user payload", payload);

        const response = await axios.put(
            `http://localhost:3001/user/${userId}`,
            payload,
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        console.log("........ response in updateMyProfile", response);
        return response;
    } catch (error) {
        console.error("...... error in updateMyProfile", error);
        throw error;
    }
};

export const getCategoryByCode = async (code) => {
    try {
        console.log("........code in api", code)
        const response = await api.get(`/reference-data/getByCategory/${code}`, code);
        console.log("........ response in api role", response)
        return response.data;
    } catch (error) {
        console.log("...... error in role", error)
        console.error('Error while fetching categories list:', error);
        throw error;
    }
};

// export const getProductsList = async () => {
//     try {
//         const response = await api.get(`/product/getAll`);
//         console.log("........ response in api role", response)
//         return response.data;
//     } catch (error) {
//         console.log("...... error in role", error)
//         console.error('Error while fetching Products list:', error);
//         throw error;
//     }
// };

export const getProductsList = async (q) => {
    try {
        const response = await api.get("/product/getAll", {
            params: q ? { q } : {}
        });
        return response.data;
    } catch (error) {
        console.error("Error while fetching Products list:", error);
        throw error;
    }
};

export const getProductsBySellerId = async (seller_id) => {
    try {
        console.log("........code in api", seller_id)
        const response = await api.get(`/product/getBySellerId/${seller_id}`);
        console.log("........ response in api role", response)
        return response.data;
    } catch (error) {
        console.log("...... error in role", error)
        console.error('Error while fetching Products list:', error);
        throw error;
    }
};






